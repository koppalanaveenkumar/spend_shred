from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from googleapiclient.discovery import build

from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings

from app.core import google_auth
from app.models.oauth import OAuthToken

import logging

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

logger = logging.getLogger(__name__)

@router.post("/register", response_model=Token)
def register(request: RegisterRequest, session: Session = Depends(get_session)):
    # Check if user exists
    existing_user = session.exec(select(User).where(User.email == request.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(request.password)
    new_user = User(email=request.email, full_name=request.full_name, hashed_password=hashed_password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Create token
    access_token = create_access_token(data={"sub": new_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": new_user.full_name or new_user.email
    }

@router.post("/login", response_model=Token)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Account not found. Please register first.")
        
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user.full_name or user.email
    }

@router.get("/google/login")
def login_google():
    authorization_url = google_auth.get_authorization_url()
    return RedirectResponse(url=authorization_url)

@router.get("/google/callback")
def callback_google(code: str, session: Session = Depends(get_session)):
    credentials = google_auth.get_credentials_from_code(code)
    
    # Get User Info
    service = build('oauth2', 'v2', credentials=credentials)
    user_info = service.userinfo().get().execute()
    email = user_info['email']
    name = user_info.get('name', '')
    
    # Check if user exists
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        # Create new user
        hashed_password = get_password_hash("google_oauth_" + email) # Placeholder
        user = User(email=email, full_name=name, hashed_password=hashed_password)
        session.add(user)
        session.commit()
        session.refresh(user)
    
    # Save OAuth Token
    oauth_token = session.exec(select(OAuthToken).where(OAuthToken.user_id == user.id)).first()
    if not oauth_token:
        oauth_token = OAuthToken(
            user_id=user.id,
            access_token=credentials.token,
            refresh_token=credentials.refresh_token
        )
        session.add(oauth_token)
    else:
        oauth_token.access_token = credentials.token
        if credentials.refresh_token:
            oauth_token.refresh_token = credentials.refresh_token
        session.add(oauth_token)
    
    session.commit()
    
    # Create JWT
    access_token = create_access_token(data={"sub": user.email})
    
    # Redirect to Frontend Callback
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/google-callback?token={access_token}&user={name}")

@router.get("/google/scan")
def scan_google(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Find token
    token = session.exec(select(OAuthToken).where(OAuthToken.user_id == current_user.id)).first()
    if not token:
        raise HTTPException(status_code=400, detail="Gmail not connected")
    
    from app.services.gmail_scanner import scan_gmail_for_subscriptions
    results = scan_gmail_for_subscriptions(token, session)
    
    return {"status": "success", "found": len(results), "subscriptions": results}

@router.get("/connections")
def get_connections(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    connections = {
        "google": False,
        "quickbooks": False,
        "xero": False
    }
    
    # Check Google
    google_token = session.exec(select(OAuthToken).where(OAuthToken.user_id == current_user.id)).first()
    logger.info(f"Checking connections for user {current_user.email} (ID: {current_user.id})")
    if google_token:
        logger.info(f"Found Google Token for user {current_user.id}")
        connections["google"] = True
    else:
        logger.info(f"No Google Token found for user {current_user.id}")
        
    return connections
        

from app.schemas.auth import UserUpdate

@router.put("/me", response_model=Token)
def update_user(request: UserUpdate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    user = session.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.full_name:
        user.full_name = request.full_name
    
    if request.password:
        user.hashed_password = get_password_hash(request.password)

    session.add(user)
    session.commit()
    session.refresh(user)

    # Return new token/info
    return {
        "access_token": create_access_token(data={"sub": user.email}),
        "token_type": "bearer",
        "user_name": user.full_name or user.email
    }

import os
from google_auth_oauthlib.flow import Flow
from app.core.config import settings

# Allow OAuth scope change (Google adds 'openid' automatically)
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'
# Allow HTTP for local testing
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.readonly'
]

def get_google_flow():
    return Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )

def get_authorization_url():
    flow = get_google_flow()
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    return authorization_url

def get_credentials_from_code(code: str):
    flow = get_google_flow()
    flow.fetch_token(code=code)
    return flow.credentials

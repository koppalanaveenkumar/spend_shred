import re
import logging
from datetime import datetime
from sqlmodel import Session, select
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from app.models.oauth import OAuthToken
from app.models.subscription import Subscription
from app.core.config import settings

logger = logging.getLogger(__name__)

def build_credentials(token: OAuthToken):
    return Credentials(
        token=token.access_token,
        refresh_token=token.refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=['https://www.googleapis.com/auth/gmail.readonly']
    )

def extract_amount(text: str) -> float:
    # Regex to find currency amounts like $9.99, $10, etc.
    match = re.search(r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', text)
    if match:
        try:
            return float(match.group(1).replace(',', ''))
        except ValueError:
            return 0.0
    return 0.0

def scan_gmail_for_subscriptions(token: OAuthToken, session: Session) -> list[Subscription]:
    creds = build_credentials(token)
    service = build('gmail', 'v1', credentials=creds)
    
    found_subscriptions = []

    # --- PASS 1: Receipts & Invoices (Active Spend) ---
    query_receipts = 'subject:(receipt OR invoice OR subscription OR "your order") -to:me'
    # Increased maxResults from 15 to 100 to catch older emails
    results_receipts = service.users().messages().list(userId='me', q=query_receipts, maxResults=100).execute()
    messages_receipts = results_receipts.get('messages', [])
    
    for msg in messages_receipts:
        try:
            msg_detail = service.users().messages().get(userId='me', id=msg['id']).execute()
            headers = msg_detail['payload']['headers']
            snippet = msg_detail.get('snippet', '')
            
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), "Unknown Subject")
            sender = next((h['value'] for h in headers if h['name'] == 'From'), "Unknown Sender")
            service_name = sender.split('<')[0].strip().replace('"', '')
            
            if not service_name: continue

            amount = extract_amount(subject)
            if amount == 0.0: amount = extract_amount(snippet)

            existing = session.exec(select(Subscription).where(Subscription.name == service_name)).first()
            if not existing:
                new_sub = Subscription(
                    name=service_name,
                    amount=amount,
                    team="Unassigned",
                    seats_total=1,
                    seats_unused=0,
                    status="active",
                    last_used=datetime.now().strftime("%Y-%m-%d")
                )
                session.add(new_sub)
                found_subscriptions.append(new_sub)
            else:
                # Update last used or amount if found again
                if existing.amount == 0.0 and amount > 0:
                    existing.amount = amount
                    session.add(existing)
                # Add to report even if existing, so user knows we saw it
                if existing not in found_subscriptions:
                    found_subscriptions.append(existing)

        except Exception as e:
            print(f"Error processing receipt {msg['id']}: {e}")
            continue

    # --- PASS 2: Inactivity & Zombie Detection ( The "Reaper" Pass ) ---
    # Look for "We miss you", "Come back", "Inactive"
    query_zombies = 'subject:("miss you" OR "come back" OR "inactive account" OR "log back in") -to:me'
    results_zombies = service.users().messages().list(userId='me', q=query_zombies, maxResults=10).execute()
    messages_zombies = results_zombies.get('messages', [])

    for msg in messages_zombies:
        try:
            msg_detail = service.users().messages().get(userId='me', id=msg['id']).execute()
            headers = msg_detail['payload']['headers']
            sender = next((h['value'] for h in headers if h['name'] == 'From'), "Unknown")
            service_name = sender.split('<')[0].strip().replace('"', '')

            if not service_name: continue
            
            print(f"DEBUG: Found ZOMBIE signal from {service_name}")

            existing = session.exec(select(Subscription).where(Subscription.name == service_name)).first()
            if existing:
                # Mark as Zombie if active
                if existing.status == "active":
                    existing.status = "zombie"
                    existing.seats_unused = existing.seats_total # Assume full waste
                    session.add(existing)
            else:
                # Found a dormant account we didn't even know we paid for?
                # Or maybe a free account we forgot. Let's add it as Zombie.
                new_zombie = Subscription(
                    name=service_name,
                    amount=0.0, # Unknown cost
                    team="Unassigned",
                    seats_total=1,
                    seats_unused=1,
                    status="zombie",
                    last_used="Long time ago"
                )
                session.add(new_zombie)
                found_subscriptions.append(new_zombie)

        except Exception as e:
            logger.error(f"Error processing zombie {msg['id']}: {e}")
            continue
            
    # Check if token was refreshed by the Google Client
    if creds.token and creds.token != token.access_token:
        logger.info("Access token refreshed. Updating DB...")
        token.access_token = creds.token
        session.add(token)
        
    session.commit()
    return found_subscriptions

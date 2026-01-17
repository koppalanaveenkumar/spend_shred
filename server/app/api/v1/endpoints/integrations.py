from fastapi import APIRouter, HTTPException
from app.schemas.integration import IntegrationRequest
import time

router = APIRouter(
    prefix="/integrations",
    tags=["integrations"]
)

@router.post("/connect")
def connect_integration(request: IntegrationRequest):
    time.sleep(1.5)
    if "error" in request.apiKey:
        raise HTTPException(status_code=400, detail="Invalid API Key or Connection Failed")
    return {"status": "connected", "service": request.service}

@router.post("/analyze")
def analyze_subscriptions():
    time.sleep(2)
    return {
        "analyzed_count": 142,
        "zombies_found": 12,
        "potential_savings": 3240
    }

from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session
from app.core.database import get_session
from app.models.subscription import Subscription
from app.services.subscription_service import SubscriptionService

router = APIRouter(
    prefix="/subscriptions",
    tags=["subscriptions"]
)

def get_service(session: Session = Depends(get_session)) -> SubscriptionService:
    return SubscriptionService(session)

@router.get("", response_model=List[Subscription])
def get_subscriptions(service: SubscriptionService = Depends(get_service)):
    return service.get_all()

@router.post("", response_model=Subscription)
def create_subscription(subscription: Subscription, service: SubscriptionService = Depends(get_service)):
    return service.create(subscription)

@router.patch("/{sub_id}", response_model=Subscription)
def update_subscription(sub_id: int, subscription: Subscription, service: SubscriptionService = Depends(get_service)):
    updated_sub = service.update(sub_id, subscription.model_dump(exclude_unset=True))
    if not updated_sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return updated_sub

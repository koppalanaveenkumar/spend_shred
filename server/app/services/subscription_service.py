from sqlmodel import Session, select
from typing import List, Optional
from app.models.subscription import Subscription

class SubscriptionService:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Subscription]:
        return self.session.exec(select(Subscription)).all()

    def create(self, subscription: Subscription) -> Subscription:
        self.session.add(subscription)
        self.session.commit()
        self.session.refresh(subscription)
        return subscription

    def update(self, sub_id: int, subscription_data: dict) -> Optional[Subscription]:
        db_sub = self.session.get(Subscription, sub_id)
        if not db_sub:
            return None
        
        for key, value in subscription_data.items():
            setattr(db_sub, key, value)
        
        self.session.add(db_sub)
        self.session.commit()
        self.session.refresh(db_sub)
        return db_sub
    
    def seed_initial_data(self):
        if not self.session.exec(select(Subscription)).first():
            seed_data = [
                Subscription(name="Notion", team="Engineering", amount=120, seats_total=12, seats_unused=0, status="active", last_used="2h ago"),
                Subscription(name="Figma", team="Design", amount=450, seats_total=10, seats_unused=3, status="zombie", last_used="3mo ago"),
                Subscription(name="ChatGPT Plus", team="Marketing", amount=200, seats_total=10, seats_unused=8, status="critical", last_used="Unknown"),
                Subscription(name="Linear", team="Product", amount=80, seats_total=8, seats_unused=0, status="active", last_used="1d ago"),
                Subscription(name="Adobe CC", team="Design", amount=600, seats_total=5, seats_unused=1, status="zombie", last_used="4mo ago"),
            ]
            for sub in seed_data:
                self.session.add(sub)
            self.session.commit()

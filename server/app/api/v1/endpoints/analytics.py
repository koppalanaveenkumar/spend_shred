from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.subscription import Subscription

router = APIRouter(
    prefix="/stats",
    tags=["analytics"]
)

@router.get("")
def get_stats(session: Session = Depends(get_session)):
    subscriptions = session.exec(select(Subscription)).all()
    
    total_spend = sum(sub.amount for sub in subscriptions if sub.status == "active")
    
    wasted_spend = 0
    zombie_count = 0
    active_fully_used = 0
    active_with_waste = 0
    zombie_count = 0
    
    for sub in subscriptions:
        if sub.status == "active":
            # Check if it has unused seats
            if sub.seats_total > 0 and sub.seats_unused > 0:
                active_with_waste += 1
                seat_cost = sub.amount / sub.seats_total
                wasted_spend += seat_cost * sub.seats_unused
            else:
                active_fully_used += 1
                
        elif sub.status in ["zombie", "critical"]:
            zombie_count += 1
            wasted_spend += sub.amount # Full amount is waste for zombies
            
    # Calculate health score (Mock logic for now based on waste ratio)
    health_score = 100
    if total_spend > 0:
        waste_ratio = wasted_spend / (total_spend + wasted_spend)
        health_score = max(0, 100 - int(waste_ratio * 100))
    # Calculate Spend by Team
    spend_by_team = {}
    for sub in subscriptions:
        if sub.status == "active":
            team = sub.team or "Unassigned"
            spend_by_team[team] = spend_by_team.get(team, 0) + sub.amount
            
    # Sort by spend desc
    sorted_teams = [{"team": k, "amount": v} for k, v in sorted(spend_by_team.items(), key=lambda item: item[1], reverse=True)]

    return {
        "total_spend": total_spend,
        "wasted_spend": wasted_spend,
        "active_subs": active_fully_used + active_with_waste,
        "active_fully_used": active_fully_used,
        "active_with_waste": active_with_waste,
        "zombie_count": zombie_count,
        "health_score": health_score,
        "spend_by_team": sorted_teams
    }

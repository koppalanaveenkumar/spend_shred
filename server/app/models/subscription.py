from typing import Optional
from sqlmodel import Field, SQLModel

class Subscription(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    team: str = Field(default="Unassigned")
    amount: float
    seats_total: int
    seats_unused: int
    status: str = Field(default="active")  # active, zombie, critical, cancelled
    last_used: str = Field(default="Unknown")

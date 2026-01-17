from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, Text
from datetime import datetime, timezone

class OAuthToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    provider: str = "google"
    access_token: str = Field(sa_column=Column(Text))
    refresh_token: Optional[str] = Field(default=None, sa_column=Column(Text))
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

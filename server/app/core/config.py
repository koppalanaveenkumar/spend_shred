from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SaaS Reaper API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./database.db"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    
    # Monitoring
    SENTRY_DSN: str | None = None
    WEBHOOK_URL: str | None = None
    
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000"]'
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:8000", "https://aiguardrails.vercel.app"]
    
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

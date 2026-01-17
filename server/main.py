from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import create_db_and_tables, get_session
from app.api.v1.api import api_router
from app.services.subscription_service import SubscriptionService
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    create_db_and_tables()
    
    # Seed data (Disabled for production/real usage)
    # with Session(engine) as session:
    #     service = SubscriptionService(session)
    #     service.seed_initial_data()
        
    yield

app = FastAPI(title="SpendShred API", lifespan=lifespan)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "SpendShred API is running (Modular)"}

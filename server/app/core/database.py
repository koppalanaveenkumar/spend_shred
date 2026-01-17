from sqlmodel import SQLModel, create_engine, Session

from app.core.config import settings

# Create engine based on configuration
connect_args = {}
if "sqlite" in str(settings.DATABASE_URL):
    connect_args["check_same_thread"] = False

engine = create_engine(
    str(settings.DATABASE_URL),
    connect_args=connect_args,
    pool_pre_ping=True,  # Check connection before usage (Fixes "MySQL Connection not available")
    pool_recycle=300,    # Recycle connections every 5 minutes
    pool_size=10,        # Maintain 10 connections
    max_overflow=20      # Allow up to 20 extra connections during spikes
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

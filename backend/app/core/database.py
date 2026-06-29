from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy Engine (like DbContext connection)
engine = create_engine(DATABASE_URL, echo=True)
# Basically Db connection manager, it is not the session it only managers the connection to the database. 
# It is used to create sessions and manage the connection pool.

# Session factory (like DbContext instance), not the session itself, but a factory to create sessions.
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)
# we'll use the session factory to create a new session in dependencies.py, using this line of code - db = SessionLocal()


# Base class for all models (like EF Core entities)
class Base(DeclarativeBase):
    pass
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

from fastapi import HTTPException, Depends

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
# The `connect_args` parameter is needed only for SQLite.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

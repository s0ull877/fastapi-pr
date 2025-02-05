from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

from config import Config


# The `connect_args` parameter is needed only for SQLite.
engine = create_engine(
    Config.get_db_url()
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

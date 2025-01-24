from sqlalchemy import Integer, Column
from sqlalchemy.orm import declarative_base, declared_attr
from sqlalchemy import Column, String, Boolean, Text, DateTime, UUID, Integer, Column

from datetime import datetime, timedelta
from uuid import uuid4

from .main import engine

class Base(object):

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
    
    id = Column(Integer, primary_key=True)

        
BaseModel = declarative_base(cls=Base)


class User(BaseModel):
    __tablename__ = 'user'

    username = Column(String(20), unique=True, nullable=False)
    image = Column(String, nullable=True)  # Store the file path or URL
    status = Column(Text, nullable=True, default=None)
    email = Column(String, unique=True, nullable=False)
    is_verified_email = Column(Boolean, default=False)
    password = Column(String, nullable=False)


class EmailVerification(BaseModel):
    __tablename__ = 'email_verification'

    code = Column(UUID(as_uuid=True), unique=True, default=uuid4)
    email = Column(String, unique=True, nullable=False)
    created = Column(DateTime, default=datetime.now())
    expiration = Column(DateTime, default=datetime.now() + timedelta(minutes=15))



BaseModel.metadata.create_all(bind=engine)
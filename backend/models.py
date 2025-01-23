import os

from sqlalchemy import Column, String, Boolean, Text, DateTime, UUID, Integer, ForeignKey
from sqlalchemy.orm import relationship

from datetime import datetime, timedelta
from uuid import uuid4

from database import engine, BaseModel

from settings import PWD_CONTEXT


class User(BaseModel):
    __tablename__ = 'user'

    username = Column(String(20), unique=True, nullable=False)
    image = Column(String, nullable=True)  # Store the file path or URL
    status = Column(Text, nullable=True, default=None)
    email = Column(String, unique=True, nullable=False)
    is_verified_email = Column(Boolean, default=False)
    password = Column(String, nullable=False)

    @classmethod
    def create(cls, *args, **kwargs):

        kwargs['password'] = PWD_CONTEXT.hash(kwargs['password'])
        return super().create(*args, **kwargs)



from settings import MAIL_CONF
from fastapi_mail import FastMail, MessageSchema, MessageType

class EmailVerification(BaseModel):
    __tablename__ = 'email_verification'

    code = Column(UUID(as_uuid=True), unique=True, default=uuid4)
    email = Column(String, unique=True, nullable=False)
    created = Column(DateTime, default=datetime.now())
    expiration = Column(DateTime, default=datetime.now() + timedelta(minutes=15))


    async def send_email(self):

        link = f'/email/verification?email={self.email}&code={self.code}'
        verify_link = os.getenv('HOSTNAME') + link

        message = MessageSchema(
            subject=f'Подтверждение учетной записи на hostname',
            recipients=[self.email],
            body=f'Для подтверждения учетной записи по почте {self.email} перейдите по ссылке: {verify_link}',
            subtype=MessageType.plain
        )

        fm = FastMail(MAIL_CONF)
        await fm.send_message(message)


    def is_expired(self):
        return datetime.now() >= self.expiration


# Establish relationships
User.metadata.create_all(bind=engine)

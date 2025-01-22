import os

from sqlalchemy import Column, String, Boolean, Text, DateTime, UUID, Integer, ForeignKey
from sqlalchemy.orm import relationship

from datetime import datetime, timedelta
from uuid import uuid4

from database import engine, BaseModel

from consts import PWD_CONTEXT


class User(BaseModel):
    __tablename__ = 'user'

    username = Column(String(20), unique=True, nullable=False)
    image = Column(String, nullable=True)  # Store the file path or URL
    status = Column(Text, nullable=True, default=None)
    email = Column(String, unique=True, nullable=False)
    is_verified_email = Column(Boolean, default=False)
    password = Column(String, nullable=False)

    def save(self, db):

        self.password = PWD_CONTEXT.hash(self.password)
        return super().save(db=db)



from consts import MAIL_CONF
from fastapi_mail import FastMail, MessageSchema, MessageType

class EmailVerification(BaseModel):
    __tablename__ = 'email_verification'

    code = Column(UUID(as_uuid=True), unique=True, default=uuid4)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    created = Column(DateTime, default=datetime.now())
    expiration = Column(DateTime, default=datetime.now() + timedelta(minutes=15))

    user = relationship('User', back_populates='email_verifications')

    def __str__(self):
        return f'EmailVerification for {self.user.email}'

    async def send_email(self):

        link = f'/users/verify?email={self.user.email}&code={self.code}'
        verify_link = os.getenv('HOSTNAME') + link

        message = MessageSchema(
            subject=f'Подтверждение учетной записи для {self.user.username}',
            recipients=[self.user.email],
            body=f'Для подтверждения учетной записи по почте {self.user.email} перейдите по ссылке: {verify_link}',
            subtype=MessageType.plain
        )

        fm = FastMail(MAIL_CONF)
        await fm.send_message(message)


    def is_expired(self):
        return datetime.now() >= self.expiration
    

# Establish relationships
User.email_verifications = relationship('EmailVerification', back_populates='user', cascade='all, delete-orphan')
User.metadata.create_all(bind=engine)

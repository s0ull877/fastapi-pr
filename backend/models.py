import os

from sqlalchemy import Column, String, Boolean, Text, DateTime, ForeignKey, UUID, Integer
from sqlalchemy.orm import relationship, declarative_base, Session, declared_attr
from sqlalchemy.exc import IntegrityError

from fastapi import HTTPException
from passlib.context import CryptContext
from datetime import datetime, timedelta
from uuid import uuid4

from database import engine

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Base(object):

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
    
    __table_args__ = {'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True)

    def save(self, db: Session):
        try:
            db.add(self)
            db.commit()
        except IntegrityError as ex:
            import re
            match = re.search(r'user\.([\w]+)', ex.args[0])
            field = match.group(1) if match else 'field'
            raise HTTPException(status_code=400, detail=f'This {field} is already busy!')
        else:
            return self
        
BaseModel = declarative_base(cls=Base)


class User(BaseModel):
    __tablename__ = 'user'

    username = Column(String(20), unique=True, nullable=False)
    image = Column(String, nullable=True)  # Store the file path or URL
    status = Column(Text, nullable=True, default=None)
    email = Column(String, unique=True, nullable=False)
    is_verified_email = Column(Boolean, default=False)
    password = Column(String, nullable=False)

    def save(self, db):
        self.password = pwd_context.hash(self.password)
        return super().save(db=db)




from smtplib import SMTP
from email.mime.text import MIMEText

class EmailVerification(BaseModel):
    __tablename__ = 'email_verification'

    code = Column(UUID(as_uuid=True), unique=True, default=uuid4)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    created = Column(DateTime, default=datetime.now())
    expiration = Column(DateTime, default=datetime.now() + timedelta(minutes=15))

    user = relationship('User', back_populates='email_verifications')

    def __str__(self):
        return f'EmailVerification for {self.user.email}'

    def send_verification_email(self, email_host_user):

        link = f'/users/verify?email={self.user.email}&code={self.code}'
        verify_link = os.getenv('HOSTNAME') + link
        subject = f'Подтверждение учетной записи для {self.user.username}'
        message = f'Для подтверждения учетной записи по почте {self.user.email} перейдите по ссылке: {verify_link}'

        msg = MIMEText(message)
        msg['Subject'] = subject
        msg['From'] = email_host_user
        msg['To'] = self.user.email

        with SMTP('localhost') as smtp:
            smtp.sendmail(email_host_user, [self.user.email], msg.as_string())

    def is_expired(self):
        return datetime.now() >= self.expiration
    

# Establish relationships
User.email_verifications = relationship('EmailVerification', back_populates='user', cascade='all, delete-orphan')
User.metadata.create_all(bind=engine)

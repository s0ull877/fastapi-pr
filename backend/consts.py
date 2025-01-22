import os

from passlib.context import CryptContext

from fastapi_mail import ConnectionConfig


MAIL_CONF = ConnectionConfig(
    MAIL_USERNAME = os.getenv('MAIL_USERNAME'),
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD'),
    MAIL_FROM = os.getenv('MAIL_FROM'),
    MAIL_PORT = os.getenv('MAIL_PORT'),
    MAIL_SERVER = os.getenv('MAIL_SERVER'),
    MAIL_FROM_NAME=os.getenv('MAIL_USERNAME'),
    MAIL_STARTTLS = False,
    MAIL_SSL_TLS = True,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True     
)


TRUSTED_ORIGINS = [
    "http://localhost:5173",  # Adjust the port if your frontend runs on a different one
]

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

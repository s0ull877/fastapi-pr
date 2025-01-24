from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from config import Config
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


mail_config = ConnectionConfig(
    MAIL_USERNAME = Config.MAIL_USERNAME,
    MAIL_PASSWORD = Config.MAIL_PASSWORD,
    MAIL_FROM = Config.MAIL_FROM,
    MAIL_PORT = Config.MAIL_PORT,
    MAIL_SERVER = Config.MAIL_SERVER,
    MAIL_FROM_NAME = Config.MAIL_FROM_NAME,
    MAIL_STARTTLS = Config.MAIL_STARTTLS,
    MAIL_SSL_TLS = Config.MAIL_SSL_TLS,
    USE_CREDENTIALS = Config.USE_CREDENTIALS,
    VALIDATE_CERTS = Config.VALIDATE_CERTS     
)

mail = FastMail(config=mail_config)

def create_message(subject:str, recipients: list[str], body: str):

    return MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype=MessageType.plain
    )
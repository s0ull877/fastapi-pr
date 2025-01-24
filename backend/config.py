
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    SECRET_KEY: str
    HOSTNAME: str
   
    REDIS_URL: str = "redis://localhost:6379/0"
   
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_FROM_NAME: str
    MAIL_STARTTLS: bool = False
    MAIL_SSL_TLS: bool = True
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
   
    TRUSTED_ORIGINS: list = ["http://localhost:5173",]
   
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


Config = Settings()


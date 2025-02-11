
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    BASE_DIR: Path = Path(__file__).parent 

    SECRET_KEY: str
    ALGORITHM: str
    
    FRONTENT_HOSTNAME: str

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

    DB_CORE: str
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str
   
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def get_db_url(self) -> str:
        return f"{self.DB_CORE}://{self.DB_USERNAME}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        


Config = Settings()


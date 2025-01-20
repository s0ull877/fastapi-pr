import os
from sqlalchemy.orm import Session

from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

from database import SessionLocal
from models import User, EmailVerification
from schemas import RegisterUser



mail_conf = ConnectionConfig(
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


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:5173",  # Adjust the port if your frontend runs on a different one
]




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins from the list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.post("/register", status_code=201)
async def register_user(user: RegisterUser, db: Session = Depends(get_db)):
        
    db_user = User(**user.model_dump())
    db_user.save(db=db)
    
    verification = EmailVerification(user_id=db_user.id)
    verification.save(db)
    
    link = f'/users/verify?email={db_user.email}&code={verification.code}'
    verify_link = os.getenv('HOSTNAME') + link

    message = MessageSchema(
        subject=f'Подтверждение учетной записи для {db_user.username}',
        recipients=[db_user.email],
        body=f'Для подтверждения учетной записи по почте {db_user.email} перейдите по ссылке: {verify_link}',
        subtype=MessageType.plain
    )

    fm = FastMail(mail_conf)
    await fm.send_message(message)

    return {'id': db_user.id}
import os
from sqlalchemy.orm import Session

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal
from models import User, EmailVerification
from schemas import RegisterUser

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:5173",  # Adjust the port if your frontend runs on a different one
]

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
def register_user(user: RegisterUser, db: Session = Depends(get_db)):
        user = User(**user.model_dump())
        user.save(db=db)
        verification = EmailVerification(user_id=user.id)
        verification.save(db)
        verification.send_verification_email()
        return {'id': user.id}
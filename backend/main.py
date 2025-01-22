from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware


from models import User, EmailVerification
from schemas import RegisterUser

from consts import TRUSTED_ORIGINS

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=TRUSTED_ORIGINS,  # Allows all origins from the list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.post("/register", status_code=201)
async def register_user(user: RegisterUser):
        
    db_user = User(**user.model_dump())
    db_user.save()
    
    verification = EmailVerification(user_id=db_user.id)
    verification.save()
    verification.send_email()


    return {'id': db_user.id}
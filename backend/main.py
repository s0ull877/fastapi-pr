from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware


from models import User, EmailVerification
from schemas import RegisterUser, EmailVerificationSchema

from settings import TRUSTED_ORIGINS

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
        
    db_user = User().create(**user.model_dump())
    
    verification = EmailVerification().create(email=db_user.email)
    verification.send_email()


    return {'id': db_user.id}


@app.post("/verify-email")
def verify_email(data: EmailVerificationSchema):

    verification = EmailVerification().get(email=data.email, code=data.code)
    if verification:
        
        user = User().get(email=data.email)
        user.update(is_verified_email=True)
        return {'success': True}


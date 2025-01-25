from datetime import timedelta, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from db.main import get_db

from .utils import create_access_token
from .service import UserService, EmailVerificationService
from .dependencies import RefreshTokenBearer, get_current_user
from .schemas import RegisterUser, EmailVerificationSchema, LoginUser


user_router = APIRouter()
user_service = UserService()
email_verification_service = EmailVerificationService()


@user_router.post("/register", status_code=201)
async def register_user(user: RegisterUser, db: Session = Depends(get_db)):
        
    db_user = user_service.create_user(db=db, **user.model_dump())
    
    verification = email_verification_service.create(db=db, email=db_user.email)
    await email_verification_service.send_message(verification)

    return {'id': db_user.id}


@user_router.post("/verify-email")
def verify_email(verify_data: EmailVerificationSchema, db: Session = Depends(get_db)):

    verification = email_verification_service.get(db=db, **verify_data.model_dump())

    if verification:
        
        user = user_service.get(db=db, email=verify_data.email)
        user_service.update(db=db, instance=user, is_verified_email=True)
        return {'success': True}
    


@user_router.post('/login')
def login(data: LoginUser, db: Session = Depends(get_db)):

    user= user_service.authenticate(
        db=db, 
        username=data.username, 
        plain_password=data.password
    )

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Неверный логин или пароль!')
    
    if not user.is_verified_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Почта пользователя не подтверждена!')
    
    access_token = create_access_token(
        user_data={
            'user_id': user.id,
            'username': user.username
        }
    )

    refresh_token = create_access_token(
        user_data={
            'user_id': user.id,
            'username': user.username
        },
        refresh=True,
        expiry=timedelta(days=2)
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"username": user.username, "id": user.id},        
    }


@user_router.get("/refresh_token")
async def get_new_access_token(token_details: dict = Depends(RefreshTokenBearer())):
    expiry_timestamp = token_details["exp"]

    if datetime.fromtimestamp(expiry_timestamp) > datetime.now():
        new_access_token = create_access_token(user_data=token_details["user"])

        return {"access_token": new_access_token}

    raise HTTPException(status_code=401, detail="User has provided an invalid or expired token")


@user_router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "username": user.username,
        "email": user.email
    }
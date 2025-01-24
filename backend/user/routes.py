from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

from .schemas import RegisterUser, EmailVerificationSchema, LoginUser

from .service import UserService, EmailVerificationService

from sqlalchemy.orm import Session
from db.main import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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
    

import os
from shortuid import uid
from datetime import timedelta, datetime
from fastapi.responses import FileResponse, JSONResponse
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form

from sqlalchemy.orm import Session

from config import Config
from db.main import get_db

from .utils import create_access_token
from .service import UserService, EmailVerificationService
from .dependencies import AccessTokenBearer, RefreshTokenBearer, get_current_user
from .schemas import RegisterUser, EmailVerificationSchema, LoginUser, ResponseUser


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

    verification = email_verification_service.get(db=db, filters=verify_data.model_dump())

    if verification:
        
        user = user_service.get(db=db, filters={'email': verify_data.email})
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
            'email': user.email
        }
    )

    refresh_token = create_access_token(
        user_data={
            'user_id': user.id,
            'email': user.email
        },
        refresh=True,
        expiry=timedelta(days=2)
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id, 
            "username": user.username, 
            'image': user.image,
            'status': user.status
        },        
    }



@user_router.get("/refresh_token")
async def get_new_access_token(token_details: dict = Depends(RefreshTokenBearer())):
    expiry_timestamp = token_details["exp"]

    if datetime.fromtimestamp(expiry_timestamp) > datetime.now():
        new_access_token = create_access_token(user_data=token_details["user"])

        return {"access_token": new_access_token}

    raise HTTPException(status_code=401, detail="User has provided an invalid or expired token")



@user_router.get("/{username}")
async def get_user(username: str, db: Session = Depends(get_db), token_details: dict = Depends(AccessTokenBearer())):

    user = user_service.get(db=db, filters={"username":username})

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found!")
    
    return user.to_dict(exclude=['is_verified_email'])



@user_router.get("/media/{filename}")
async def get_user_image(filename:str):

    path = str(Config.BASE_DIR) + f'/media/users/{filename}'

    if not os.path.exists(path):
        raise HTTPException(status_code=404)
    
    return FileResponse(path=path)



@user_router.post("/profile/edit")
async def edit_profile(
    username: str = Form(),
    status: str = Form(None),
    image: UploadFile = Form(None),
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)):

    response = {
        'update_fileds': {}
    }
    error = None

    if status != user.status:

        response['update_fileds']['status'] = status


    if image:

        filename = '{}_{}.png'.format(user.id, uid(6))
        path= str(Config.BASE_DIR) + '/media/users/' + filename
        
        with open(path, 'wb') as file:
            file.write(image.file.read())
        
        response['update_fileds']['image'] = Config.HOSTNAME + f'/api/v1/user/media/{filename}'

    if username and username != user.username:

        user_exist = user_service.get(username=username, db=db)
        
        if user_exist:
            error = 'Юзернейм занят'
        else:
            response['update_fileds']['username'] = username

    if response['update_fileds']:
        user = user_service.update(instance=user, db=db, **response['update_fileds'])


    return JSONResponse(content={'user': user.to_dict(exclude=['is_verified_email', 'email']), 'error': error}, status_code=200)
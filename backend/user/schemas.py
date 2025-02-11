from pydantic import BaseModel, EmailStr, UUID4

class LoginUser(BaseModel):

    username: str
    password: str

class RegisterUser(LoginUser):

    email: EmailStr


class ResponseUser(BaseModel):

    username : str
    image : str | None
    status : str | None
    email : EmailStr


class EmailVerificationSchema(BaseModel):

    email: EmailStr
    code: UUID4
from pydantic import BaseModel, EmailStr, UUID4

class RegisterUser(BaseModel):

    username: str
    email: EmailStr
    password: str


class EmailVerificationSchema(BaseModel):

    email: EmailStr
    code: UUID4
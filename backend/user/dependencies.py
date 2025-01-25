from datetime import date, datetime
from typing import Any, List

from fastapi import Depends, Request
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from db.main import get_db

from .service import UserService
from .utils import decode_token


user_service = UserService()


class TokenBearer(HTTPBearer):
    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials | None:
        creds = await super().__call__(request)

        token = creds.credentials

        token_data = decode_token(token)

        if not self.token_valid(token):
            raise HTTPException(status_code=401, detail="User has provided an invalid or expired token")

        self.verify_token_data(token_data)

        return token_data

    def token_valid(self, token: str) -> bool:
        token_data = decode_token(token)


        if token_data is None:
            return False

        return token_data

    def verify_token_data(self, token_data):
        raise NotImplementedError("Please Override this method in child classes")



class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and token_data["refresh"]:
            raise HTTPException(status_code=401, detail="User has provided a refresh token when an access token is needed")



class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and not token_data["refresh"]:
            raise HTTPException(status_code=401, detail="User has provided a access token when an refresh token is needed")




async def get_current_user(
    token_details: dict = Depends(AccessTokenBearer()),
    db: Session = Depends(get_db),
):
    user_id = token_details["user"]["user_id"]

    user = user_service.get(db, id=user_id)

    return user

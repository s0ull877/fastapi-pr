from sqlalchemy.orm import Session

from db.models import User, EmailVerification
from db.services import BaseService

from .utils import generate_passwd_hash

from config import Config
from mail import create_message, mail

class UserService(BaseService):

    model_class=User

    def create_user(self, db: Session, **kwargs) -> User:

        kwargs['password'] = generate_passwd_hash(kwargs['password'])
        return super().create(db, **kwargs)
    

class EmailVerificationService(BaseService):

    model_class=EmailVerification


    async def send_message(self, obj: EmailVerification):

        link = f'/email/verification?email={obj.email}&code={obj.code}'
        verify_link = Config.HOSTNAME + link

        message = create_message(
            subject=f'Подтверждение учетной записи на hostname',
            recipients=[obj.email],
            body=f'Для подтверждения учетной записи по почте {obj.email} перейдите по ссылке: {verify_link}',
        )

        await mail.send_message(message=message)

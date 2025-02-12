from sqlalchemy.orm import Session

from db.models import PostComment
from db.services import BaseService


class PostCommentService(BaseService):

    model_class=PostComment


    def get(self, db: Session, options: list =[], filters: dict = []):
        
        return super().get(db, options, filters)


    def get_multi(
            self,
            db: Session,
            order: str = "id",
            limit: int = 100,
            offset: int = 0,
            options: list = [],
            filters: dict = {}
        ) -> list:
        
        return super().get_multi(db, order, limit, offset, options, filters)
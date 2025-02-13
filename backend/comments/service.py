from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload


from db.models import PostComment, Post
from db.services import BaseService


class PostCommentService(BaseService):

    model_class=PostComment


    def get_new_by_owner(self, db: Session, user:int):

        stmt = (
            select(self.model_class)
            .options(joinedload(self.model_class.owner), joinedload(self.model_class.post))
            .join(self.model_class.post)
            .filter(self.model_class.status == False, Post.owner == user)
            .order_by(self.model_class.id.desc())
        )

        result = db.execute(stmt)
        return result.scalars().all()
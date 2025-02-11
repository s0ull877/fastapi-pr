from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload
from slugify import slugify

from db.models import PostCategory, Post, PostImage
from db.services import BaseService


class PostCategoryService(BaseService):

    model_class=PostCategory

    def create(self, db: Session, **kwargs) -> PostCategory:

        kwargs['slug'] = slugify(kwargs['name'])
        return super().create(db, **kwargs)
    

class PostService(BaseService):

    model_class=Post

    def get_multi(
            self,
            db: Session,
            order: str = "id",
            limit: int = 100,
            offset: int = 0,
            options: list = [],
            filters: dict = {}
        ) -> list:
        
        options = [joinedload(Post.category), joinedload(Post.owner), selectinload(Post.images)]
        return super().get_multi(db, order, limit, offset, options, filters)

class PostImageService(BaseService):

    model_class=PostImage


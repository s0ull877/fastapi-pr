from sqlalchemy.orm import Session
from slugify import slugify

from db.models import PostCategory, Post
from db.services import BaseService


class PostCategoryService(BaseService):

    model_class=PostCategory

    def create(self, db: Session, **kwargs) -> PostCategory:

        kwargs['slug'] = slugify(kwargs['name'])
        return super().create(db, **kwargs)
    

class PostService(BaseService):

    model_class=Post


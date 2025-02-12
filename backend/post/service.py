import os
from config import Config

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



class PostImageService(BaseService):

    model_class=PostImage
    media_dir = str(Config.BASE_DIR) + f'/media/posts/'

    def delete_files(self, pattern: str):

        file_list = os.listdir(self.media_dir)
        files = list(filter(lambda file: file.startswith(pattern), file_list))

        for file in files:    

            file_path = self.media_dir + file
            try:
            
                os.remove(file_path)

            except Exception as ex:
            
                print(f"Error deleting {file_path}:", ex)
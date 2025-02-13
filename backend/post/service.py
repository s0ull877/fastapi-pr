import os
from typing import Literal
from config import Config

from sqlalchemy import select, func, insert, delete
from sqlalchemy.orm import Session
from slugify import slugify

from db.models import PostCategory, Post, PostImage, PostComment, post_likes
from db.services import BaseService


class PostCategoryService(BaseService):

    model_class=PostCategory

    def create(self, db: Session, **kwargs) -> PostCategory:

        kwargs['slug'] = slugify(kwargs['name'])
        return super().create(db, **kwargs)
    

class PostService(BaseService):

    model_class=Post

    def get(self, db: Session, options: list =[], filters: dict = []):
        
        comment_count_subquery = (
            select(func.count(PostComment.id))
            .where(PostComment.post_id == Post.id, PostComment.status == True)
            .correlate(Post)
            .as_scalar()
        )
        stmt = select(self.model_class, comment_count_subquery.label("comment_count")).options(*options).filter_by(**filters)
        result = db.execute(stmt).first()
        
        if result:
            return result
        
        return (None, None)
        

    def get_multi(
            self,
            db: Session,
            order: str = "created_at",
            limit: int = 100,
            offset: int = 0,
            options: list = [],
            filters: dict = {}
        ) -> list[dict[Literal['post'], Post, Literal['comment_count'], int]]:
        
        comment_count_subquery = (
            select(Post.id, func.count(PostComment.id).label("comment_count"))
            .outerjoin(PostComment, (Post.id == PostComment.post_id) & (PostComment.status == True))
            .group_by(Post.id)
            .subquery()
        )


        stmt = select(self.model_class, comment_count_subquery.c.comment_count) \
            .join(comment_count_subquery, self.model_class.id == comment_count_subquery.c.id, isouter=True) \
            .options(*options) \
            .order_by(order) \
            .limit(limit) \
            .offset(offset)


        if 'category_slug' in list(filters.keys()):
            v = filters.pop('category_slug')    
            stmt= stmt.join(PostCategory, Post.category_id == PostCategory.id, isouter=True).filter(PostCategory.slug == v)    


        if filters:
            stmt = stmt.filter(*[getattr(self.model_class, k) == v for k,v in filters.items()])
        
    
        rows = db.execute(stmt)
        return [{"post": row[0], "comment_count": row[1] or 0} for row in rows]
    

    def like(self, db: Session, id: int, user_id: int):

        db.execute(
            insert(post_likes).values(post_id=id, user_id=user_id)
        )
        db.commit()

    def delete_like(self, db: Session, id: int, user_id: int):

        db.execute(
            delete(post_likes).where(
                post_likes.c.post_id == id,
                post_likes.c.user_id == user_id
            )
        )
        db.commit()



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


class PostLikeService(BaseService):

    model_class=post_likes
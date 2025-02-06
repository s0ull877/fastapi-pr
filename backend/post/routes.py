import os
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from sqlalchemy.orm import Session

from .schemas import PostCategorySchema, PostSchema
from .service import PostCategoryService, PostService, PostImageService

from db.main import get_db

from config import Config

post_router = APIRouter()
postCategory_service = PostCategoryService()
post_service = PostService()
postImage_service = PostImageService()


@post_router.post("/categories", status_code=201)
async def create_category(category: PostCategorySchema, db: Session = Depends(get_db)):
        
    post_category = postCategory_service.create(db, **category.model_dump())
    return post_category.to_dict()


@post_router.post("/posts", status_code=201)
async def create_post(post: PostSchema, db: Session = Depends(get_db)):
        
    post = post_service.create(db, **post.model_dump())
    dir_path= str(Config.BASE_DIR) + f'/media/posts/{post.id}'
    os.makedirs(dir_path)

    return post.to_dict()


@post_router.post("/posts/images", status_code=200)
async def create_category(post_id: int, files: list[UploadFile], db: Session = Depends(get_db)):
    
    dir_path= str(Config.BASE_DIR) + f'/media/posts/{post_id}'
    if not os.path.exists(dir_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Post with id={post_id} not exist')

    i = 0

    for file in files:

        path = f'{dir_path}/{i}.png'

        postImage_service.create(db, post_id=post_id, image=path)
        
        with open(path, 'wb') as f:
            f.write(file.file.read())

        i += 1
    
    return {'success': True}
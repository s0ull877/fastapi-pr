import os
from typing import Literal
from shortuid import uid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form, status
from fastapi.responses import FileResponse, Response
from user.dependencies import get_current_user

from .utils import post_to_json

from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload, selectinload

from .schemas import PostCategorySchema
from .service import PostCategoryService, PostService, PostImageService, PostLikeService

from db.main import get_db

from config import Config

post_router = APIRouter()
postCategory_service = PostCategoryService()
post_service = PostService()
postImage_service = PostImageService()
postLike_service = PostLikeService()

postOptions = [
        joinedload(post_service.model_class.category), 
        joinedload(post_service.model_class.owner), 
        selectinload(post_service.model_class.images),
        selectinload(post_service.model_class.liked_users)
]

@post_router.get("/media/{filename}")
async def get_media(filename:str):

    path = str(Config.BASE_DIR) + f'/media/posts/{filename}'

    if not os.path.exists(path):
        raise HTTPException(status_code=404)
    
    return FileResponse(path=path)


@post_router.post("/categories", status_code=201)
async def create_category(category: PostCategorySchema, db: Session = Depends(get_db)):
        
    post_category = postCategory_service.create(db, **category.model_dump())
    return post_category.to_dict()


@post_router.get("/categories", status_code=200)
async def get_categories(db: Session = Depends(get_db)):
        
    post_categories = postCategory_service.get_multi(db=db)
    return [ category.to_dict() for category in post_categories]


@post_router.post("/", status_code=201)
async def create_post(
    category: str=Form(), 
    text: str=Form(None), 
    images: list[UploadFile]=Form([]), 
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)):
        

    post = post_service.create(db=db,
                               text=text,
                               owner_id=user.id,
                               category_id=category
                               )
    
    for image in images:

        filename = '{}_{}.png'.format(post.id, uid(6))
        path = str(Config.BASE_DIR) + f'/media/posts/{filename}'

        with open(path, 'wb') as file:
            file.write(image.file.read())

        postImage_service.create(db=db, post_id=post.id, image=Config.HOSTNAME + f'/api/v1/post/media/{filename}')

    return {'id': post.id}


@post_router.get('/')
async def get_posts(
    user_id: int | None=None, 
    catg: str | None=None,
    order: Literal['new'] | Literal['pop']='new', 
    offset: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)):


    if user_id:
        filters={'owner_id': user_id} if user_id else {}
    else:
        filters={'category_slug': catg} if catg else {}
    
    posts = post_service.get_multi(db=db, offset=offset, limit=limit, options=postOptions, filters=filters)

    posts_json = []

    for post_datas in posts:

        posts_json.append(
            post_to_json(post_data=post_datas, user=user)
        )

    if order == 'pop':
        posts_json = sorted(posts_json, key=lambda post: post['likes_count'])

    posts_json.reverse()

    return posts_json


@post_router.get('/{id}')
async def get_post(id:int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):

    post,comment_count = post_service.get(db=db, options=postOptions, filters={'id': id})
    
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return post_to_json(
        post_data={
            'post': post, 
            'comment_count': comment_count
        }, 
        user=user
    )


@post_router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):

    res = post_service.delete(db=db, id=id, owner_id=user.id)

    if res == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    # celery
    pattern = f'{id}_'
    postImage_service.delete_files(pattern)
    
    return


@post_router.post('/{id}/like')
async def like_post(id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):

    post, _ = post_service.get(db=db, filters={'id': id})

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    if user in post.liked_users:
        post_service.delete_like(db=db, id=post.id, user_id=user.id)
        status_code=status.HTTP_204_NO_CONTENT
    else:
        post_service.like(db=db, id=post.id, user_id=user.id)
        status_code=status.HTTP_201_CREATED

    return Response(status_code=status_code)
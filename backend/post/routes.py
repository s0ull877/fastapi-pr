import os
from shortuid import uid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form, status
from fastapi.responses import JSONResponse, FileResponse
from user.dependencies import get_current_user


from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload, selectinload

from .schemas import PostCategorySchema, PostSchema
from .service import PostCategoryService, PostService, PostImageService

from db.main import get_db

from config import Config

post_router = APIRouter()
postCategory_service = PostCategoryService()
post_service = PostService()
postImage_service = PostImageService()

postOptions = [
        joinedload(post_service.model_class.category), 
        joinedload(post_service.model_class.owner), 
        selectinload(post_service.model_class.images)
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


@post_router.get("/categories", status_code=201)
async def get_categories(db: Session = Depends(get_db)):
        
    post_categories = postCategory_service.get_multi(db=db)
    return {'categories' : [ category.to_dict() for category in post_categories]}


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
async def get_posts(user_id:int, db: Session = Depends(get_db)):

    
    posts = post_service.get_multi(db=db, options=postOptions, filters={'owner_id': user_id})

    posts_json = []

    for model_obj in posts:

        post = model_obj.to_dict(exclude=['owner_id', 'category_id'])
        post['category'] = model_obj.category.to_dict(exclude=['id'])
        post['owner'] = model_obj.owner.to_dict(exclude=['id', 'status', 'email', 'is_verified_email'])
        post['images'] = [image.image for image in model_obj.images]
        
        posts_json.append(post)

    posts_json.reverse()

    return {'posts': posts_json}


@post_router.get('/{id}')
async def get_post(id:int, db: Session = Depends(get_db)):

    post = post_service.get(db=db, options=postOptions, filters={'id': id})
    
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    post_json = post.to_dict(exclude=['owner_id', 'category_id'])
    post_json['category'] = post.category.to_dict(exclude=['id'])
    post_json['owner'] = post.owner.to_dict(exclude=['id', 'status', 'email', 'is_verified_email'])
    post_json['images'] = [image.image for image in post.images]
        
    return post_json


@post_router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):

    res = post_service.delete(db=db, id=id, owner_id=user.id)

    if res == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    

    # celery
    pattern = f'{id}_'
    postImage_service.delete_files(pattern)
    
    return
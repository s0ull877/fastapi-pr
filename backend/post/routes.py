from datetime import timedelta, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from sqlalchemy.orm import Session

from .schemas import PostCategorySchema, PostSchema
from .service import PostCategoryService, PostService

from db.main import get_db

post_router = APIRouter()
postCategory_service = PostCategoryService()
post_service = PostService()


@post_router.post("/categories", status_code=201)
async def create_category(category: PostCategorySchema, db: Session = Depends(get_db)):
        
    post_category = postCategory_service.create(db, **category.model_dump())
    return post_category.to_dict()


@post_router.post("/posts", status_code=201)
async def create_category(post: PostSchema, db: Session = Depends(get_db)):
        
    post = post_service.create(db, **post.model_dump())
    return post.to_dict()


@post_router.get("/posts/{id}", status_code=200)
async def create_category(id: int, db: Session = Depends(get_db)):
        
    post = post_service.get(db, id=id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return post.to_dict()
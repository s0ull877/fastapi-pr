from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from user.dependencies import get_current_user

from sqlalchemy.orm import joinedload

from sqlalchemy.orm import Session

from .schemas import CommentSchema, Status
from post.service import PostService
from .service import PostCommentService

from db.main import get_db

comments_router = APIRouter()
comment_service = PostCommentService()
post_service = PostService()

@comments_router.post('/', status_code=status.HTTP_201_CREATED)
async def create_comment(comment: CommentSchema, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):

    post,_ = post_service.get(db=db, 
                            options=[joinedload(post_service.model_class.owner)],
                            filters={'id': comment.post_id})
    
    comment_obj = comment_service.create(
        db=db, 
        owner_id=user.id,
        post_id=post.id,
        text=comment.text,
        status=True if user.id == post.owner.id else False
        )

    return comment_obj.to_dict(exclude=['owner_id'])


@comments_router.get('/')
async def get_comments(post_id:int, db: Session = Depends(get_db)):

    comments = comment_service.get_multi(db=db, options=[joinedload(comment_service.model_class.owner)], filters={'post_id': post_id, 'status': True})

    comments_json = []

    for model_obj in comments:

        comment = model_obj.to_dict(exclude=['owner_id'])
        comment['owner'] = model_obj.owner.to_dict(exclude=['id', 'status', 'email', 'is_verified_email'])
        
        comments_json.append(comment)

    comments_json.reverse()

    return {'comments': comments_json}


@comments_router.get('/new')
async def new_comments(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):

    comments = comment_service.get_new_by_owner(db=db,user=user)

    comments_json = []
    for comment_obj in comments:

        comment = comment_obj.to_dict(exclude=['owner_id', 'post_id'])
        comment['post'] = comment_obj.post.to_dict(exclude=['owner_id', 'category_id'])
        comment['owner'] = comment_obj.owner.to_dict(exclude=['is_verified_email', 'email', 'status'])

        comments_json.append(comment)

    return comments_json

@comments_router.patch('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def change_status(id: int, approve: Status, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):

    comment = comment_service.get(db=db, 
                                  options=[joinedload(comment_service.model_class.owner), joinedload(comment_service.model_class.post)], 
                                  filters={'id': id})

    if user.id != comment.post.owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    if approve.approve:

        comment_service.update(comment, db=db, status=True)
        return JSONResponse(content={'id': comment.id}, status_code=status.HTTP_200_OK)

    comment_service.delete(db=db, id=comment.id)
    return 


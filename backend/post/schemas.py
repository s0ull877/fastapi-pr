from fastapi import UploadFile
from pydantic import BaseModel


class PostCategorySchema(BaseModel):

    name: str


class PostSchema(BaseModel):

    text: str
    owner_id: int
    category_id: int


class PostImageSchema(BaseModel):

    post_id: int
    image: UploadFile
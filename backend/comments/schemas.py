from pydantic import BaseModel


class CommentSchema(BaseModel):

    post_id: int
    text: str

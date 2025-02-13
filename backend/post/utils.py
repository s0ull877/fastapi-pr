from typing import Literal
from db.models import Post


def post_to_json(post_data: dict[Literal['post'], Post, Literal['comment_count'], int], user: dict) -> dict:

    post = post_data['post'].to_dict(exclude=['owner_id', 'category_id'])
    post['category'] = post_data['post'].category.to_dict(exclude=['id'])
    post['owner'] = post_data['post'].owner.to_dict(exclude=['id', 'status', 'email', 'is_verified_email'])
    post['images'] = [image.image for image in post_data['post'].images]
    post['comment_count'] = post_data['comment_count']
    post['likes_count'] = len(post_data['post'].liked_users)
    post['liked'] = user in post_data['post'].liked_users

    return post
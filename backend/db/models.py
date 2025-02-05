from typing import List

from sqlalchemy import Column, String, Boolean, Text, DateTime, UUID, Integer, Column, ForeignKey, Table
from sqlalchemy.orm import declarative_base, declared_attr, relationship

from datetime import datetime, timedelta
from uuid import uuid4

from .main import engine

class Base(object):

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
    
    def to_dict(self) -> dict:
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}
    
    id = Column(Integer, primary_key=True, autoincrement=True)

        
BaseModel = declarative_base(cls=Base)


class EmailVerification(BaseModel):
    __tablename__ = 'email_verification'

    code = Column(UUID(as_uuid=True), unique=True, default=uuid4)
    email = Column(String, unique=True, nullable=False)
    created = Column(DateTime, default=datetime.now())
    expiration = Column(DateTime, default=datetime.now() + timedelta(minutes=15))

    def __repr__(self):
        return f"<EmailVerification(email={self.email}, expiration={self.expiration})>"
    


class User(BaseModel):
    __tablename__ = 'user'

    username = Column(String(20), unique=True, nullable=False)
    image = Column(String, nullable=True)  # Store the file path or URL
    status = Column(Text, nullable=True, default=None)
    email = Column(String, unique=True, nullable=False)
    is_verified_email = Column(Boolean, default=False)
    password = Column(String, nullable=False)

    posts = relationship("Post", back_populates="owner")

    # liked_posts = relationship("Post", secondary="post_likes", back_populates="liked_users")

    def to_dict(self) -> dict:

        data: dict = super().to_dict()
        data.pop('password')
        return data

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"


class PostCategory(BaseModel):
    __tablename__ = 'post_category'

    name = Column(String(30), unique=True, nullable=False)
    slug = Column(String(30), unique=True, nullable=False)

    posts = relationship("Post", back_populates="category")

    def __repr__(self):
        return f"<PostCategory(name={self.name})>"


class Post(BaseModel):
    __tablename__ = 'post'

    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    owner_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("post_category.id", ondelete="CASCADE"), nullable=False)

    # Связи
    owner = relationship("User", back_populates="posts")
    category = relationship("PostCategory", back_populates="posts")

    
    def __repr__(self):
        return f"<Post(owner={self.owner_id}, id={self.id})>"
    

class PostImage(BaseModel):
    __tablename__ = 'post_image'

    post_id = Column(Integer, ForeignKey("post.id", ondelete="CASCADE"), nullable=False)
    image = Column(String, nullable=False)  # SQLAlchemy не хранит файлы, только пути

    category = relationship("Post", back_populates="post_images")

    def __repr__(self):
        return f"<PostImage(post={self.to_post_id})>"
    

# post_likes = Table(
#     'post_likes',
#     BaseModel.metadata,
#     Column('post_id', Integer, ForeignKey('post.id', ondelete="CASCADE"), primary_key=True),
#     Column('user_id', Integer, ForeignKey('user.id', ondelete="CASCADE"), primary_key=True)
# )

# # Добавление связи "многие ко многим"
# User.liked_posts = relationship("Post", secondary=post_likes, back_populates="liked_users")
# Post.liked_users = relationship("User", secondary=post_likes, back_populates="liked_posts")
    



    
BaseModel.metadata.create_all(bind=engine)
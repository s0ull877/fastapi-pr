from sqlalchemy import create_engine, Integer, Column, and_, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base, declared_attr

from fastapi import HTTPException, Depends

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
# The `connect_args` parameter is needed only for SQLite.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Base(object):

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
    
    __table_args__ = {'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True)

    @classmethod
    def create(cls, **kwargs):
        db = next(get_db())
        try:
            instance = cls(**kwargs)
            db.add(instance)
            db.commit()
            db.refresh(instance)
        except IntegrityError as ex:
            import re
            db.rollback()
            match = re.search(r'{}\.([\w]+)'.format(cls.__name__.lower()), ex.args[0])
            field = match.group(1) if match else 'field'
            raise HTTPException(status_code=400, detail=f'This {field} is already busy!')
        else:
            return instance
        
    @classmethod
    def get(cls, **kwargs):
        db = next(get_db())

        conditions = [getattr(cls, key) == value for key, value in kwargs.items()]
        
        stmt = select(cls).where(and_(*conditions))
        
        result = db.execute(stmt).scalars().first()
        return result
    

    def update(self, **kwargs):
        db = next(get_db())

        stmt = (
            update(type(self)).where(type(self).id == self.id).values(**kwargs)
        )

        db.execute(stmt)
        db.commit()
        # db.refresh(self)

        return self

        
    
        
BaseModel = declarative_base(cls=Base)
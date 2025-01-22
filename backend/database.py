from sqlalchemy import Integer, create_engine, Column
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base, Session, declared_attr

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

    def save(self, db: Session = Depends(get_db)):
        try:
            db.add(self)
            db.commit()
            db.refresh(self)
        except IntegrityError as ex:
            import re
            match = re.search(r'{}\.([\w]+)'.format(self.__name__.lower()), ex.args[0])
            field = match.group(1) if match else 'field'
            raise HTTPException(status_code=400, detail=f'This {field} is already busy!')
        else:
            return self
        
BaseModel = declarative_base(cls=Base)
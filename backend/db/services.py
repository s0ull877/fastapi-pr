from sqlalchemy import delete, select, update
from sqlalchemy.exc import IntegrityError

from fastapi import HTTPException


from sqlalchemy.orm import Session


class BaseService:

    model_class = object

    def create(self, db: Session, **kwargs):
        try:
            instance = self.model_class(**kwargs)
            db.add(instance)
            db.commit()
            db.refresh(instance)
        except IntegrityError as ex:
            db.rollback()
            print(ex) #log
            raise HTTPException(status_code=400, detail=f'Invalid input data!')
        else:
            return instance
        
    def get(self, db: Session, options: list = [], filters: dict = {}):

        
        stmt = select(self.model_class).options(*options).filter_by(**filters)
        
        result = db.execute(stmt).scalar_one_or_none()
        return result
    

    def update(self, instance, db: Session, **kwargs):

        stmt = (
            update(self.model_class).values(**kwargs).where(self.model_class.id == instance.id)
        )

        result = db.execute(stmt)
        db.commit()

        return instance
    
    def get_multi(
            self,
            db: Session,
            order: str = "id",
            limit: int = 100,
            offset: int = 0,
            options: list = [],
            filters: dict = {}
        ) -> list:
        
        stmt = select(self.model_class).options(*options).order_by(order).limit(limit).offset(offset).filter_by(**filters)
        row = db.execute(stmt)
        return list(row.scalars().all())
    

    def delete(self, db: Session, **filters: dict):

        stmt = delete(self.model_class).filter_by(**filters)
        result = db.execute(stmt)
        db.commit()
        return result.rowcount
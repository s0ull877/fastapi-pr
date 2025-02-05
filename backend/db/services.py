from sqlalchemy import and_, select, update
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
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail=f'Invalid input data!')
        else:
            return instance
        
    def get(self, db: Session, **filters):

        
        stmt = select(self.model_class).filter_by(**filters)
        
        result = db.execute(stmt).scalar_one_or_none()
        return result
    

    def update(self, instance, db: Session, **kwargs):

        stmt = (
            update(type(instance)).where(type(instance).id == instance.id).values(**kwargs)
        )

        db.execute(stmt)
        db.commit()

        return self
    
    def get_multi(
            self,
            db: Session,
            order: str = "id",
            limit: int = 100,
            offset: int = 0
        ) -> list:
        
        stmt = select(self.model_class).order_by(order).limit(limit).offset(offset)
        row = db.execute(stmt)
        return list(row.scalars().all())
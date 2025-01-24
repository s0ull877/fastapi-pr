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
        except IntegrityError as ex:
            import re
            db.rollback()
            match = re.search(r'{}\.([\w]+)'.format(self.model_class.__name__.lower()), ex.args[0])
            field = match.group(1) if match else 'field'
            raise HTTPException(status_code=400, detail=f'This {field} is already busy!')
        else:
            return instance
        
    def get(self, db: Session, **kwargs):

        conditions = [getattr(self.model_class, key) == value for key, value in kwargs.items()]
        
        stmt = select(self.model_class).where(and_(*conditions))
        
        result = db.execute(stmt).scalars().first()
        return result
    

    def update(self, instance, db: Session, **kwargs):

        stmt = (
            update(type(instance)).where(type(instance).id == instance.id).values(**kwargs)
        )

        db.execute(stmt)
        db.commit()
        # db.refresh(self)

        return self

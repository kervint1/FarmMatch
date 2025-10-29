from sqlmodel import Session, select

from models import Farm
from schemas.farm import FarmCreate, FarmUpdate


class FarmService:
    """Service for Farm operations"""

    @staticmethod
    def get_farm(session: Session, farm_id: int) -> Farm | None:
        """Get a single farm by ID"""
        return session.exec(select(Farm).where(Farm.id == farm_id)).first()

    @staticmethod
    def get_farms(
        session: Session,
        skip: int = 0,
        limit: int = 100,
        prefecture: str | None = None,
        experience_type: str | None = None,
        is_active: bool = True,
    ) -> list[Farm]:
        """Get list of farms with optional filters"""
        query = select(Farm)

        if is_active:
            query = query.where(Farm.is_active == True)

        if prefecture:
            query = query.where(Farm.prefecture == prefecture)

        if experience_type:
            query = query.where(Farm.experience_type == experience_type)

        query = query.offset(skip).limit(limit)
        return session.exec(query).all()

    @staticmethod
    def get_farms_by_host(session: Session, host_id: int) -> list[Farm]:
        """Get all farms by a specific host"""
        query = select(Farm).where(Farm.host_id == host_id)
        return session.exec(query).all()

    @staticmethod
    def create_farm(session: Session, farm_data: FarmCreate) -> Farm:
        """Create a new farm"""
        farm = Farm(**farm_data.model_dump())
        session.add(farm)
        session.commit()
        session.refresh(farm)
        return farm

    @staticmethod
    def update_farm(
        session: Session, farm_id: int, farm_data: FarmUpdate
    ) -> Farm | None:
        """Update a farm"""
        farm = session.exec(select(Farm).where(Farm.id == farm_id)).first()
        if not farm:
            return None

        update_data = farm_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(farm, key, value)

        session.add(farm)
        session.commit()
        session.refresh(farm)
        return farm

    @staticmethod
    def delete_farm(session: Session, farm_id: int) -> bool:
        """Delete a farm (soft delete by setting is_active to False)"""
        farm = session.exec(select(Farm).where(Farm.id == farm_id)).first()
        if not farm:
            return False

        farm.is_active = False
        session.add(farm)
        session.commit()
        return True

    @staticmethod
    def count_farms(session: Session) -> int:
        """Count total farms"""
        return session.exec(select(Farm)).all().__len__()

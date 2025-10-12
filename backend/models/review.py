from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Review(SQLModel, table=True):
    __tablename__ = "reviews"

    id: Optional[int] = Field(default=None, primary_key=True)
    reservation_id: int = Field(foreign_key="reservations.id", unique=True)
    guest_id: int = Field(foreign_key="users.id", index=True)
    farm_id: int = Field(foreign_key="farms.id", index=True)
    rating: int = Field(ge=1, le=5, index=True)  # 1-5
    comment: Optional[str] = Field(default=None)
    experience_date: date
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

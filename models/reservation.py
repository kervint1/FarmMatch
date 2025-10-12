from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Reservation(SQLModel, table=True):
    __tablename__ = "reservations"

    id: Optional[int] = Field(default=None, primary_key=True)
    guest_id: int = Field(foreign_key="users.id", index=True)
    farm_id: int = Field(foreign_key="farms.id", index=True)
    start_date: date = Field(index=True)
    end_date: date
    num_guests: int
    total_amount: int
    status: str = Field(
        default="pending", max_length=20, index=True
    )  # pending, approved, completed, cancelled
    contact_phone: str = Field(max_length=20)
    message: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

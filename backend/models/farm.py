from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import DECIMAL
from sqlmodel import Column, Field, ForeignKey, JSON, SQLModel


class Farm(SQLModel, table=True):
    __tablename__ = "farms"

    id: Optional[int] = Field(default=None, primary_key=True)
    host_id: int = Field(foreign_key="users.id", index=True)
    name: str = Field(max_length=100)
    description: str
    prefecture: str = Field(max_length=10, index=True)
    city: str = Field(max_length=50)
    address: str
    latitude: Optional[Decimal] = Field(
        default=None, sa_column=Column(DECIMAL(10, 8))
    )
    longitude: Optional[Decimal] = Field(
        default=None, sa_column=Column(DECIMAL(11, 8))
    )
    experience_type: str = Field(
        max_length=20, index=True
    )  # agriculture, livestock, fishery
    price_per_day: int
    price_per_night: Optional[int] = Field(default=None)
    max_guests: int
    facilities: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    access_info: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

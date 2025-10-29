from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class FarmBase(BaseModel):
    """Base schema for Farm"""

    name: str = Field(..., min_length=1, max_length=100)
    description: str
    prefecture: str = Field(..., max_length=10)
    city: str = Field(..., max_length=50)
    address: str
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    experience_type: str = Field(..., max_length=20)
    price_per_day: int = Field(..., gt=0)
    price_per_night: Optional[int] = Field(None, gt=0)
    max_guests: int = Field(..., gt=0)
    facilities: Optional[dict] = None
    access_info: Optional[str] = None


class FarmCreate(FarmBase):
    """Schema for creating a new Farm"""

    host_id: int


class FarmUpdate(BaseModel):
    """Schema for updating a Farm"""

    name: Optional[str] = None
    description: Optional[str] = None
    prefecture: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    experience_type: Optional[str] = None
    price_per_day: Optional[int] = None
    price_per_night: Optional[int] = None
    max_guests: Optional[int] = None
    facilities: Optional[dict] = None
    access_info: Optional[str] = None
    is_active: Optional[bool] = None


class FarmResponse(FarmBase):
    """Schema for Farm response"""

    id: int
    host_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FarmListResponse(BaseModel):
    """Schema for Farm list response"""

    id: int
    name: str
    prefecture: str
    city: str
    experience_type: str
    price_per_day: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

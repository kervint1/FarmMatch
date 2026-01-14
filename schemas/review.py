from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class ReviewBase(BaseModel):
    """Base schema for Review"""

    reservation_id: int
    farm_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    experience_date: date


class ReviewCreate(ReviewBase):
    """Schema for creating a new Review"""

    guest_id: int


class ReviewResponse(ReviewBase):
    """Schema for Review response"""

    id: int
    guest_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    """Schema for Review list response"""

    id: int
    farm_id: int
    guest_id: int
    rating: int
    comment: Optional[str]
    experience_date: date
    created_at: datetime

    class Config:
        from_attributes = True

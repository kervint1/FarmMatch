from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class ReservationBase(BaseModel):
    """Base schema for Reservation"""

    farm_id: int
    start_date: date
    end_date: date
    num_guests: int = Field(..., gt=0)
    total_amount: int = Field(..., gt=0)
    contact_phone: str = Field(..., max_length=20)
    message: Optional[str] = None


class ReservationCreate(ReservationBase):
    """Schema for creating a new Reservation"""

    guest_id: int


class ReservationUpdate(BaseModel):
    """Schema for updating a Reservation"""

    status: Optional[str] = None
    message: Optional[str] = None


class ReservationResponse(ReservationBase):
    """Schema for Reservation response"""

    id: int
    guest_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReservationListResponse(BaseModel):
    """Schema for Reservation list response"""

    id: int
    farm_id: int
    guest_id: int
    start_date: date
    end_date: date
    status: str
    total_amount: int
    created_at: datetime

    class Config:
        from_attributes = True


class ApprovalRequest(BaseModel):
    """Schema for approving a reservation"""

    approval_message: Optional[str] = None

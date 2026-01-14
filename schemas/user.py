from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base schema for User"""

    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    user_type: str = Field(default="guest", max_length=20)
    phone_number: Optional[str] = Field(None, max_length=20)
    prefecture: Optional[str] = Field(None, max_length=10)
    city: Optional[str] = Field(None, max_length=50)


class UserCreate(UserBase):
    """Schema for creating a new User"""

    google_id: str


class UserUpdate(BaseModel):
    """Schema for updating a User"""

    name: Optional[str] = None
    phone_number: Optional[str] = None
    prefecture: Optional[str] = None
    city: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    """Schema for User response"""

    id: int
    google_id: str
    avatar_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Schema for User list response"""

    id: int
    name: str
    email: str
    user_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReceivedReviewInfo(BaseModel):
    """農家が受け取ったレビュー情報"""

    id: int
    guest_id: int
    guest_name: str
    rating: int
    comment: Optional[str]
    experience_date: date
    farm_id: int
    farm_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class HostReceivedReviewsResponse(BaseModel):
    """農家が受け取ったレビュー一覧のレスポンス"""

    host_id: int
    host_name: str
    total_reviews: int
    average_rating: float
    reviews: list[ReceivedReviewInfo]

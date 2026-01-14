from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PostBase(BaseModel):
    """Base schema for Post"""

    title: str = Field(..., min_length=1, max_length=100)
    content: str
    farm_id: Optional[int] = None


class PostCreate(PostBase):
    """Schema for creating a new Post"""

    user_id: int


class PostUpdate(BaseModel):
    """Schema for updating a Post"""

    title: Optional[str] = None
    content: Optional[str] = None


class PostResponse(PostBase):
    """Schema for Post response"""

    id: int
    user_id: int
    like_count: int
    created_at: datetime
    updated_at: datetime
    user_name: Optional[str] = None
    user_type: Optional[str] = None
    farm_name: Optional[str] = None

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    """Schema for Post list response"""

    id: int
    user_id: int
    title: str
    content: str
    like_count: int
    created_at: datetime
    user_name: Optional[str] = None
    user_type: Optional[str] = None
    farm_id: Optional[int] = None
    farm_name: Optional[str] = None

    class Config:
        from_attributes = True


class CommentBase(BaseModel):
    """Base schema for Comment"""

    content: str


class CommentCreate(CommentBase):
    """Schema for creating a new Comment"""

    user_id: int
    post_id: int


class CommentResponse(CommentBase):
    """Schema for Comment response"""

    id: int
    post_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    user_name: Optional[str] = None
    user_type: Optional[str] = None

    class Config:
        from_attributes = True


class CommentListResponse(BaseModel):
    """Schema for Comment list response"""

    id: int
    post_id: int
    user_id: int
    content: str
    created_at: datetime
    user_name: Optional[str] = None
    user_type: Optional[str] = None

    class Config:
        from_attributes = True

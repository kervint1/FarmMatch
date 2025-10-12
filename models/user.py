from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    google_id: str = Field(max_length=255, unique=True, index=True)
    email: str = Field(max_length=255, unique=True, index=True)
    name: str = Field(max_length=100)
    avatar_url: Optional[str] = Field(default=None)
    user_type: str = Field(
        default="guest", max_length=20, index=True
    )  # guest, host, admin
    phone_number: Optional[str] = Field(default=None, max_length=20)
    prefecture: Optional[str] = Field(default=None, max_length=10)
    city: Optional[str] = Field(default=None, max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

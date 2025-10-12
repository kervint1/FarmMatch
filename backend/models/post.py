from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Post(SQLModel, table=True):
    __tablename__ = "posts"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    farm_id: Optional[int] = Field(default=None, foreign_key="farms.id", index=True)
    title: str = Field(max_length=100)
    content: str
    like_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

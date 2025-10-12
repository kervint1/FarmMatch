from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class PostImage(SQLModel, table=True):
    __tablename__ = "post_images"

    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int = Field(foreign_key="posts.id", index=True)
    image_url: str
    display_order: int = Field(default=0, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

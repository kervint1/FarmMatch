from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class FarmImage(SQLModel, table=True):
    __tablename__ = "farm_images"

    id: Optional[int] = Field(default=None, primary_key=True)
    farm_id: int = Field(foreign_key="farms.id", index=True)
    image_url: str
    is_main: bool = Field(default=False)
    display_order: int = Field(default=0, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

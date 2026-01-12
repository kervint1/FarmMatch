from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class PrefectureStamp(SQLModel, table=True):
    """都道府県スタンプマスタテーブル"""

    __tablename__ = "prefecture_stamps"

    prefecture_code: str = Field(primary_key=True, max_length=2)
    name: str = Field(max_length=10, index=True)
    name_romaji: str = Field(max_length=20, index=True)
    image_url: str = Field(max_length=255)
    region: str = Field(max_length=20, index=True)
    display_order: int = Field(index=True)
    is_active: bool = Field(default=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

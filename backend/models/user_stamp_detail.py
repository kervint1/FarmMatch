from datetime import date, datetime
from typing import Optional
from sqlalchemy import Index
from sqlmodel import Field, SQLModel


class UserStampDetail(SQLModel, table=True):
    """ユーザースタンプ訪問詳細テーブル"""

    __tablename__ = "user_stamp_detail"

    id: Optional[int] = Field(default=None, primary_key=True)
    guest_id: int = Field(foreign_key="users.id", index=True)
    prefecture_code: str = Field(
        foreign_key="prefecture_stamps.prefecture_code", index=True, max_length=2
    )
    farm_id: int = Field(foreign_key="farms.id", index=True)
    review_id: int = Field(foreign_key="reviews.id", unique=True)

    visit_date: date = Field(index=True)
    experience_type: str = Field(max_length=20)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    __table_args__ = (
        Index("idx_guest_prefecture_date", "guest_id", "prefecture_code", "visit_date"),
    )

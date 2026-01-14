from datetime import date, datetime
from typing import Optional
from sqlalchemy import UniqueConstraint
from sqlmodel import Column, Field, JSON, SQLModel


class UserStampCollection(SQLModel, table=True):
    """ユーザースタンプ収集サマリーテーブル"""

    __tablename__ = "user_stamp_collection"

    id: Optional[int] = Field(default=None, primary_key=True)
    guest_id: int = Field(foreign_key="users.id", index=True)
    prefecture_code: str = Field(
        foreign_key="prefecture_stamps.prefecture_code", index=True, max_length=2
    )

    # 統計情報
    visit_count: int = Field(default=1, ge=1)
    first_visit_date: date = Field(index=True)
    last_visit_date: date = Field(index=True)
    unique_farms_count: int = Field(default=1, ge=1)

    # 拡張用フィールド
    total_nights: Optional[int] = Field(default=None)
    total_experience_types: Optional[dict] = Field(
        default=None, sa_column=Column(JSON)
    )

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("guest_id", "prefecture_code", name="uix_guest_prefecture"),
    )

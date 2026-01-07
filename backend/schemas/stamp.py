from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


# Prefecture Stamp Schemas
class PrefectureStampBase(BaseModel):
    prefecture_code: str
    name: str
    name_romaji: str
    image_url: str
    region: str
    display_order: int
    is_active: bool = True


class PrefectureStampResponse(PrefectureStampBase):
    created_at: datetime

    class Config:
        from_attributes = True


# User Stamp Collection Schemas
class StampCollectionSummary(BaseModel):
    """ユーザーのスタンプ収集サマリー"""

    total_prefectures: int  # 訪問都道府県数
    total_visits: int  # 総訪問回数
    total_farms: int  # 訪問ファーム数
    completion_rate: float  # 達成率 (0-100)


class PrefectureStampStatus(BaseModel):
    """都道府県別スタンプ状態"""

    prefecture_code: str
    name: str
    image_url: str
    region: str
    is_visited: bool
    visit_count: int = 0
    first_visit_date: Optional[date] = None
    last_visit_date: Optional[date] = None
    unique_farms_count: int = 0


class StampCollectionResponse(BaseModel):
    """スタンプコレクション全体のレスポンス"""

    summary: StampCollectionSummary
    stamps: list[PrefectureStampStatus]

    class Config:
        from_attributes = True


# Prefecture Detail Schemas
class VisitedFarmInfo(BaseModel):
    """訪問済みファーム情報"""

    farm_id: int
    farm_name: str
    visit_date: date
    experience_type: str
    review_id: int


class PrefectureDetailResponse(BaseModel):
    """特定都道府県の詳細情報"""

    prefecture_code: str
    name: str
    visit_count: int
    first_visit_date: date
    last_visit_date: date
    unique_farms_count: int
    visited_farms: list[VisitedFarmInfo]

    class Config:
        from_attributes = True

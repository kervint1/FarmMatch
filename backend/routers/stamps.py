from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from database import get_session
from schemas.stamp import (
    PrefectureStampResponse,
    StampCollectionResponse,
    PrefectureDetailResponse,
)
from services.stamp import StampService

router = APIRouter(prefix="/api/stamps", tags=["stamps"])


@router.get("/prefectures", response_model=list[PrefectureStampResponse])
async def get_all_prefectures(session: Session = Depends(get_session)):
    """全都道府県マスタを取得"""
    prefectures = StampService.get_all_prefectures(session)
    return prefectures


@router.get("/users/{user_id}/collection", response_model=StampCollectionResponse)
async def get_user_stamp_collection(
    user_id: int, session: Session = Depends(get_session)
):
    """ユーザーのスタンプ収集状況を取得"""
    # TODO: 認証チェック（ログインユーザーのみ自分のコレクションを閲覧可能）
    collection = StampService.get_user_stamp_collection(session, user_id)
    return collection


@router.get(
    "/users/{user_id}/collection/{prefecture_code}",
    response_model=PrefectureDetailResponse,
)
async def get_prefecture_detail(
    user_id: int, prefecture_code: str, session: Session = Depends(get_session)
):
    """特定都道府県の詳細情報を取得"""
    # TODO: 認証チェック
    detail = StampService.get_prefecture_detail(session, user_id, prefecture_code)
    if not detail:
        raise HTTPException(
            status_code=404, detail="Prefecture not visited or not found"
        )
    return detail

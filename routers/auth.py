from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import Session
from typing import Optional

from database import get_session
from models.user import User
from services.auth_service import AuthService
from services.user import UserService
from pydantic import BaseModel


router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    """ログインリクエスト"""

    google_id: str


class LoginResponse(BaseModel):
    """ログインレスポンス"""

    access_token: str
    token_type: str = "bearer"
    user_id: int


async def get_current_user(
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session),
) -> User:
    """
    JWTトークンから現在のユーザーを取得する依存関数

    Args:
        authorization: Authorizationヘッダー（Bearer トークン）
        session: データベースセッション

    Returns:
        User: 現在のユーザー

    Raises:
        HTTPException: 認証失敗時
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not authorization:
        raise credentials_exception

    # "Bearer " プレフィックスを削除
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise credentials_exception
    except ValueError:
        raise credentials_exception

    # トークンを検証
    payload = AuthService.verify_token(token)
    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    # ユーザーを取得
    user = UserService.get_user(session, int(user_id))
    if user is None:
        raise credentials_exception

    return user


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    session: Session = Depends(get_session),
):
    """
    Google IDでユーザーを認証し、JWTトークンを発行

    Args:
        request: ログインリクエスト
        session: データベースセッション

    Returns:
        LoginResponse: アクセストークンとユーザーID

    Raises:
        HTTPException: ユーザーが見つからない場合
    """
    # Google IDでユーザーを検索
    user = UserService.get_user_by_google_id(session, request.google_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # JWTトークンを生成
    access_token = AuthService.create_access_token(
        user_id=user.id, google_id=user.google_id
    )

    return LoginResponse(access_token=access_token, user_id=user.id)


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """
    現在のユーザー情報を取得

    Args:
        current_user: 認証済みユーザー

    Returns:
        User: ユーザー情報
    """
    return current_user

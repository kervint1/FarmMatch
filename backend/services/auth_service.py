import os
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()


class AuthService:
    """JWT認証サービス"""

    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    @classmethod
    def create_access_token(cls, user_id: int, google_id: str) -> str:
        """
        JWTアクセストークンを生成

        Args:
            user_id: データベース内のユーザーID
            google_id: GoogleのユーザーID

        Returns:
            str: JWTトークン
        """
        expire = datetime.utcnow() + timedelta(minutes=cls.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {
            "sub": str(user_id),
            "google_id": google_id,
            "exp": expire,
        }
        encoded_jwt = jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
        return encoded_jwt

    @classmethod
    def verify_token(cls, token: str) -> Optional[dict]:
        """
        JWTトークンを検証してペイロードを返す

        Args:
            token: JWTトークン

        Returns:
            dict: トークンペイロード（検証成功時）
            None: トークンが無効な場合
        """
        try:
            payload = jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
            return payload
        except JWTError:
            return None

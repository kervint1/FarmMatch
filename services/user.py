from typing import Optional
from sqlmodel import Session, select, func

from models import User
from schemas.user import UserCreate, UserUpdate


class UserService:
    """Service for User operations"""

    @staticmethod
    def get_user(session: Session, user_id: int) -> User | None:
        """Get a single user by ID"""
        return session.exec(select(User).where(User.id == user_id)).first()

    @staticmethod
    def get_user_by_email(session: Session, email: str) -> User | None:
        """Get user by email"""
        return session.exec(select(User).where(User.email == email)).first()

    @staticmethod
    def get_user_by_google_id(session: Session, google_id: str) -> User | None:
        """Get user by Google ID"""
        return session.exec(select(User).where(User.google_id == google_id)).first()

    @staticmethod
    def get_users(
        session: Session,
        skip: int = 0,
        limit: int = 100,
        user_type: str | None = None,
    ) -> list[User]:
        """Get list of users with optional filter"""
        query = select(User)

        if user_type:
            query = query.where(User.user_type == user_type)

        query = query.offset(skip).limit(limit)
        return session.exec(query).all()

    @staticmethod
    def create_user(session: Session, user_data: UserCreate) -> User:
        """Create a new user"""
        user = User(**user_data.model_dump())
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    @staticmethod
    def update_user(
        session: Session, user_id: int, user_data: UserUpdate
    ) -> User | None:
        """Update a user"""
        user = session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            return None

        update_data = user_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)

        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    @staticmethod
    def delete_user(session: Session, user_id: int) -> bool:
        """Delete a user"""
        user = session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            return False

        session.delete(user)
        session.commit()
        return True

    @staticmethod
    def get_host_received_reviews(
        session: Session, host_id: int, skip: int = 0, limit: int = 100
    ) -> Optional[dict]:
        """農家が所有するファームに対して受け取ったレビューを取得"""
        from models import Review, Farm

        # ホスト確認
        host = session.exec(select(User).where(User.id == host_id)).first()
        if not host or host.user_type != "host":
            return None

        # ホストが所有するファームのID取得
        farm_ids = list(session.exec(select(Farm.id).where(Farm.host_id == host_id)).all())
        if not farm_ids:
            return {
                "host_id": host_id,
                "host_name": host.name,
                "total_reviews": 0,
                "average_rating": 0.0,
                "reviews": [],
            }

        # レビュー取得（Farm, User と結合）
        query = (
            select(Review, Farm, User)
            .join(Farm, Review.farm_id == Farm.id)
            .join(User, Review.guest_id == User.id)
            .where(Review.farm_id.in_(farm_ids))
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        results = list(session.exec(query).all())

        # 統計計算
        avg_rating = session.exec(
            select(func.avg(Review.rating)).where(Review.farm_id.in_(farm_ids))
        ).first()
        total_count = session.exec(
            select(func.count(Review.id)).where(Review.farm_id.in_(farm_ids))
        ).first()

        reviews = [
            {
                "id": review.id,
                "guest_id": review.guest_id,
                "guest_name": guest.name,
                "rating": review.rating,
                "comment": review.comment,
                "experience_date": review.experience_date,
                "farm_id": review.farm_id,
                "farm_name": farm.name,
                "created_at": review.created_at,
            }
            for review, farm, guest in results
        ]

        return {
            "host_id": host_id,
            "host_name": host.name,
            "total_reviews": total_count or 0,
            "average_rating": round(float(avg_rating or 0), 1),
            "reviews": reviews,
        }

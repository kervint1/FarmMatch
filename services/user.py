from sqlmodel import Session, select

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

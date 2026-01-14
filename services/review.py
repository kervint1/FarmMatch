from sqlmodel import Session, select, func

from models import Review
from schemas.review import ReviewCreate


class ReviewService:
    """Service for Review operations"""

    @staticmethod
    def get_review(session: Session, review_id: int) -> Review | None:
        """Get a single review by ID"""
        return session.exec(select(Review).where(Review.id == review_id)).first()

    @staticmethod
    def get_reviews_by_farm(
        session: Session,
        farm_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Review]:
        """Get all reviews for a specific farm"""
        query = (
            select(Review)
            .where(Review.farm_id == farm_id)
            .offset(skip)
            .limit(limit)
            .order_by(Review.created_at.desc())
        )
        return session.exec(query).all()

    @staticmethod
    def get_reviews_by_guest(
        session: Session,
        guest_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Review]:
        """Get all reviews by a specific guest"""
        query = (
            select(Review)
            .where(Review.guest_id == guest_id)
            .offset(skip)
            .limit(limit)
            .order_by(Review.created_at.desc())
        )
        return session.exec(query).all()

    @staticmethod
    def get_farm_average_rating(session: Session, farm_id: int) -> float | None:
        """Get average rating for a farm"""
        result = session.exec(
            select(func.avg(Review.rating)).where(Review.farm_id == farm_id)
        ).first()
        return float(result) if result else None

    @staticmethod
    def create_review(session: Session, review_data: ReviewCreate) -> Review:
        """Create a new review"""
        review = Review(**review_data.model_dump())
        session.add(review)
        session.commit()
        session.refresh(review)

        # スタンプコレクションを自動同期
        from services.stamp import StampService

        try:
            StampService.sync_stamp_from_review(session, review.id)
        except Exception as e:
            print(f"Warning: Failed to sync stamp collection: {e}")

        return review

    @staticmethod
    def delete_review(session: Session, review_id: int) -> bool:
        """Delete a review"""
        review = session.exec(select(Review).where(Review.id == review_id)).first()
        if not review:
            return False

        session.delete(review)
        session.commit()
        return True

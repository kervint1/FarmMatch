from sqlmodel import Session, select

from models import Comment, Post
from schemas.post import CommentCreate, PostCreate, PostUpdate


class PostService:
    """Service for Post operations"""

    @staticmethod
    def get_post(session: Session, post_id: int) -> Post | None:
        """Get a single post by ID"""
        return session.exec(select(Post).where(Post.id == post_id)).first()

    @staticmethod
    def get_posts(
        session: Session,
        skip: int = 0,
        limit: int = 100,
        user_id: int | None = None,
    ) -> list[Post]:
        """Get list of posts with optional filter"""
        query = select(Post)

        if user_id:
            query = query.where(Post.user_id == user_id)

        query = query.offset(skip).limit(limit).order_by(Post.created_at.desc())
        return session.exec(query).all()

    @staticmethod
    def create_post(session: Session, post_data: PostCreate) -> Post:
        """Create a new post"""
        post = Post(**post_data.model_dump())
        session.add(post)
        session.commit()
        session.refresh(post)
        return post

    @staticmethod
    def update_post(session: Session, post_id: int, post_data: PostUpdate) -> Post | None:
        """Update a post"""
        post = session.exec(select(Post).where(Post.id == post_id)).first()
        if not post:
            return None

        update_data = post_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(post, key, value)

        session.add(post)
        session.commit()
        session.refresh(post)
        return post

    @staticmethod
    def delete_post(session: Session, post_id: int) -> bool:
        """Delete a post and its comments"""
        post = session.exec(select(Post).where(Post.id == post_id)).first()
        if not post:
            return False

        # Delete all comments for this post
        comments = session.exec(select(Comment).where(Comment.post_id == post_id)).all()
        for comment in comments:
            session.delete(comment)

        session.delete(post)
        session.commit()
        return True

    @staticmethod
    def like_post(session: Session, post_id: int) -> Post | None:
        """Increment like count for a post"""
        post = session.exec(select(Post).where(Post.id == post_id)).first()
        if not post:
            return None

        post.like_count += 1
        session.add(post)
        session.commit()
        session.refresh(post)
        return post


class CommentService:
    """Service for Comment operations"""

    @staticmethod
    def get_comment(session: Session, comment_id: int) -> Comment | None:
        """Get a single comment by ID"""
        return session.exec(select(Comment).where(Comment.id == comment_id)).first()

    @staticmethod
    def get_comments_by_post(
        session: Session,
        post_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Comment]:
        """Get all comments for a specific post"""
        query = (
            select(Comment)
            .where(Comment.post_id == post_id)
            .offset(skip)
            .limit(limit)
            .order_by(Comment.created_at.desc())
        )
        return session.exec(query).all()

    @staticmethod
    def create_comment(session: Session, comment_data: CommentCreate) -> Comment:
        """Create a new comment"""
        comment = Comment(**comment_data.model_dump())
        session.add(comment)
        session.commit()
        session.refresh(comment)
        return comment

    @staticmethod
    def delete_comment(session: Session, comment_id: int) -> bool:
        """Delete a comment"""
        comment = session.exec(
            select(Comment).where(Comment.id == comment_id)
        ).first()
        if not comment:
            return False

        session.delete(comment)
        session.commit()
        return True

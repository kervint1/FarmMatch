from sqlmodel import Session, select

from models import Comment, Post, User, Farm
from schemas.post import CommentCreate, PostCreate, PostUpdate


class PostService:
    """Service for Post operations"""

    @staticmethod
    def get_post(session: Session, post_id: int) -> dict | None:
        """Get a single post by ID"""
        result = session.exec(
            select(
                Post,
                User.name.label("user_name"),
                User.user_type.label("user_type"),
                Farm.name.label("farm_name"),
            )
            .join(User, Post.user_id == User.id)
            .outerjoin(Farm, Post.farm_id == Farm.id)
            .where(Post.id == post_id)
        ).first()

        if not result:
            return None

        post, user_name, user_type, farm_name = result
        return {
            "id": post.id,
            "user_id": post.user_id,
            "title": post.title,
            "content": post.content,
            "like_count": post.like_count,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "user_name": user_name,
            "user_type": user_type,
            "farm_id": post.farm_id,
            "farm_name": farm_name,
        }

    @staticmethod
    def get_posts(
        session: Session,
        skip: int = 0,
        limit: int = 100,
        user_id: int | None = None,
    ) -> list[dict]:
        """Get list of posts with optional filter"""
        query = (
            select(
                Post,
                User.name.label("user_name"),
                User.user_type.label("user_type"),
                Farm.name.label("farm_name"),
            )
            .join(User, Post.user_id == User.id)
            .outerjoin(Farm, Post.farm_id == Farm.id)
        )

        if user_id:
            query = query.where(Post.user_id == user_id)

        query = query.offset(skip).limit(limit).order_by(Post.created_at.desc())
        results = session.exec(query).all()

        posts = []
        for post, user_name, user_type, farm_name in results:
            post_dict = {
                "id": post.id,
                "user_id": post.user_id,
                "title": post.title,
                "content": post.content,
                "like_count": post.like_count,
                "created_at": post.created_at,
                "user_name": user_name,
                "user_type": user_type,
                "farm_id": post.farm_id,
                "farm_name": farm_name,
            }
            posts.append(post_dict)
        return posts

    @staticmethod
    def create_post(session: Session, post_data: PostCreate) -> dict:
        """Create a new post"""
        post = Post(**post_data.model_dump())
        session.add(post)
        session.commit()
        session.refresh(post)

        # Get post with user_name and farm_name
        return PostService.get_post(session, post.id)

    @staticmethod
    def update_post(session: Session, post_id: int, post_data: PostUpdate) -> dict | None:
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

        # Get post with user_name and farm_name
        return PostService.get_post(session, post.id)

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
    def like_post(session: Session, post_id: int) -> dict | None:
        """Increment like count for a post"""
        post = session.exec(select(Post).where(Post.id == post_id)).first()
        if not post:
            return None

        post.like_count += 1
        session.add(post)
        session.commit()
        session.refresh(post)

        # Get post with user_name and farm_name
        return PostService.get_post(session, post.id)


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
    ) -> list[dict]:
        """Get all comments for a specific post"""
        query = (
            select(
                Comment, User.name.label("user_name"), User.user_type.label("user_type")
            )
            .join(User, Comment.user_id == User.id)
            .where(Comment.post_id == post_id)
            .offset(skip)
            .limit(limit)
            .order_by(Comment.created_at.desc())
        )
        results = session.exec(query).all()

        comments = []
        for comment, user_name, user_type in results:
            comment_dict = {
                "id": comment.id,
                "post_id": comment.post_id,
                "user_id": comment.user_id,
                "content": comment.content,
                "created_at": comment.created_at,
                "user_name": user_name,
                "user_type": user_type,
            }
            comments.append(comment_dict)
        return comments

    @staticmethod
    def create_comment(session: Session, comment_data: CommentCreate) -> dict:
        """Create a new comment"""
        comment = Comment(**comment_data.model_dump())
        session.add(comment)
        session.commit()
        session.refresh(comment)

        # Get user_name and user_type
        user = session.exec(select(User).where(User.id == comment.user_id)).first()
        return {
            "id": comment.id,
            "post_id": comment.post_id,
            "user_id": comment.user_id,
            "content": comment.content,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
            "user_name": user.name if user else None,
            "user_type": user.user_type if user else None,
        }

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

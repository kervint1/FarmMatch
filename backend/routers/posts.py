from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from database import get_session
from schemas.post import (
    CommentCreate,
    CommentListResponse,
    CommentResponse,
    PostCreate,
    PostListResponse,
    PostResponse,
    PostUpdate,
)
from schemas.review import ReviewCreate, ReviewListResponse, ReviewResponse
from services.post import CommentService, PostService
from services.review import ReviewService

router = APIRouter(tags=["posts", "reviews", "comments"])


# ========== Posts ==========
@router.get("/api/posts", response_model=list[PostListResponse])
async def list_posts(
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: int | None = None,
):
    """Get list of posts with optional filter"""
    posts = PostService.get_posts(session, skip=skip, limit=limit, user_id=user_id)
    return posts


@router.get("/api/posts/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific post by ID"""
    post = PostService.get_post(session, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/api/posts", response_model=PostResponse, status_code=201)
async def create_post(
    post_data: PostCreate,
    session: Session = Depends(get_session),
):
    """Create a new post"""
    post = PostService.create_post(session, post_data)
    return post


@router.put("/api/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    session: Session = Depends(get_session),
):
    """Update a post"""
    post = PostService.update_post(session, post_id, post_data)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.delete("/api/posts/{post_id}", status_code=204)
async def delete_post(
    post_id: int,
    session: Session = Depends(get_session),
):
    """Delete a post and its comments"""
    success = PostService.delete_post(session, post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")


@router.post("/api/posts/{post_id}/like", response_model=PostResponse)
async def like_post(
    post_id: int,
    session: Session = Depends(get_session),
):
    """Like a post"""
    post = PostService.like_post(session, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# ========== Comments ==========
@router.get("/api/posts/{post_id}/comments", response_model=list[CommentListResponse])
async def list_comments(
    post_id: int,
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """Get all comments for a specific post"""
    comments = CommentService.get_comments_by_post(
        session, post_id, skip=skip, limit=limit
    )
    return comments


@router.post(
    "/api/posts/{post_id}/comments", response_model=CommentResponse, status_code=201
)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    session: Session = Depends(get_session),
):
    """Create a new comment on a post"""
    post = PostService.get_post(session, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = CommentService.create_comment(session, comment_data)
    return comment


@router.delete("/api/comments/{comment_id}", status_code=204)
async def delete_comment(
    comment_id: int,
    session: Session = Depends(get_session),
):
    """Delete a comment"""
    success = CommentService.delete_comment(session, comment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")


# ========== Reviews ==========
@router.get("/api/farms/{farm_id}/reviews", response_model=list[ReviewListResponse])
async def list_farm_reviews(
    farm_id: int,
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """Get all reviews for a specific farm"""
    reviews = ReviewService.get_reviews_by_farm(session, farm_id, skip=skip, limit=limit)
    return reviews


@router.get("/api/reviews/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific review by ID"""
    review = ReviewService.get_review(session, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.post("/api/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(
    review_data: ReviewCreate,
    session: Session = Depends(get_session),
):
    """Create a new review"""
    try:
        review = ReviewService.create_review(session, review_data)
        return review
    except Exception as e:
        # Check for unique constraint violation
        if "unique" in str(e).lower() or "duplicate" in str(e).lower():
            raise HTTPException(
                status_code=422,
                detail="この予約は既にレビュー済みです"
            )
        raise HTTPException(
            status_code=500,
            detail=f"レビューの作成に失敗しました: {str(e)}"
        )


@router.delete("/api/reviews/{review_id}", status_code=204)
async def delete_review(
    review_id: int,
    session: Session = Depends(get_session),
):
    """Delete a review"""
    success = ReviewService.delete_review(session, review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found")


@router.get("/api/farms/{farm_id}/rating")
async def get_farm_rating(
    farm_id: int,
    session: Session = Depends(get_session),
):
    """Get average rating for a farm"""
    avg_rating = ReviewService.get_farm_average_rating(session, farm_id)
    return {
        "farm_id": farm_id,
        "average_rating": avg_rating,
    }

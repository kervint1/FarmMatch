import os
import uuid
from datetime import datetime
from pathlib import Path

from database import get_session
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from schemas.user import (
    HostReceivedReviewsResponse,
    UserCreate,
    UserListResponse,
    UserResponse,
    UserUpdate,
)
from services.user import UserService
from sqlmodel import Session

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=list[UserListResponse])
async def list_users(
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_type: str | None = None,
):
    """Get list of users with optional filter"""
    users = UserService.get_users(session, skip=skip, limit=limit, user_type=user_type)
    return users


@router.get("/email/{email}", response_model=UserResponse)
async def get_user_by_email(
    email: str,
    session: Session = Depends(get_session),
):
    """Get user by email"""
    user = UserService.get_user_by_email(session, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific user by ID"""
    user = UserService.get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("", response_model=UserResponse, status_code=201)
async def create_user(
    user_data: UserCreate,
    session: Session = Depends(get_session),
):
    """Create a new user"""
    existing = UserService.get_user_by_google_id(session, user_data.google_id)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = UserService.create_user(session, user_data)
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    session: Session = Depends(get_session),
):
    """Update a user"""
    user = UserService.update_user(session, user_id, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    session: Session = Depends(get_session),
):
    """Delete a user"""
    success = UserService.delete_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")


@router.post("/{user_id}/avatar", response_model=UserResponse)
async def upload_user_avatar(
    user_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    """Upload user avatar image"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        )

    # Validate file size (max 5MB)
    file_size = 0
    content = await file.read()
    file_size = len(content)

    if file_size > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(
            status_code=400, detail="File too large. Maximum size is 5MB."
        )

    # Check if user exists
    user = UserService.get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create uploads directory if it doesn't exist
    uploads_dir = Path(__file__).parent.parent / "uploads" / "avatars"
    uploads_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    file_extension = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = uploads_dir / unique_filename

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Update user avatar_url
    avatar_url = f"/uploads/avatars/{unique_filename}"
    updated_user = UserService.update_user(
        session, user_id, UserUpdate(avatar_url=avatar_url)
    )

    if not updated_user:
        # Clean up uploaded file if update failed
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail="Failed to update user avatar")

    return updated_user


@router.get("/{user_id}/reviews/received", response_model=HostReceivedReviewsResponse)
async def get_host_received_reviews(
    user_id: int,
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """Get reviews received by a host for their farms"""
    result = UserService.get_host_received_reviews(session, user_id, skip=skip, limit=limit)
    if not result:
        raise HTTPException(
            status_code=404, detail="Host not found or user is not a host"
        )
    return result

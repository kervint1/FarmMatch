from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from database import get_session
from schemas.user import UserCreate, UserListResponse, UserResponse, UserUpdate
from services.user import UserService

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

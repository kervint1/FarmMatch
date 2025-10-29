from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from database import get_session
from models import Farm, FarmImage
from schemas.farm import FarmCreate, FarmListResponse, FarmResponse, FarmUpdate
from services.farm import FarmService

router = APIRouter(prefix="/api/farms", tags=["farms"])


def get_farm_main_image_url(session: Session, farm_id: int) -> str | None:
    """Get the main image URL for a farm"""
    farm_image = session.exec(
        select(FarmImage)
        .where(FarmImage.farm_id == farm_id)
        .where(FarmImage.is_main == True)
    ).first()

    if farm_image:
        return farm_image.image_url

    # If no main image, get the first image
    farm_image = session.exec(
        select(FarmImage)
        .where(FarmImage.farm_id == farm_id)
        .order_by(FarmImage.display_order)
    ).first()

    return farm_image.image_url if farm_image else None


@router.get("", response_model=list[FarmListResponse])
async def list_farms(
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    prefecture: str | None = None,
    experience_type: str | None = None,
):
    """
    Get list of active farms with optional filters

    - **prefecture**: Filter by prefecture
    - **experience_type**: Filter by experience type (agriculture, livestock, fishery)
    - **skip**: Number of records to skip (pagination)
    - **limit**: Number of records to return (max 100)
    """
    farms = FarmService.get_farms(
        session=session,
        skip=skip,
        limit=limit,
        prefecture=prefecture,
        experience_type=experience_type,
    )

    # Add main_image_url to each farm
    farm_list = []
    for farm in farms:
        farm_dict = farm.model_dump()
        farm_dict["main_image_url"] = get_farm_main_image_url(session, farm.id)
        farm_list.append(FarmListResponse(**farm_dict))

    return farm_list


@router.get("/{farm_id}", response_model=FarmResponse)
async def get_farm(
    farm_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific farm by ID"""
    farm = FarmService.get_farm(session, farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    # Add main_image_url to response
    farm_dict = farm.model_dump()
    farm_dict["main_image_url"] = get_farm_main_image_url(session, farm.id)
    return FarmResponse(**farm_dict)


@router.get("/host/{host_id}", response_model=list[FarmListResponse])
async def list_farms_by_host(
    host_id: int,
    session: Session = Depends(get_session),
):
    """Get all farms owned by a specific host"""
    farms = FarmService.get_farms_by_host(session, host_id)

    # Add main_image_url to each farm
    farm_list = []
    for farm in farms:
        farm_dict = farm.model_dump()
        farm_dict["main_image_url"] = get_farm_main_image_url(session, farm.id)
        farm_list.append(FarmListResponse(**farm_dict))

    return farm_list


@router.post("", response_model=FarmResponse, status_code=201)
async def create_farm(
    farm_data: FarmCreate,
    session: Session = Depends(get_session),
):
    """
    Create a new farm

    - **name**: Farm name
    - **description**: Farm description
    - **prefecture**: Prefecture
    - **city**: City
    - **address**: Detailed address
    - **experience_type**: Type of experience (agriculture, livestock, fishery)
    - **price_per_day**: Price per day (yen)
    - **max_guests**: Maximum number of guests
    """
    farm = FarmService.create_farm(session, farm_data)
    return farm


@router.put("/{farm_id}", response_model=FarmResponse)
async def update_farm(
    farm_id: int,
    farm_data: FarmUpdate,
    session: Session = Depends(get_session),
):
    """Update a farm"""
    farm = FarmService.update_farm(session, farm_id, farm_data)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm


@router.delete("/{farm_id}", status_code=204)
async def delete_farm(
    farm_id: int,
    session: Session = Depends(get_session),
):
    """Delete a farm (soft delete)"""
    success = FarmService.delete_farm(session, farm_id)
    if not success:
        raise HTTPException(status_code=404, detail="Farm not found")

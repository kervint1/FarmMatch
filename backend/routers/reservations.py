from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from database import get_session
from schemas.reservation import (
    ReservationCreate,
    ReservationListResponse,
    ReservationResponse,
    ReservationUpdate,
)
from services.reservation import ReservationService

router = APIRouter(prefix="/api/reservations", tags=["reservations"])


@router.get("", response_model=list[ReservationListResponse])
async def list_reservations(
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    guest_id: int | None = None,
    farm_id: int | None = None,
    status: str | None = None,
):
    """Get list of reservations with optional filters"""
    reservations = ReservationService.get_reservations(
        session, skip=skip, limit=limit, guest_id=guest_id, farm_id=farm_id, status=status
    )
    return reservations


@router.get("/{reservation_id}", response_model=ReservationResponse)
async def get_reservation(
    reservation_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific reservation by ID"""
    reservation = ReservationService.get_reservation(session, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


@router.post("", response_model=ReservationResponse, status_code=201)
async def create_reservation(
    reservation_data: ReservationCreate,
    session: Session = Depends(get_session),
):
    """Create a new reservation"""
    reservation = ReservationService.create_reservation(session, reservation_data)
    return reservation


@router.put("/{reservation_id}", response_model=ReservationResponse)
async def update_reservation(
    reservation_id: int,
    reservation_data: ReservationUpdate,
    session: Session = Depends(get_session),
):
    """Update a reservation status"""
    reservation = ReservationService.update_reservation(
        session, reservation_id, reservation_data
    )
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


@router.post("/{reservation_id}/cancel", response_model=ReservationResponse)
async def cancel_reservation(
    reservation_id: int,
    session: Session = Depends(get_session),
):
    """Cancel a reservation (change status to cancelled)"""
    reservation = ReservationService.get_reservation(session, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    # ステータスを cancelled に更新
    reservation_update = ReservationUpdate(status="cancelled")
    updated_reservation = ReservationService.update_reservation(
        session, reservation_id, reservation_update
    )
    return updated_reservation


@router.delete("/{reservation_id}", status_code=204)
async def delete_reservation(
    reservation_id: int,
    session: Session = Depends(get_session),
):
    """Delete a reservation"""
    success = ReservationService.delete_reservation(session, reservation_id)
    if not success:
        raise HTTPException(status_code=404, detail="Reservation not found")

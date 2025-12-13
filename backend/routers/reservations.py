from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from database import get_session
from models.farm import Farm
from models.user import User
from routers.auth import get_current_user
from schemas.reservation import (
    ApprovalRequest,
    ReservationCreate,
    ReservationListResponse,
    ReservationResponse,
    ReservationUpdate,
)
from services.email_service import EmailService
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


@router.get("/host/{host_id}", response_model=list[ReservationListResponse])
async def get_host_reservations(
    host_id: int,
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: str | None = None,
):
    """
    Get all reservations for farms owned by a specific host

    Args:
        host_id: ID of the host user
        session: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional status filter (pending, approved, completed, cancelled)

    Returns:
        List of reservations for the host's farms
    """
    # Get all farm IDs owned by the host
    farms = session.exec(select(Farm).where(Farm.host_id == host_id)).all()
    farm_ids = [farm.id for farm in farms]

    if not farm_ids:
        return []

    # Get reservations for these farms
    from models.reservation import Reservation

    query = select(Reservation).where(Reservation.farm_id.in_(farm_ids))

    if status:
        query = query.where(Reservation.status == status)

    query = query.offset(skip).limit(limit).order_by(Reservation.created_at.desc())

    reservations = session.exec(query).all()
    return reservations


@router.post("/{reservation_id}/approve", response_model=ReservationResponse)
async def approve_reservation(
    reservation_id: int,
    approval_data: ApprovalRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Approve a reservation and send email notification to the guest

    Args:
        reservation_id: ID of the reservation to approve
        approval_data: Optional approval message from host
        session: Database session
        current_user: Currently authenticated user (must be the farm host)

    Returns:
        Updated reservation

    Raises:
        HTTPException: If reservation not found, already approved, or user not authorized
    """
    from models.reservation import Reservation

    # Get the reservation
    reservation = ReservationService.get_reservation(session, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    # Check if already approved
    if reservation.status != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Reservation is already {reservation.status}"
        )

    # Get the farm to check authorization
    farm = session.exec(select(Farm).where(Farm.id == reservation.farm_id)).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    # Verify that current user is the farm host
    if farm.host_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the farm host can approve reservations"
        )

    # Update reservation status to approved
    reservation_update = ReservationUpdate(status="approved")
    updated_reservation = ReservationService.update_reservation(
        session, reservation_id, reservation_update
    )

    # Get guest information for email
    guest = session.exec(select(User).where(User.id == reservation.guest_id)).first()
    if not guest or not guest.email:
        # If no guest email, still approve but don't send email
        return updated_reservation

    # Prepare email data
    email_data = {
        "farm_name": farm.name,
        "start_date": str(reservation.start_date),
        "end_date": str(reservation.end_date),
        "num_guests": reservation.num_guests,
        "total_price": reservation.total_amount,
        "approval_message": approval_data.approval_message or "",
    }

    # Send email asynchronously (don't fail approval if email fails)
    try:
        await EmailService.send_reservation_approved_email(guest.email, email_data)
    except Exception as e:
        # Log the error but don't fail the approval
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send approval email: {str(e)}")

    return updated_reservation

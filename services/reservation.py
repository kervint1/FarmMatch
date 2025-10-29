from sqlmodel import Session, select

from models import Reservation
from schemas.reservation import ReservationCreate, ReservationUpdate


class ReservationService:
    """Service for Reservation operations"""

    @staticmethod
    def get_reservation(session: Session, reservation_id: int) -> Reservation | None:
        """Get a single reservation by ID"""
        return session.exec(
            select(Reservation).where(Reservation.id == reservation_id)
        ).first()

    @staticmethod
    def get_reservations(
        session: Session,
        skip: int = 0,
        limit: int = 100,
        guest_id: int | None = None,
        farm_id: int | None = None,
        status: str | None = None,
    ) -> list[Reservation]:
        """Get list of reservations with optional filters"""
        query = select(Reservation)

        if guest_id:
            query = query.where(Reservation.guest_id == guest_id)

        if farm_id:
            query = query.where(Reservation.farm_id == farm_id)

        if status:
            query = query.where(Reservation.status == status)

        query = query.offset(skip).limit(limit).order_by(Reservation.created_at.desc())
        return session.exec(query).all()

    @staticmethod
    def create_reservation(
        session: Session, reservation_data: ReservationCreate
    ) -> Reservation:
        """Create a new reservation"""
        reservation = Reservation(**reservation_data.model_dump())
        session.add(reservation)
        session.commit()
        session.refresh(reservation)
        return reservation

    @staticmethod
    def update_reservation(
        session: Session, reservation_id: int, reservation_data: ReservationUpdate
    ) -> Reservation | None:
        """Update a reservation"""
        reservation = session.exec(
            select(Reservation).where(Reservation.id == reservation_id)
        ).first()
        if not reservation:
            return None

        update_data = reservation_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(reservation, key, value)

        session.add(reservation)
        session.commit()
        session.refresh(reservation)
        return reservation

    @staticmethod
    def delete_reservation(session: Session, reservation_id: int) -> bool:
        """Delete a reservation"""
        reservation = session.exec(
            select(Reservation).where(Reservation.id == reservation_id)
        ).first()
        if not reservation:
            return False

        session.delete(reservation)
        session.commit()
        return True

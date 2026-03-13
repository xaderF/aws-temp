from datetime import datetime, timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket, TicketType, User
from app.routers.auth import get_current_user
from app.schemas import PurchaseTicketIn, TicketOut

router = APIRouter(tags=["tickets"])

EXPIRATION_MAP = {
    TicketType.SHUTTLE_SINGLE.value: timedelta(hours=2),
    TicketType.SHUTTLE_DAY.value: timedelta(hours=24),
    TicketType.GUEST.value: timedelta(days=7),
}
VALID_TYPES = ("SHUTTLE_SINGLE", "SHUTTLE_DAY", "GUEST")


@router.get("/tickets", response_model=list[TicketOut])
def list_my_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Ticket]:
    tickets = db.scalars(select(Ticket).where(Ticket.user_id == current_user.id).order_by(Ticket.purchased_at.desc()))
    return list(tickets)


def _do_purchase(current_user: User, db: Session, type_param: str) -> Ticket:
    if type_param not in VALID_TYPES:
        raise HTTPException(status_code=422, detail="type must be SHUTTLE_SINGLE, SHUTTLE_DAY, or GUEST")
    ticket_type = TicketType(type_param)
    expires_at = datetime.utcnow() + EXPIRATION_MAP[ticket_type.value]
    ticket = Ticket(
        user_id=current_user.id,
        type=ticket_type,
        qr_code=f"UTR-{uuid4().hex}",
        expires_at=expires_at,
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("/tickets/purchase", response_model=TicketOut, status_code=status.HTTP_201_CREATED)
def purchase_ticket_get(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    type_param: str = Query(..., alias="type", description="SHUTTLE_SINGLE, SHUTTLE_DAY, or GUEST"),
) -> Ticket:
    return _do_purchase(current_user, db, type_param)


@router.post("/tickets/purchase", response_model=TicketOut, status_code=status.HTTP_201_CREATED)
def purchase_ticket_post(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    type_param: str = Query(..., alias="type", description="SHUTTLE_SINGLE, SHUTTLE_DAY, or GUEST"),
) -> Ticket:
    return _do_purchase(current_user, db, type_param)


@router.delete("/tickets/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    ticket = db.scalar(select(Ticket).where(Ticket.id == ticket_id, Ticket.user_id == current_user.id))
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db.delete(ticket)
    db.commit()

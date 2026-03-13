from datetime import datetime, timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket, TicketType, User
from app.schemas import PurchaseTicketIn, TicketOut

router = APIRouter(tags=["tickets"])


@router.post("/tickets/purchase", response_model=TicketOut, status_code=status.HTTP_201_CREATED)
def purchase_ticket(payload: PurchaseTicketIn, db: Session = Depends(get_db)) -> Ticket:
    user = db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    expiration_map = {
        TicketType.SHUTTLE_SINGLE.value: timedelta(hours=2),
        TicketType.SHUTTLE_DAY.value: timedelta(hours=24),
        TicketType.GUEST.value: timedelta(days=7),
    }

    expires_at = datetime.utcnow() + expiration_map[payload.type.value]
    ticket = Ticket(
        user_id=payload.user_id,
        type=TicketType(payload.type.value),
        qr_code=f"UTR-{uuid4().hex}",
        expires_at=expires_at,
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

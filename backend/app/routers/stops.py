from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Stop, Trip
from app.schemas import ArrivalOut

router = APIRouter(tags=["stops"])


@router.get("/stops/{stop_id}/arrivals", response_model=list[ArrivalOut])
def get_stop_arrivals(
    stop_id: str,
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> list[ArrivalOut]:
    stop = db.get(Stop, stop_id)
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    now = datetime.utcnow()
    stmt = (
        select(Trip)
        .where(Trip.start_stop_id == stop_id, Trip.started_at >= now)
        .order_by(Trip.started_at.asc())
        .limit(limit)
    )
    trips = list(db.scalars(stmt).all())

    return [
        ArrivalOut(
            trip_id=trip.id,
            route_id=trip.route_id,
            planned_arrival=trip.started_at,
            status=trip.status.value,
        )
        for trip in trips
    ]

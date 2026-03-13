from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import Route, RouteStop
from app.schemas import RouteOut, RouteStopOut

router = APIRouter(tags=["routes"])


@router.get("/routes", response_model=list[RouteOut])
def list_routes(db: Session = Depends(get_db)) -> list[Route]:
    stmt = select(Route).where(Route.is_active.is_(True)).order_by(Route.name.asc())
    return list(db.scalars(stmt).all())


@router.get("/routes/{route_id}/stops", response_model=list[RouteStopOut])
def list_route_stops(route_id: str, db: Session = Depends(get_db)) -> list[RouteStop]:
    route = db.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    stmt = (
        select(RouteStop)
        .where(RouteStop.route_id == route_id)
        .options(selectinload(RouteStop.stop))
        .order_by(RouteStop.stop_order.asc())
    )
    return list(db.scalars(stmt).all())

from datetime import datetime, timedelta

from sqlalchemy import select

from app.database import SessionLocal
from app.models import Route, RouteStop, Stop, Trip, TripStatus, User


SAMPLE_ROUTE_ID = "stg-shuttle"
SAMPLE_STOPS = [
    ("stg-stop-1", "St. George Station", 43.6683, -79.3997),
    ("stg-stop-2", "Hart House", 43.6633, -79.3947),
    ("stg-stop-3", "Robarts Library", 43.6645, -79.3994),
]


def seed() -> None:
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == "demo@utoronto.ca"))
        if not user:
            user = User(email="demo@utoronto.ca", student_id="1000000001", full_name="Demo Student")
            db.add(user)

        route = db.get(Route, SAMPLE_ROUTE_ID)
        if not route:
            route = Route(id=SAMPLE_ROUTE_ID, name="St. George Shuttle", campus="St. George", color="#0066CC")
            db.add(route)

        for index, (stop_id, stop_name, lat, lng) in enumerate(SAMPLE_STOPS, start=1):
            stop = db.get(Stop, stop_id)
            if not stop:
                stop = Stop(id=stop_id, name=stop_name, lat=lat, lng=lng)
                db.add(stop)

            route_stop = db.get(RouteStop, {"route_id": SAMPLE_ROUTE_ID, "stop_id": stop_id})
            if not route_stop:
                db.add(RouteStop(route_id=SAMPLE_ROUTE_ID, stop_id=stop_id, stop_order=index))

        db.commit()

        now = datetime.utcnow()
        existing_trip = db.scalar(select(Trip).where(Trip.route_id == SAMPLE_ROUTE_ID, Trip.started_at >= now))
        if not existing_trip:
            db.add(
                Trip(
                    user_id=user.id,
                    route_id=SAMPLE_ROUTE_ID,
                    start_stop_id=SAMPLE_STOPS[0][0],
                    end_stop_id=SAMPLE_STOPS[-1][0],
                    started_at=now + timedelta(minutes=5),
                    ended_at=now + timedelta(minutes=25),
                    status=TripStatus.IN_PROGRESS,
                    fare_cents=0,
                )
            )
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
    print("Seed data inserted.")

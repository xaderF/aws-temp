from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.config import get_settings
from app.database import Base, activate_fallback_engine, get_engine
from app.routers import auth, routes, stops, tickets, trips, users

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        Base.metadata.create_all(bind=get_engine())
    except OperationalError as exc:
        primary_is_postgres = settings.sqlalchemy_database_url.startswith("postgresql+")
        if not (settings.db_fallback_enabled and primary_is_postgres):
            raise

        fallback_url = activate_fallback_engine()
        print(
            "[startup] Primary database connection failed; switched to fallback DB.",
            f"reason={exc.__class__.__name__}",
            f"fallback_url={fallback_url}",
        )
        Base.metadata.create_all(bind=get_engine())
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=settings.cors_origin_regex or None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(routes.router, prefix="/api/v1")
app.include_router(stops.router, prefix="/api/v1")
app.include_router(tickets.router, prefix="/api/v1")
app.include_router(trips.router, prefix="/api/v1")

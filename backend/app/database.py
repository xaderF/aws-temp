from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings


settings = get_settings()


class Base(DeclarativeBase):
    pass


def _connect_args_for(database_url: str) -> dict[str, bool]:
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}


def _build_engine(database_url: str):
    return create_engine(
        database_url,
        pool_pre_ping=True,
        connect_args=_connect_args_for(database_url),
    )

engine = _build_engine(settings.sqlalchemy_database_url)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, class_=Session)


def get_engine():
    return engine


def activate_fallback_engine() -> str:
    """Switch the app to fallback DB (defaults to local SQLite)."""
    global engine

    fallback_url = settings.sqlalchemy_fallback_database_url
    engine = _build_engine(fallback_url)
    SessionLocal.configure(bind=engine)
    return fallback_url


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

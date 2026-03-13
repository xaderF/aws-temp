from sqlalchemy import create_engine, inspect
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


def apply_sqlite_compat_migrations() -> list[str]:
    """Patch legacy local SQLite schemas that predate newer model columns."""
    if engine.dialect.name != "sqlite":
        return []

    applied: list[str] = []
    with engine.begin() as conn:
        table_names = set(inspect(conn).get_table_names())
        if "users" not in table_names:
            return applied

        cols = conn.exec_driver_sql("PRAGMA table_info(users)").fetchall()
        existing_cols = {row[1] for row in cols}

        if "utorid" not in existing_cols:
            conn.exec_driver_sql("ALTER TABLE users ADD COLUMN utorid VARCHAR(64)")
            applied.append("users.utorid")
            conn.exec_driver_sql("CREATE UNIQUE INDEX IF NOT EXISTS uq_users_utorid ON users (utorid)")

        if "is_student" not in existing_cols:
            conn.exec_driver_sql("ALTER TABLE users ADD COLUMN is_student BOOLEAN NOT NULL DEFAULT 1")
            applied.append("users.is_student")

    return applied


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

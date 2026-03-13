#!/usr/bin/env python3
"""Add password_hash column to users table for existing databases."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import text

from app.database import engine


def migrate() -> None:
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)"))
            conn.commit()
            print("Added password_hash column.")
        except Exception as e:
            err = str(e).lower()
            if "duplicate column" in err or "already exists" in err:
                print("Column password_hash already exists.")
            else:
                raise


if __name__ == "__main__":
    migrate()

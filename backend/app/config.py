from functools import lru_cache
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from pydantic_settings import BaseSettings, SettingsConfigDict


def _strip_schema_param(url: str) -> str:
    """Remove schema= from URL - psycopg doesn't support it (Prisma-specific)."""
    parsed = urlparse(url)
    if not parsed.query:
        return url
    params = parse_qs(parsed.query, keep_blank_values=True)
    params.pop("schema", None)
    new_query = urlencode(params, doseq=True)
    return urlunparse(parsed._replace(query=new_query))


class Settings(BaseSettings):
    app_name: str = "UTransit API"
    app_env: str = "development"
    app_port: int = 8000
    database_url: str = "sqlite:///./utransit.db"
    db_fallback_enabled: bool = True
    db_fallback_database_url: str = "sqlite:///./utransit.db"
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://localhost:8080"
    cors_origin_regex: str = "https://.*\\.cloudfront\\.net"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24  # 24 hours

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def sqlalchemy_database_url(self) -> str:
        if self.database_url.startswith("postgresql://"):
            url = _strip_schema_param(self.database_url)
            return url.replace("postgresql://", "postgresql+psycopg://", 1)
        return self.database_url

    @property
    def sqlalchemy_fallback_database_url(self) -> str:
        if self.db_fallback_database_url.startswith("postgresql://"):
            url = _strip_schema_param(self.db_fallback_database_url)
            return url.replace("postgresql://", "postgresql+psycopg://", 1)
        return self.db_fallback_database_url

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

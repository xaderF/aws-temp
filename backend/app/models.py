from __future__ import annotations

from datetime import datetime
from enum import Enum
from uuid import uuid4

from sqlalchemy import DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PassType(str, Enum):
    STUDENT = "STUDENT"
    GUEST = "GUEST"
    SEMESTER = "SEMESTER"


class PassStatus(str, Enum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    FROZEN = "FROZEN"


class TicketType(str, Enum):
    SHUTTLE_SINGLE = "SHUTTLE_SINGLE"
    SHUTTLE_DAY = "SHUTTLE_DAY"
    GUEST = "GUEST"


class TicketStatus(str, Enum):
    ACTIVE = "ACTIVE"
    USED = "USED"
    EXPIRED = "EXPIRED"
    REFUNDED = "REFUNDED"


class TripStatus(str, Enum):
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELED = "CANCELED"


class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    student_id: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    passes: Mapped[list[Pass]] = relationship(back_populates="user")
    tickets: Mapped[list[Ticket]] = relationship(back_populates="user")
    trips: Mapped[list[Trip]] = relationship(back_populates="user")
    payments: Mapped[list[Payment]] = relationship(back_populates="user")


class Route(Base):
    __tablename__ = "routes"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    campus: Mapped[str] = mapped_column(String(64), nullable=False)
    color: Mapped[str | None] = mapped_column(String(32), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    route_stops: Mapped[list[RouteStop]] = relationship(back_populates="route")
    trips: Mapped[list[Trip]] = relationship(back_populates="route")


class Stop(Base):
    __tablename__ = "stops"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    route_stops: Mapped[list[RouteStop]] = relationship(back_populates="stop")


class RouteStop(Base):
    __tablename__ = "route_stops"
    __table_args__ = (
        UniqueConstraint("route_id", "stop_order", name="uq_route_stop_order"),
    )

    route_id: Mapped[str] = mapped_column(ForeignKey("routes.id", ondelete="CASCADE"), primary_key=True)
    stop_id: Mapped[str] = mapped_column(ForeignKey("stops.id", ondelete="CASCADE"), primary_key=True)
    stop_order: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    route: Mapped[Route] = relationship(back_populates="route_stops")
    stop: Mapped[Stop] = relationship(back_populates="route_stops")


class Bus(Base):
    __tablename__ = "buses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    route_id: Mapped[str | None] = mapped_column(ForeignKey("routes.id", ondelete="SET NULL"), nullable=True)
    label: Mapped[str | None] = mapped_column(String(64), nullable=True)
    plate_number: Mapped[str | None] = mapped_column(String(64), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class Pass(Base):
    __tablename__ = "passes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type: Mapped[PassType] = mapped_column(SQLEnum(PassType), nullable=False)
    status: Mapped[PassStatus] = mapped_column(SQLEnum(PassStatus), default=PassStatus.ACTIVE, nullable=False)
    activated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="passes")


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type: Mapped[TicketType] = mapped_column(SQLEnum(TicketType), nullable=False)
    status: Mapped[TicketStatus] = mapped_column(SQLEnum(TicketStatus), default=TicketStatus.ACTIVE, nullable=False)
    qr_code: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    purchased_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped[User] = relationship(back_populates="tickets")
    trips: Mapped[list[Trip]] = relationship(back_populates="ticket")


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    route_id: Mapped[str] = mapped_column(ForeignKey("routes.id", ondelete="RESTRICT"), nullable=False, index=True)
    bus_id: Mapped[str | None] = mapped_column(ForeignKey("buses.id", ondelete="SET NULL"), nullable=True)
    start_stop_id: Mapped[str] = mapped_column(ForeignKey("stops.id", ondelete="RESTRICT"), nullable=False)
    end_stop_id: Mapped[str | None] = mapped_column(ForeignKey("stops.id", ondelete="SET NULL"), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[TripStatus] = mapped_column(SQLEnum(TripStatus), default=TripStatus.IN_PROGRESS, nullable=False)
    fare_cents: Mapped[int | None] = mapped_column(Integer, nullable=True)
    pass_id: Mapped[str | None] = mapped_column(ForeignKey("passes.id", ondelete="SET NULL"), nullable=True)
    ticket_id: Mapped[str | None] = mapped_column(ForeignKey("tickets.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="trips")
    route: Mapped[Route] = relationship(back_populates="trips")
    ticket: Mapped[Ticket | None] = relationship(back_populates="trips")


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="CAD", nullable=False)
    provider: Mapped[str] = mapped_column(String(64), nullable=False)
    provider_ref: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[PaymentStatus] = mapped_column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="payments")


class BusLocation(Base):
    __tablename__ = "bus_locations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    bus_id: Mapped[str] = mapped_column(ForeignKey("buses.id", ondelete="CASCADE"), nullable=False, index=True)
    route_id: Mapped[str] = mapped_column(ForeignKey("routes.id", ondelete="CASCADE"), nullable=False, index=True)
    stop_id: Mapped[str | None] = mapped_column(ForeignKey("stops.id", ondelete="SET NULL"), nullable=True)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    speed_kph: Mapped[float | None] = mapped_column(Float, nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr


class TicketType(str, Enum):
    SHUTTLE_SINGLE = "SHUTTLE_SINGLE"
    SHUTTLE_DAY = "SHUTTLE_DAY"
    GUEST = "GUEST"


class TicketStatus(str, Enum):
    ACTIVE = "ACTIVE"
    USED = "USED"
    EXPIRED = "EXPIRED"
    REFUNDED = "REFUNDED"


class UserCreate(BaseModel):
    email: EmailStr
    student_id: str | None = None
    full_name: str | None = None


class UserOut(BaseModel):
    id: str
    email: EmailStr
    student_id: str | None = None
    full_name: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RouteOut(BaseModel):
    id: str
    name: str
    campus: str
    color: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StopOut(BaseModel):
    id: str
    name: str
    lat: float
    lng: float

    model_config = ConfigDict(from_attributes=True)


class RouteStopOut(BaseModel):
    route_id: str
    stop_order: int
    stop: StopOut

    model_config = ConfigDict(from_attributes=True)


class ArrivalOut(BaseModel):
    trip_id: str
    route_id: str
    planned_arrival: datetime
    status: str


class PurchaseTicketIn(BaseModel):
    user_id: str
    type: TicketType


class TicketOut(BaseModel):
    id: str
    user_id: str
    type: TicketType
    status: TicketStatus
    qr_code: str
    purchased_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TripOut(BaseModel):
    id: str
    user_id: str
    route_id: str
    start_stop_id: str
    end_stop_id: str | None = None
    started_at: datetime
    ended_at: datetime | None = None
    status: str
    fare_cents: int | None = None

    model_config = ConfigDict(from_attributes=True)

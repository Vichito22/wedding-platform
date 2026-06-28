from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class GiftCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    image_url: str | None = Field(default=None, max_length=1024)
    price_reference: Decimal | None = Field(default=None, ge=0)
    category: str | None = Field(default=None, max_length=120)
    position_order: int = Field(default=0, ge=0)


class GiftUpdateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    image_url: str | None = Field(default=None, max_length=1024)
    price_reference: Decimal | None = Field(default=None, ge=0)
    category: str | None = Field(default=None, max_length=120)
    position_order: int = Field(default=0, ge=0)


class GiftReserveRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=120)
    last_name: str = Field(min_length=1, max_length=120)


class GiftResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    image_url: str | None
    price_reference: Decimal | None
    category: str | None
    is_reserved: bool
    reserved_by: str | None
    reserved_at: datetime | None
    position_order: int
    created_at: datetime


class GiftListResponse(BaseModel):
    gifts: list[GiftResponse]

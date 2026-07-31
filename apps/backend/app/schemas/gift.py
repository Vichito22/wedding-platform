from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GiftCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    image_url: str | None = Field(default=None, max_length=1024)
    # 1 = alta, 2 = media, 3 = baja
    position_order: int = Field(default=1, ge=1, le=3)


class GiftUpdateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    image_url: str | None = Field(default=None, max_length=1024)
    position_order: int = Field(default=1, ge=1, le=3)


class GiftReserveRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=120)
    last_name: str = Field(min_length=1, max_length=120)


class GiftUnreserveRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=120)
    last_name: str = Field(min_length=1, max_length=120)


class GiftResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    image_url: str | None
    is_reserved: bool
    reserved_by: str | None
    reserved_at: datetime | None
    position_order: int
    created_at: datetime


class GiftListResponse(BaseModel):
    gifts: list[GiftResponse]

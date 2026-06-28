from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.connection import get_db
from app.routes.auth import get_current_admin
from app.schemas.gift import GiftCreateRequest, GiftListResponse, GiftResponse
from app.services.gift_service import (
    GiftNotFoundError,
    create_gift,
    list_gifts,
    release_gift,
)

router = APIRouter(prefix="/admin/gifts", tags=["admin-gifts"])


@router.post("", response_model=GiftResponse, status_code=status.HTTP_201_CREATED)
def create_gift_endpoint(
    payload: GiftCreateRequest,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return create_gift(db, payload)


@router.get("", response_model=GiftListResponse)
def list_admin_gifts(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return {"gifts": list_gifts(db)}


@router.post("/{gift_id}/release", response_model=GiftResponse)
def release_gift_endpoint(
    gift_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    try:
        return release_gift(db, gift_id)
    except GiftNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El regalo no existe",
        )

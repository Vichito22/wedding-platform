from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.connection import get_db
from app.schemas.gift import GiftListResponse, GiftReserveRequest, GiftResponse
from app.services.gift_service import (
    GiftAlreadyReservedError,
    GiftNotFoundError,
    list_gifts,
    reserve_gift,
)

router = APIRouter(prefix="/gifts", tags=["public-gifts"])


@router.get("", response_model=GiftListResponse)
def list_public_gifts(db: Session = Depends(get_db)):
    return {"gifts": list_gifts(db)}


@router.post("/{gift_id}/reserve", response_model=GiftResponse)
def reserve_public_gift(
    gift_id: int,
    payload: GiftReserveRequest,
    db: Session = Depends(get_db),
):
    try:
        return reserve_gift(db, gift_id, payload.first_name, payload.last_name)
    except GiftNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El regalo no existe",
        )
    except GiftAlreadyReservedError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El regalo ya fue reservado",
        )

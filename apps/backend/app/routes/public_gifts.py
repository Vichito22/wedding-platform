from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.connection import get_db
from app.schemas.gift import (
    GiftListResponse,
    GiftReserveRequest,
    GiftResponse,
    GiftUnreserveRequest,
)
from app.services.gift_service import (
    GiftAlreadyReservedError,
    GiftNotFoundError,
    GiftNotReservedError,
    GiftReservationMismatchError,
    list_gifts,
    reserve_gift,
    unreserve_gift,
)
from app.services.image_service import get_image

router = APIRouter(prefix="/gifts", tags=["public-gifts"])


@router.get("", response_model=GiftListResponse)
def list_public_gifts(db: Session = Depends(get_db)):
    return {"gifts": list_gifts(db)}


@router.get("/images/{image_id}")
def get_gift_image(image_id: int, db: Session = Depends(get_db)):
    image = get_image(db, image_id)
    if image is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La imagen no existe",
        )

    # Cada subida crea un id nuevo y su contenido nunca cambia, asi que se
    # puede cachear indefinidamente.
    return Response(
        content=image.data,
        media_type=image.content_type,
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


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


@router.post("/{gift_id}/unreserve", response_model=GiftResponse)
def unreserve_public_gift(
    gift_id: int,
    payload: GiftUnreserveRequest,
    db: Session = Depends(get_db),
):
    try:
        return unreserve_gift(db, gift_id, payload.first_name, payload.last_name)
    except GiftNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El regalo no existe",
        )
    except GiftNotReservedError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El regalo no está reservado",
        )
    except GiftReservationMismatchError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El nombre y apellido no coinciden con la reserva",
        )

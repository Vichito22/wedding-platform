from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.connection import get_db
from app.routes.auth import get_current_admin
from app.schemas.gift import (
    GiftCreateRequest,
    GiftImageUploadResponse,
    GiftListResponse,
    GiftResponse,
    GiftUpdateRequest,
)
from app.services.gift_service import (
    GiftNotFoundError,
    create_gift,
    list_gifts,
    release_gift,
    update_gift,
)
from app.services.image_service import (
    MAX_UPLOAD_BYTES,
    ImageTooLargeError,
    InvalidImageError,
    store_image,
)

router = APIRouter(prefix="/admin/gifts", tags=["admin-gifts"])


@router.post("", response_model=GiftResponse, status_code=status.HTTP_201_CREATED)
def create_gift_endpoint(
    payload: GiftCreateRequest,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return create_gift(db, payload)


@router.post(
    "/images",
    response_model=GiftImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_gift_image_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    raw = await file.read()

    try:
        image = store_image(db, raw)
    except ImageTooLargeError:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"La imagen supera los {MAX_UPLOAD_BYTES // (1024 * 1024)} MB",
        )
    except InvalidImageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo no es una imagen valida",
        )

    return {"id": image.id, "image_url": f"/gifts/images/{image.id}"}


@router.get("", response_model=GiftListResponse)
def list_admin_gifts(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return {"gifts": list_gifts(db)}


@router.put("/{gift_id}", response_model=GiftResponse)
def update_gift_endpoint(
    gift_id: int,
    payload: GiftUpdateRequest,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    try:
        return update_gift(db, gift_id, payload)
    except GiftNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El regalo no existe",
        )


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

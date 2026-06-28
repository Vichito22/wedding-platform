from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.gift import Gift
from app.schemas.gift import GiftCreateRequest


class GiftNotFoundError(Exception):
    pass


class GiftAlreadyReservedError(Exception):
    pass


def create_gift(db: Session, payload: GiftCreateRequest) -> Gift:
    gift = Gift(
        name=payload.name.strip(),
        description=payload.description,
        image_url=payload.image_url,
        price_reference=payload.price_reference,
        category=payload.category,
        position_order=payload.position_order,
    )
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return gift


def list_gifts(db: Session) -> list[Gift]:
    return db.query(Gift).order_by(Gift.position_order.asc(), Gift.name.asc()).all()


def reserve_gift(db: Session, gift_id: int, first_name: str, last_name: str) -> Gift:
    reserved_by = f"{first_name.strip()} {last_name.strip()}"
    # Conditional UPDATE so two guests cannot reserve the same gift concurrently.
    updated = (
        db.query(Gift)
        .filter(Gift.id == gift_id, Gift.is_reserved.is_(False))
        .update(
            {
                Gift.is_reserved: True,
                Gift.reserved_by: reserved_by,
                Gift.reserved_at: datetime.now(timezone.utc),
            },
            synchronize_session=False,
        )
    )

    if updated == 0:
        gift = db.query(Gift).filter(Gift.id == gift_id).first()
        if gift is None:
            raise GiftNotFoundError(gift_id)
        raise GiftAlreadyReservedError(gift_id)

    db.commit()
    gift = db.query(Gift).filter(Gift.id == gift_id).first()
    db.refresh(gift)
    return gift


def release_gift(db: Session, gift_id: int) -> Gift:
    gift = db.query(Gift).filter(Gift.id == gift_id).first()
    if gift is None:
        raise GiftNotFoundError(gift_id)

    gift.is_reserved = False
    gift.reserved_by = None
    gift.reserved_at = None
    db.commit()
    db.refresh(gift)
    return gift

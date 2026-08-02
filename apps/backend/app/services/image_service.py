from io import BytesIO

from PIL import Image
from sqlalchemy.orm import Session

from app.models.gift_image import GiftImage

# Limite del archivo que sube el admin, antes de procesarlo.
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
# Lado maximo tras el redimensionado. Las tarjetas publicas muestran la imagen
# en un cuadrado, asi que mas resolucion no aporta nada y solo pesa.
MAX_DIMENSION = 1200
WEBP_QUALITY = 82
STORED_CONTENT_TYPE = "image/webp"


class InvalidImageError(Exception):
    pass


class ImageTooLargeError(Exception):
    pass


def _optimize(raw: bytes) -> bytes:
    # Se reencodea siempre: eso valida que el archivo sea realmente una imagen
    # (sin confiar en el content-type del navegador) y de paso descarta EXIF.
    try:
        image = Image.open(BytesIO(raw))

        if image.mode in ("RGBA", "LA") or (
            image.mode == "P" and "transparency" in image.info
        ):
            # WebP soporta transparencia y muchos regalos son PNG con fondo
            # transparente, asi que no la aplastamos contra un fondo negro.
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")

        # thumbnail solo achica: una imagen chica se guarda tal cual.
        image.thumbnail((MAX_DIMENSION, MAX_DIMENSION))

        buffer = BytesIO()
        image.save(buffer, format="WEBP", quality=WEBP_QUALITY)
        return buffer.getvalue()
    except Exception as exc:
        raise InvalidImageError(str(exc)) from exc


def store_image(db: Session, raw: bytes) -> GiftImage:
    if not raw:
        raise InvalidImageError("empty file")
    if len(raw) > MAX_UPLOAD_BYTES:
        raise ImageTooLargeError(len(raw))

    optimized = _optimize(raw)

    image = GiftImage(
        content_type=STORED_CONTENT_TYPE,
        data=optimized,
        byte_size=len(optimized),
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


def get_image(db: Session, image_id: int) -> GiftImage | None:
    return db.query(GiftImage).filter(GiftImage.id == image_id).first()

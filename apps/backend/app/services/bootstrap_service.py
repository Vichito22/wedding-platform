import logging

from sqlalchemy.orm import Session

from app.config import settings
from app.models.admin import Admin
from app.services.auth_service import hash_password

logger = logging.getLogger(__name__)


def seed_admin_if_needed(db: Session) -> None:
    email = settings.admin_seed_email
    password = settings.admin_seed_password

    if not email or not password:
        logger.info("Skipping admin seed. Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD to enable it.")
        return

    normalized_email = email.strip().lower()
    existing_admin = db.query(Admin).filter(Admin.email == normalized_email).first()
    if existing_admin:
        return

    admin = Admin(
        email=normalized_email,
        password_hash=hash_password(password),
    )
    db.add(admin)
    db.commit()
    logger.info("Admin seed completed for %s", normalized_email)

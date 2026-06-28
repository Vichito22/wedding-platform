from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.models.admin import Admin

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


class AuthenticationError(Exception):
    pass


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(subject: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": subject, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        subject = payload.get("sub")
        if not subject:
            raise AuthenticationError("Token payload is missing subject")
        return str(subject)
    except JWTError as exc:
        raise AuthenticationError("Invalid or expired token") from exc


def authenticate_admin(db: Session, email: str, password: str) -> Admin:
    admin = db.query(Admin).filter(Admin.email == email.strip().lower()).first()
    if not admin or not verify_password(password, admin.password_hash):
        raise AuthenticationError("Invalid credentials")
    return admin

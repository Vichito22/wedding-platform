from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.config import settings
from app.db.connection import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminLoginRequest, AdminSessionResponse, MessageResponse
from app.services.auth_service import (
    AuthenticationError,
    authenticate_admin,
    create_access_token,
    decode_access_token,
)

router = APIRouter(prefix="/admin/auth", tags=["admin-auth"])


def get_current_admin(request: Request, db: Session = Depends(get_db)) -> Admin:
    token = request.cookies.get(settings.auth_cookie_name)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        admin_email = decode_access_token(token)
    except AuthenticationError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    admin = db.query(Admin).filter(Admin.email == admin_email).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found")
    return admin


@router.post("/login", response_model=MessageResponse)
def login_admin(payload: AdminLoginRequest, response: Response, db: Session = Depends(get_db)):
    try:
        admin = authenticate_admin(db, payload.email, payload.password)
    except AuthenticationError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    token = create_access_token(admin.email)
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        max_age=settings.jwt_expire_minutes * 60,
        path="/",
        domain=settings.auth_cookie_domain,
    )
    return {"message": "Login successful"}


@router.post("/logout", response_model=MessageResponse)
def logout_admin(response: Response):
    response.delete_cookie(
        key=settings.auth_cookie_name,
        path="/",
        domain=settings.auth_cookie_domain,
    )
    return {"message": "Logout successful"}


@router.get("/session", response_model=AdminSessionResponse)
def get_admin_session(current_admin: Admin = Depends(get_current_admin)):
    return {"authenticated": True, "email": current_admin.email}

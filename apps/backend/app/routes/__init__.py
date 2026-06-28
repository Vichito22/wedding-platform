from app.routes.admin_gifts import router as admin_gifts_router
from app.routes.auth import router as auth_router
from app.routes.public_gifts import router as public_gifts_router

__all__ = ["auth_router", "admin_gifts_router", "public_gifts_router"]

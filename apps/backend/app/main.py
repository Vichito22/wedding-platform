from fastapi import FastAPI
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.db.connection import SessionLocal, check_db_connection, create_all_tables
from app.routes import admin_gifts_router, auth_router, public_gifts_router
from app.services.bootstrap_service import seed_admin_if_needed

# Ensure model metadata is registered before create_all_tables.
from app import models as _models  # noqa: F401

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_gifts_router)
app.include_router(public_gifts_router)


@app.on_event("startup")
def startup_tasks() -> None:
    create_all_tables()
    db = SessionLocal()
    try:
        seed_admin_if_needed(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Wedding API"}

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is healthy"}


@app.get("/db-health")
def db_health_check():
    is_connected, message = check_db_connection()
    if is_connected:
        return {"status": "ok", "message": message}

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"status": "error", "message": message},
    )

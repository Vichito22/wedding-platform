from fastapi import FastAPI
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.db.connection import check_db_connection

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

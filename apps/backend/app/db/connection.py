import logging
from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.config import settings

logger = logging.getLogger(__name__)

database_url = settings.database_url.strip().replace("\ufeff", "")
engine = create_engine(database_url, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
Base = declarative_base()


def check_db_connection() -> tuple[bool, str]:
    """Run a lightweight query to verify database connectivity."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True, "Database connection successful"
    except SQLAlchemyError as exc:
        logger.warning("Database connectivity check failed: %s", exc)
        return False, "Database connection failed"
    except Exception as exc:
        # Catches non-SQLAlchemy failures (e.g., decode/driver/runtime issues)
        logger.warning("Unexpected database connectivity error: %s", exc)
        return False, f"Database connection failed: {exc.__class__.__name__}"


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all_tables() -> None:
    Base.metadata.create_all(bind=engine)

from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DEFAULT_PATH = "database/database.db"
DB_URL = f"sqlite:///{DEFAULT_PATH}"

engine = create_engine(DB_URL)
Session_Local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


@contextmanager
def create_session() -> Session:
    """Create database session.

    :return: Database session.
    """
    session = Session_Local()
    try:
        yield session
    finally:
        session.close()

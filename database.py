from sqlmodel import Session, create_engine

from core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
)


def get_session():
    with Session(engine) as session:
        yield session

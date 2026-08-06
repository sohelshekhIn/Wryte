from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models import Writer
from app.schemas import WriterCreate, WriterResponse

router = APIRouter(
    prefix="/writers",
    tags=["Writers"]
)


@router.post("/", response_model=WriterResponse)
def create_writer(
    writer: WriterCreate,
    db: Session = Depends(get_db)
):
    db_writer = Writer(name=writer.name, day_streak=writer.day_streak)

    db.add(db_writer)
    db.commit()
    db.refresh(db_writer)
    return db_writer


@router.get("/", response_model=list[WriterResponse])
def get_writers(
    db: Session = Depends(get_db)
):
    return db.query(Writer).all()

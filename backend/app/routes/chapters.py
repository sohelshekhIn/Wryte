from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models import Book, Chapter
from app.schemas import ChapterCreate, ChapterResponse

router = APIRouter(
    prefix="/books/{book_id}/chapters",
    tags=["Chapters"]
)


@router.post("/", response_model=ChapterResponse)
def create_chapter(
    book_id: int,
    chapter: ChapterCreate,
    db: Session = Depends(get_db)
):
    book = db.get(Book, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    db_chapter = Chapter(
        book_id=book_id,
        title=chapter.title,
        status=chapter.status,
        position=chapter.position,
    )

    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)
    return db_chapter


@router.get("/", response_model=list[ChapterResponse])
def get_chapters(
    book_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Chapter)
        .filter(Chapter.book_id == book_id)
        .order_by(Chapter.position)
        .all()
    )

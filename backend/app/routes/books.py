from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.dependencies import get_db
from app.models import Book
from app.models.Chapter import Chapter
from app.schemas import BookCreate, BookDetailResponse, BookResponse
# we'll create Book objects and use the BookCreate schema to validate the input data, and the BookResponse schema to format the output data.

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

# router object with prefix, tells FastAPI that all routes defined in this router will have the prefix "/books"


def _book_word_count(book: Book) -> int:
    return sum(
        len(scene.body.split())
        for chapter in book.chapters
        for scene in chapter.scenes
    )


def _book_response(book: Book) -> BookResponse:
    response = BookResponse.model_validate(book)
    response.word_count = _book_word_count(book)
    response.chapter_count = len(book.chapters)
    return response


@router.post("/", response_model=BookResponse)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db)
):
    db_book = Book(
        title=book.title,
        genre=book.genre,
        target_word_count=book.target_word_count,
        status=book.status,
        progress=book.progress,
        cover_tone=book.cover_tone,
        writer_id=book.writer_id,
    )

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    # this helps to get the latest state of the object from the database, including any auto-generated fields like the primary key (id).
    # basically refresh completes the local copy of the object.
    return _book_response(db_book)


@router.get("/", response_model=list[BookResponse])
def get_books(
    db: Session = Depends(get_db)
):
    books = (
        db.query(Book)
        .options(joinedload(Book.chapters).joinedload(Chapter.scenes))
        .unique()
        .all()
    )
    return [_book_response(book) for book in books]


@router.get("/{book_id}", response_model=BookDetailResponse)
def get_book(
    book_id: int,
    db: Session = Depends(get_db)
):
    book = (
        db.query(Book)
        .options(joinedload(Book.chapters).joinedload(Chapter.scenes))
        .filter(Book.id == book_id)
        .unique()
        .first()
    )
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    response = BookDetailResponse.model_validate(book)
    response.word_count = _book_word_count(book)
    response.chapter_count = len(book.chapters)
    return response

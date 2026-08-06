from pydantic import BaseModel

from app.models.enums import BookStatus, CoverTone
from app.schemas.Chapter import ChapterDetailResponse


class BookCreate(BaseModel):
    title: str
    genre: str | None = None
    target_word_count: int
    status: BookStatus = BookStatus.DRAFT
    progress: float = 0.0
    cover_tone: CoverTone = CoverTone.SAGE
    writer_id: int | None = None


class BookResponse(BaseModel):
    id: int
    title: str
    genre: str | None = None
    target_word_count: int
    status: BookStatus
    progress: float
    cover_tone: CoverTone
    writer_id: int | None = None

    class Config:
        from_attributes = True


class BookDetailResponse(BookResponse):
    chapters: list[ChapterDetailResponse] = []
    # derived from scene bodies at request time, not a stored column
    word_count: int = 0

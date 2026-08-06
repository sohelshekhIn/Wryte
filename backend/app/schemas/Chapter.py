from pydantic import BaseModel

from app.models.enums import BookStatus
from app.schemas.Scene import SceneResponse


class ChapterCreate(BaseModel):
    title: str
    status: BookStatus = BookStatus.DRAFT
    position: int = 0


class ChapterResponse(BaseModel):
    id: int
    book_id: int
    title: str
    status: BookStatus
    position: int

    class Config:
        from_attributes = True


class ChapterDetailResponse(ChapterResponse):
    scenes: list[SceneResponse] = []

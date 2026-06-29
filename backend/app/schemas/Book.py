from pydantic import BaseModel


class BookCreate(BaseModel):
    title: str
    genre: str | None = None
    target_word_count: int


class BookResponse(BaseModel):
    id: int
    title: str
    genre: str | None = None
    target_word_count: int

    class Config:
        from_attributes = True
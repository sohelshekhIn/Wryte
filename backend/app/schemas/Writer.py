from pydantic import BaseModel


class WriterCreate(BaseModel):
    name: str
    day_streak: int = 0


class WriterResponse(BaseModel):
    id: int
    name: str
    day_streak: int

    class Config:
        from_attributes = True

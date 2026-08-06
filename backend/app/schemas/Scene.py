from pydantic import BaseModel


class SceneCreate(BaseModel):
    title: str
    body: str = ""
    position: int = 0


class SceneResponse(BaseModel):
    id: int
    chapter_id: int
    title: str
    body: str
    position: int

    class Config:
        from_attributes = True

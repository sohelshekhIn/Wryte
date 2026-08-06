from datetime import datetime

from pydantic import BaseModel

from app.models.enums import MessageRole


class ChatMessageCreate(BaseModel):
    role: MessageRole
    content: str


class ChatMessageResponse(BaseModel):
    id: int
    book_id: int
    role: MessageRole
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

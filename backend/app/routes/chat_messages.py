from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models import Book, ChatMessage
from app.schemas import ChatMessageCreate, ChatMessageResponse

router = APIRouter(
    prefix="/books/{book_id}/messages",
    tags=["Chat Messages"]
)


@router.post("/", response_model=ChatMessageResponse)
def create_chat_message(
    book_id: int,
    message: ChatMessageCreate,
    db: Session = Depends(get_db)
):
    book = db.get(Book, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    db_message = ChatMessage(
        book_id=book_id,
        role=message.role,
        content=message.content,
    )

    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/", response_model=list[ChatMessageResponse])
def get_chat_messages(
    book_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.book_id == book_id)
        .order_by(ChatMessage.created_at)
        .all()
    )

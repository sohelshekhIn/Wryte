from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import BookStatus, CoverTone, book_status_enum, cover_tone_enum

if TYPE_CHECKING:
    from app.models.ChatMessage import ChatMessage
    from app.models.Chapter import Chapter
    from app.models.Writer import Writer


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)

    genre: Mapped[str] = mapped_column(String(100), nullable=True)

    target_word_count: Mapped[int] = mapped_column(Integer, default=0)

    status: Mapped[BookStatus] = mapped_column(book_status_enum, default=BookStatus.DRAFT)

    # 0-1 fraction of the manuscript considered done
    progress: Mapped[float] = mapped_column(Float, default=0.0)

    cover_tone: Mapped[CoverTone] = mapped_column(cover_tone_enum, default=CoverTone.SAGE)

    writer_id: Mapped[int | None] = mapped_column(
        ForeignKey("writers.id", ondelete="SET NULL"), nullable=True
    )

    writer: Mapped["Writer"] = relationship(back_populates="books")

    chapters: Mapped[list["Chapter"]] = relationship(
        back_populates="book",
        cascade="all, delete-orphan",
        order_by="Chapter.position",
    )

    chat_messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="book",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )

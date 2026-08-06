from typing import TYPE_CHECKING

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.Book import Book


class Writer(Base):
    __tablename__ = "writers"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    day_streak: Mapped[int] = mapped_column(Integer, default=0)

    books: Mapped[list["Book"]] = relationship(back_populates="writer")

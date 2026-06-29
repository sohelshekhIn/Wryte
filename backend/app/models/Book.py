from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
# This is the modern "declarative" way to define columns. 
# It helps Python understand the data types for better code suggestions
from app.core.database import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)

    genre: Mapped[str] = mapped_column(String(100), nullable=True)

    target_word_count: Mapped[int] = mapped_column(Integer, default=0)
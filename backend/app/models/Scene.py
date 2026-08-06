from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.Chapter import Chapter


class Scene(Base):
    __tablename__ = "scenes"

    id: Mapped[int] = mapped_column(primary_key=True)

    chapter_id: Mapped[int] = mapped_column(
        ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)

    body: Mapped[str] = mapped_column(Text, default="", nullable=False)

    # position within the chapter's scene list, since SQL rows have no inherent order
    position: Mapped[int] = mapped_column(Integer, default=0)

    chapter: Mapped["Chapter"] = relationship(back_populates="scenes")

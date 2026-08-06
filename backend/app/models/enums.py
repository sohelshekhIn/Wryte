import enum

from sqlalchemy import Enum as SqlEnum


class BookStatus(str, enum.Enum):
    DRAFT = "draft"
    FINAL = "final"


class CoverTone(str, enum.Enum):
    SAGE = "sage"
    DEEP = "deep"
    OLIVE = "olive"


class MessageRole(str, enum.Enum):
    ASSISTANT = "assistant"
    USER = "user"


# Shared Enum instances: Chapter reuses the same book_status_enum as Book so
# SQLAlchemy maps both columns to the single "book_status" Postgres type
# instead of trying to create it twice.
book_status_enum = SqlEnum(BookStatus, name="book_status")
cover_tone_enum = SqlEnum(CoverTone, name="cover_tone")
message_role_enum = SqlEnum(MessageRole, name="message_role")

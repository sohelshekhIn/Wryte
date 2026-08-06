from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models import Book, Chapter, ChatMessage, Scene, Writer
from app.models.enums import BookStatus, CoverTone, MessageRole

router = APIRouter(prefix="/dev", tags=["Dev"])


# Former web-app mock content — seed once so the UI isn't blank after cutover.
_SEED_BOOKS = [
    {
        "title": "The Last Garden",
        "genre": "Fantasy",
        "target_word_count": 80000,
        "status": BookStatus.DRAFT,
        "progress": 0.62,
        "cover_tone": CoverTone.SAGE,
        "chapters": [
            {
                "title": "The Arrival",
                "status": BookStatus.FINAL,
                "scenes": [
                    {
                        "title": "Morning fog",
                        "body": (
                            "Marianne stepped off the coach into a fog so thick "
                            "the village seemed to be deciding, house by house, "
                            "whether to exist."
                        ),
                    },
                    {
                        "title": "The old gate",
                        "body": (
                            "The gate to Wren Cottage hung on one hinge, painted "
                            "a green that had once meant something to somebody."
                        ),
                    },
                ],
            },
            {
                "title": "The Garden",
                "status": BookStatus.FINAL,
                "scenes": [
                    {
                        "title": "First bloom",
                        "body": (
                            "By April the garden had forgiven her. A single "
                            "hellebore opened under the kitchen window, the "
                            "color of weak tea."
                        ),
                    },
                    {
                        "title": "A stranger's note",
                        "body": (
                            "The note was pinned to the potting shed door with "
                            "a rose thorn: You planted them too deep. — E."
                        ),
                    },
                ],
            },
            {
                "title": "The Storm",
                "status": BookStatus.DRAFT,
                "scenes": [
                    {
                        "title": "Dark clouds",
                        "body": (
                            "The clouds rolled in from the west long before "
                            "Marianne noticed them. She was kneeling in the "
                            "herb bed, fingers deep in soil, when the first "
                            "gust rattled the gate she had oiled only that "
                            "morning.\n\nShe looked up. The sky had gone the "
                            "color of a bruise, and somewhere beyond the hedge "
                            "a door was banging against its frame, over and "
                            "over, like something trying to get out."
                        ),
                    },
                    {"title": "The letter", "body": ""},
                    {"title": "Aftermath", "body": ""},
                ],
            },
            {
                "title": "Revelations",
                "status": BookStatus.DRAFT,
                "scenes": [{"title": "Old photographs", "body": ""}],
            },
        ],
        "messages": [
            {
                "role": MessageRole.ASSISTANT,
                "content": (
                    "Want a few ideas for what's behind that banging door? "
                    "I can keep it grounded in Marianne's POV or lean into "
                    "the storm as an omen."
                ),
            },
            {
                "role": MessageRole.USER,
                "content": "Give me 3 options that feel ominous but not supernatural.",
            },
            {
                "role": MessageRole.ASSISTANT,
                "content": (
                    "1. A shutter she forgot to latch — but it wasn't loose yesterday.\n"
                    "2. Her brother's old bicycle, blown from the shed.\n"
                    "3. The garden gate itself, though she just fixed the hinge."
                ),
            },
        ],
    },
    {
        "title": "Letters from the Coast",
        "genre": "Literary fiction",
        "target_word_count": 60000,
        "status": BookStatus.FINAL,
        "progress": 1.0,
        "cover_tone": CoverTone.DEEP,
        "chapters": [
            {
                "title": "Salt",
                "status": BookStatus.FINAL,
                "scenes": [
                    {
                        "title": "The first letter",
                        "body": (
                            "Dear June — the sea here is not blue, whatever "
                            "the postcards promised you."
                        ),
                    },
                ],
            },
            {
                "title": "Driftwood",
                "status": BookStatus.FINAL,
                "scenes": [{"title": "What washes up", "body": ""}],
            },
            {
                "title": "Harbor Lights",
                "status": BookStatus.FINAL,
                "scenes": [{"title": "The last letter", "body": ""}],
            },
        ],
        "messages": [],
    },
    {
        "title": "Untitled Mystery",
        "genre": "Mystery",
        "target_word_count": 70000,
        "status": BookStatus.DRAFT,
        "progress": 0.14,
        "cover_tone": CoverTone.OLIVE,
        "chapters": [
            {
                "title": "The Orchard",
                "status": BookStatus.DRAFT,
                "scenes": [
                    {
                        "title": "The find",
                        "body": (
                            "The apples had fallen early that year, and so, "
                            "it turned out, had Mr. Pettigrew."
                        ),
                    },
                ],
            },
            {
                "title": "Questions",
                "status": BookStatus.DRAFT,
                "scenes": [{"title": "The inspector", "body": ""}],
            },
        ],
        "messages": [],
    },
]


@router.post("/seed")
def seed_demo_data(db: Session = Depends(get_db)):
    """Idempotent: no-op when any books already exist."""
    if db.query(Book).first() is not None:
        return {"seeded": False, "reason": "books already exist"}

    writer = Writer(name="Sohel", day_streak=18)
    db.add(writer)
    db.flush()

    for book_data in _SEED_BOOKS:
        book = Book(
            title=book_data["title"],
            genre=book_data["genre"],
            target_word_count=book_data["target_word_count"],
            status=book_data["status"],
            progress=book_data["progress"],
            cover_tone=book_data["cover_tone"],
            writer_id=writer.id,
        )
        db.add(book)
        db.flush()

        for ch_pos, ch_data in enumerate(book_data["chapters"]):
            chapter = Chapter(
                book_id=book.id,
                title=ch_data["title"],
                status=ch_data["status"],
                position=ch_pos,
            )
            db.add(chapter)
            db.flush()

            for sc_pos, sc_data in enumerate(ch_data["scenes"]):
                db.add(
                    Scene(
                        chapter_id=chapter.id,
                        title=sc_data["title"],
                        body=sc_data["body"],
                        position=sc_pos,
                    )
                )

        for msg in book_data["messages"]:
            db.add(
                ChatMessage(
                    book_id=book.id,
                    role=msg["role"],
                    content=msg["content"],
                )
            )

    db.commit()
    return {"seeded": True, "writer_id": writer.id, "book_count": len(_SEED_BOOKS)}

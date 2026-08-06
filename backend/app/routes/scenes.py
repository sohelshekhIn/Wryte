from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models import Chapter, Scene
from app.schemas import SceneCreate, SceneResponse

router = APIRouter(
    prefix="/chapters/{chapter_id}/scenes",
    tags=["Scenes"]
)


@router.post("/", response_model=SceneResponse)
def create_scene(
    chapter_id: int,
    scene: SceneCreate,
    db: Session = Depends(get_db)
):
    chapter = db.get(Chapter, chapter_id)
    if chapter is None:
        raise HTTPException(status_code=404, detail="Chapter not found")

    db_scene = Scene(
        chapter_id=chapter_id,
        title=scene.title,
        body=scene.body,
        position=scene.position,
    )

    db.add(db_scene)
    db.commit()
    db.refresh(db_scene)
    return db_scene


@router.get("/", response_model=list[SceneResponse])
def get_scenes(
    chapter_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Scene)
        .filter(Scene.chapter_id == chapter_id)
        .order_by(Scene.position)
        .all()
    )

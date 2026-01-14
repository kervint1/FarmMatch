"""
Initialization endpoint for Heroku deployment
"""
from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select

from database import engine
from models import PrefectureStamp

router = APIRouter()


@router.post("/api/admin/init-prefecture-stamps")
async def init_prefecture_stamps():
    """Initialize prefecture stamps data"""
    try:
        with Session(engine) as session:
            # Check if data already exists
            existing = session.exec(select(PrefectureStamp)).first()
            if existing:
                return {"message": "Prefecture stamps already exist", "count": session.exec(select(PrefectureStamp)).all().__len__()}

            # Create prefecture stamps
            stamps = [
                PrefectureStamp(prefecture_code="01", name="北海道", name_romaji="Hokkaido", image_url="/stamps/hokkaido.png", region="北海道", display_order=1),
                PrefectureStamp(prefecture_code="02", name="青森県", name_romaji="Aomori", image_url="/stamps/aomori.png", region="東北", display_order=2),
                PrefectureStamp(prefecture_code="20", name="長野県", name_romaji="Nagano", image_url="/stamps/nagano.png", region="中部", display_order=20),
                PrefectureStamp(prefecture_code="43", name="熊本県", name_romaji="Kumamoto", image_url="/stamps/kumamoto.png", region="九州", display_order=43),
            ]

            for stamp in stamps:
                session.add(stamp)

            session.commit()

            return {"message": "Prefecture stamps initialized successfully", "count": len(stamps)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize: {str(e)}")

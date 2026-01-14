from sqlmodel import Session, create_engine
import os
from models import PrefectureStamp
from datetime import datetime

database_url = os.environ['DATABASE_URL'].replace("postgres://", "postgresql://")
engine = create_engine(database_url)

with Session(engine) as session:
    stamps = [
        PrefectureStamp(prefecture_code="01", name="北海道", name_romaji="Hokkaido", image_url="/stamps/hokkaido.png", region="北海道", display_order=1, created_at=datetime.utcnow()),
        PrefectureStamp(prefecture_code="20", name="長野県", name_romaji="Nagano", image_url="/stamps/nagano.png", region="中部", display_order=20, created_at=datetime.utcnow()),
        PrefectureStamp(prefecture_code="43", name="熊本県", name_romaji="Kumamoto", image_url="/stamps/kumamoto.png", region="九州", display_order=43, created_at=datetime.utcnow()),
    ]
    for stamp in stamps:
        try:
            session.add(stamp)
            session.commit()
            print(f"✅ Added {stamp.name}")
        except Exception as e:
            session.rollback()
            print(f"⚠️  {stamp.name} already exists or error: {e}")
    
    print("Done!")

"""
Fix farm image URLs for Farm 1 and 2
"""

from sqlmodel import Session, create_engine, select

from core.config import settings
from models.farm_image import FarmImage


def fix_farm_images():
    """Update farm image URLs to correct paths."""
    engine = create_engine(settings.DATABASE_URL, echo=True)

    with Session(engine) as session:
        # Fix Farm 1 main image
        img1 = session.exec(select(FarmImage).where(FarmImage.id == 1)).first()
        if img1:
            img1.image_url = "/uploads/farm_images/farm1_main.jpg"
            session.add(img1)
            print(f"✅ Updated Farm 1 main image: {img1.image_url}")

        # Fix Farm 1 sub image
        img2 = session.exec(select(FarmImage).where(FarmImage.id == 2)).first()
        if img2:
            img2.image_url = "/uploads/farm_images/farm1_sub1.jpeg"
            session.add(img2)
            print(f"✅ Updated Farm 1 sub image: {img2.image_url}")

        # Fix Farm 2 main image
        img3 = session.exec(select(FarmImage).where(FarmImage.id == 3)).first()
        if img3:
            img3.image_url = "/uploads/farm_images/farm2_main.jpg"
            session.add(img3)
            print(f"✅ Updated Farm 2 main image: {img3.image_url}")

        session.commit()
        print("\n🎉 Farm image URLs updated successfully!")


if __name__ == "__main__":
    print("🔧 Fixing farm image URLs...")
    fix_farm_images()

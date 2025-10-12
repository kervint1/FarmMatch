"""
Database initialization script.
Creates tables and optionally seeds sample data.
"""

from datetime import date, datetime, timedelta
from decimal import Decimal

from sqlmodel import Session, SQLModel, create_engine, select

from core.config import settings
from models import (
    Comment,
    Farm,
    FarmImage,
    Post,
    PostImage,
    Reservation,
    Review,
    User,
)


def create_db_and_tables():
    """Create all tables in the database."""
    engine = create_engine(settings.DATABASE_URL, echo=True)
    SQLModel.metadata.create_all(engine)
    print("✅ All tables created successfully!")
    return engine


def seed_sample_data(engine):
    """Insert sample data for development."""
    with Session(engine) as session:
        # Check if data already exists
        existing_users = session.exec(select(User)).first()
        if existing_users:
            print("⚠️  Sample data already exists. Skipping...")
            return

        print("📝 Creating sample data...")

        # Create users
        users = [
            User(
                google_id="google_123456",
                email="admin@farmmatch.com",
                name="管理者太郎",
                user_type="admin",
                phone_number="090-1234-5678",
                prefecture="東京都",
                city="渋谷区",
            ),
            User(
                google_id="google_789012",
                email="farmer@example.com",
                name="農家花子",
                user_type="host",
                phone_number="090-2345-6789",
                prefecture="長野県",
                city="軽井沢町",
            ),
            User(
                google_id="google_345678",
                email="guest@example.com",
                name="体験次郎",
                user_type="guest",
                phone_number="090-3456-7890",
                prefecture="神奈川県",
                city="横浜市",
            ),
        ]
        for user in users:
            session.add(user)
        session.commit()
        session.refresh(users[0])
        session.refresh(users[1])
        session.refresh(users[2])
        print(f"✅ Created {len(users)} users")

        # Create farms
        farms = [
            Farm(
                host_id=users[1].id,
                name="軽井沢オーガニックファーム",
                description="自然豊かな軽井沢で有機野菜の収穫体験ができます。初心者の方も大歓迎！",
                prefecture="長野県",
                city="軽井沢町",
                address="軽井沢町大字長倉1234-5",
                latitude=Decimal("36.3426"),
                longitude=Decimal("138.6302"),
                experience_type="agriculture",
                price_per_day=8000,
                price_per_night=12000,
                max_guests=6,
                facilities={
                    "wifi": True,
                    "parking": True,
                    "shower": True,
                    "kitchen": True,
                },
                access_info="軽井沢駅から車で15分、無料送迎あり",
                is_active=True,
            ),
            Farm(
                host_id=users[1].id,
                name="信州牧場体験",
                description="牛や羊の餌やり、乳搾り体験ができる牧場です。",
                prefecture="長野県",
                city="安曇野市",
                address="安曇野市穂高6789",
                latitude=Decimal("36.3050"),
                longitude=Decimal("137.9027"),
                experience_type="livestock",
                price_per_day=10000,
                price_per_night=15000,
                max_guests=8,
                facilities={"wifi": False, "parking": True, "shower": True},
                access_info="安曇野ICから車で20分",
                is_active=True,
            ),
        ]
        for farm in farms:
            session.add(farm)
        session.commit()
        session.refresh(farms[0])
        session.refresh(farms[1])
        print(f"✅ Created {len(farms)} farms")

        # Create farm images
        farm_images = [
            FarmImage(
                farm_id=farms[0].id,
                image_url="https://example.com/images/farm1_main.jpg",
                is_main=True,
                display_order=0,
            ),
            FarmImage(
                farm_id=farms[0].id,
                image_url="https://example.com/images/farm1_sub1.jpg",
                is_main=False,
                display_order=1,
            ),
            FarmImage(
                farm_id=farms[1].id,
                image_url="https://example.com/images/farm2_main.jpg",
                is_main=True,
                display_order=0,
            ),
        ]
        for img in farm_images:
            session.add(img)
        session.commit()
        print(f"✅ Created {len(farm_images)} farm images")

        # Create reservations
        today = date.today()
        reservations = [
            Reservation(
                guest_id=users[2].id,
                farm_id=farms[0].id,
                start_date=today + timedelta(days=7),
                end_date=today + timedelta(days=9),
                num_guests=2,
                total_amount=32000,
                status="pending",
                contact_phone="090-3456-7890",
                message="初めての農業体験です。よろしくお願いします。",
            ),
            Reservation(
                guest_id=users[2].id,
                farm_id=farms[1].id,
                start_date=today - timedelta(days=30),
                end_date=today - timedelta(days=29),
                num_guests=3,
                total_amount=30000,
                status="completed",
                contact_phone="090-3456-7890",
            ),
        ]
        for reservation in reservations:
            session.add(reservation)
        session.commit()
        session.refresh(reservations[0])
        session.refresh(reservations[1])
        print(f"✅ Created {len(reservations)} reservations")

        # Create review
        reviews = [
            Review(
                reservation_id=reservations[1].id,
                guest_id=users[2].id,
                farm_id=farms[1].id,
                rating=5,
                comment="とても楽しい体験でした！ホストの方も親切で、また訪れたいです。",
                experience_date=today - timedelta(days=29),
            )
        ]
        for review in reviews:
            session.add(review)
        session.commit()
        print(f"✅ Created {len(reviews)} reviews")

        # Create posts
        posts = [
            Post(
                user_id=users[2].id,
                farm_id=farms[1].id,
                title="初めての牧場体験！",
                content="信州牧場で牛の乳搾り体験をしてきました。想像以上に楽しかったです！",
                like_count=15,
            ),
            Post(
                user_id=users[1].id,
                farm_id=None,
                title="今年の収穫シーズン開始",
                content="今年もたくさんの方に農業体験を楽しんでいただけるよう頑張ります！",
                like_count=8,
            ),
        ]
        for post in posts:
            session.add(post)
        session.commit()
        session.refresh(posts[0])
        session.refresh(posts[1])
        print(f"✅ Created {len(posts)} posts")

        # Create post images
        post_images = [
            PostImage(
                post_id=posts[0].id,
                image_url="https://example.com/images/post1_img1.jpg",
                display_order=0,
            )
        ]
        for img in post_images:
            session.add(img)
        session.commit()
        print(f"✅ Created {len(post_images)} post images")

        # Create comments
        comments = [
            Comment(
                post_id=posts[0].id,
                user_id=users[1].id,
                content="来てくださってありがとうございました！またぜひお越しください！",
            ),
            Comment(
                post_id=posts[0].id,
                user_id=users[0].id,
                content="素敵な体験レポートですね！",
            ),
        ]
        for comment in comments:
            session.add(comment)
        session.commit()
        print(f"✅ Created {len(comments)} comments")

        print("\n🎉 Sample data creation completed!")


if __name__ == "__main__":
    print("🚀 Starting database initialization...")
    engine = create_db_and_tables()
    seed_sample_data(engine)
    print("\n✨ Database initialization completed successfully!")

"""
Seed sample data endpoint for Heroku deployment
"""
from datetime import date, timedelta
from decimal import Decimal

from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select

from database import engine
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

router = APIRouter()


@router.post("/api/admin/seed-sample-data")
async def seed_sample_data():
    """Seed sample data for development"""
    try:
        with Session(engine) as session:
            # Check if data already exists
            existing_users = session.exec(select(User)).first()
            if existing_users:
                return {"message": "Sample data already exists", "skipped": True}

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
                User(
                    google_id="google_111222",
                    email="farmer2@example.com",
                    name="山田農園主",
                    user_type="host",
                    phone_number="090-1111-2222",
                    prefecture="北海道",
                    city="富良野市",
                ),
                User(
                    google_id="google_333444",
                    email="farmer3@example.com",
                    name="田中牧場主",
                    user_type="host",
                    phone_number="090-3333-4444",
                    prefecture="熊本県",
                    city="阿蘇市",
                ),
                User(
                    google_id="google_555666",
                    email="guest2@example.com",
                    name="旅する三郎",
                    user_type="guest",
                    phone_number="090-5555-6666",
                    prefecture="大阪府",
                    city="大阪市",
                ),
            ]
            for user in users:
                session.add(user)
            session.commit()
            for user in users:
                session.refresh(user)

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
                Farm(
                    host_id=users[3].id,
                    name="富良野ラベンダーファーム",
                    description="広大なラベンダー畑での収穫体験。初夏には一面紫色の絶景が広がります。",
                    prefecture="北海道",
                    city="富良野市",
                    address="富良野市字中御料",
                    latitude=Decimal("43.3417"),
                    longitude=Decimal("142.3831"),
                    experience_type="agriculture",
                    price_per_day=9000,
                    price_per_night=13000,
                    max_guests=5,
                    facilities={
                        "wifi": True,
                        "parking": True,
                        "shower": True,
                        "kitchen": False,
                    },
                    access_info="富良野駅から車で10分",
                    is_active=True,
                ),
                Farm(
                    host_id=users[4].id,
                    name="阿蘇高原牧場",
                    description="雄大な阿蘇の自然の中で馬や牛とのふれあい体験。大自然を満喫できます。",
                    prefecture="熊本県",
                    city="阿蘇市",
                    address="阿蘇市一の宮町宮地",
                    latitude=Decimal("32.8841"),
                    longitude=Decimal("131.0353"),
                    experience_type="livestock",
                    price_per_day=8500,
                    price_per_night=14000,
                    max_guests=10,
                    facilities={
                        "wifi": False,
                        "parking": True,
                        "shower": True,
                        "kitchen": True,
                    },
                    access_info="阿蘇駅から車で15分、無料送迎あり",
                    is_active=True,
                ),
            ]
            for farm in farms:
                session.add(farm)
            session.commit()
            for farm in farms:
                session.refresh(farm)

            # Create farm images
            farm_images = [
                FarmImage(
                    farm_id=farms[0].id,
                    image_url="/uploads/farm_images/farm1_main.jpg",
                    is_main=True,
                    display_order=0,
                ),
                FarmImage(
                    farm_id=farms[0].id,
                    image_url="/uploads/farm_images/farm1_sub1.jpeg",
                    is_main=False,
                    display_order=1,
                ),
                FarmImage(
                    farm_id=farms[1].id,
                    image_url="/uploads/farm_images/farm2_main.jpg",
                    is_main=True,
                    display_order=0,
                ),
                FarmImage(
                    farm_id=farms[2].id,
                    image_url="/uploads/farm_images/farm1_main.jpg",
                    is_main=True,
                    display_order=0,
                ),
                FarmImage(
                    farm_id=farms[3].id,
                    image_url="/uploads/farm_images/farm2_main.jpg",
                    is_main=True,
                    display_order=0,
                ),
            ]
            for img in farm_images:
                session.add(img)
            session.commit()

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
                Reservation(
                    guest_id=users[2].id,
                    farm_id=farms[2].id,
                    start_date=today - timedelta(days=60),
                    end_date=today - timedelta(days=58),
                    num_guests=2,
                    total_amount=27000,
                    status="completed",
                    contact_phone="090-3456-7890",
                ),
                Reservation(
                    guest_id=users[5].id,
                    farm_id=farms[0].id,
                    start_date=today - timedelta(days=45),
                    end_date=today - timedelta(days=44),
                    num_guests=1,
                    total_amount=8000,
                    status="completed",
                    contact_phone="090-5555-6666",
                    message="全国を旅しながら農業体験をしています！",
                ),
                Reservation(
                    guest_id=users[5].id,
                    farm_id=farms[3].id,
                    start_date=today - timedelta(days=20),
                    end_date=today - timedelta(days=19),
                    num_guests=1,
                    total_amount=8500,
                    status="completed",
                    contact_phone="090-5555-6666",
                ),
            ]
            for reservation in reservations:
                session.add(reservation)
            session.commit()
            for reservation in reservations:
                session.refresh(reservation)

            # Create reviews
            reviews = [
                Review(
                    reservation_id=reservations[1].id,
                    guest_id=users[2].id,
                    farm_id=farms[1].id,
                    rating=5,
                    comment="とても楽しい体験でした！ホストの方も親切で、また訪れたいです。",
                    experience_date=today - timedelta(days=29),
                ),
                Review(
                    reservation_id=reservations[2].id,
                    guest_id=users[2].id,
                    farm_id=farms[2].id,
                    rating=5,
                    comment="ラベンダー畑が本当に美しかったです！収穫体験も楽しくて、良い思い出になりました。",
                    experience_date=today - timedelta(days=58),
                ),
                Review(
                    reservation_id=reservations[3].id,
                    guest_id=users[5].id,
                    farm_id=farms[0].id,
                    rating=4,
                    comment="有機野菜の収穫体験が素晴らしかったです。軽井沢の自然も最高でした。",
                    experience_date=today - timedelta(days=44),
                ),
                Review(
                    reservation_id=reservations[4].id,
                    guest_id=users[5].id,
                    farm_id=farms[3].id,
                    rating=5,
                    comment="阿蘇の大自然の中での牧場体験は感動的でした！馬との触れ合いが特に良かったです。",
                    experience_date=today - timedelta(days=19),
                ),
            ]
            for review in reviews:
                session.add(review)
            session.commit()

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

            return {
                "message": "Sample data seeded successfully",
                "counts": {
                    "users": len(users),
                    "farms": len(farms),
                    "farm_images": len(farm_images),
                    "reservations": len(reservations),
                    "reviews": len(reviews),
                    "posts": len(posts),
                    "post_images": len(post_images),
                    "comments": len(comments),
                },
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to seed data: {str(e)}")

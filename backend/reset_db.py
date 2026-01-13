"""
Database reset script.
Drops all tables and recreates them with fresh sample data.
"""

from sqlmodel import SQLModel, create_engine

from core.config import settings
from init_db import seed_sample_data


def reset_database():
    """Drop all tables and recreate them."""
    engine = create_engine(settings.DATABASE_URL, echo=True)

    print("🗑️  Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    print("✅ All tables dropped")

    print("\n📦 Creating tables...")
    SQLModel.metadata.create_all(engine)
    print("✅ All tables created")

    print("\n📝 Seeding sample data...")
    seed_sample_data(engine)

    print("\n✨ Database reset completed successfully!")


if __name__ == "__main__":
    import sys

    confirm = input("⚠️  This will DELETE all data in the database. Are you sure? (yes/no): ")
    if confirm.lower() != "yes":
        print("❌ Reset cancelled")
        sys.exit(0)

    reset_database()

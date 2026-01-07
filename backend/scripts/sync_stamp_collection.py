"""
既存レビューからスタンプコレクションを同期するスクリプト

Usage:
    cd backend
    python scripts/sync_stamp_collection.py
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from sqlmodel import Session, create_engine, select
from core.config import settings
from models import Review
from services.stamp import StampService


def sync_all_reviews():
    """既存の全レビューからスタンプコレクションを生成"""
    print("既存レビューからのスタンプコレクション同期を開始...")

    engine = create_engine(settings.DATABASE_URL)

    with Session(engine) as session:
        # 全レビューを取得
        reviews = list(session.exec(select(Review).order_by(Review.id)).all())
        total_reviews = len(reviews)

        if total_reviews == 0:
            print("同期対象のレビューが見つかりませんでした")
            return

        print(f"同期対象レビュー数: {total_reviews}")
        response = input("同期を開始しますか? (y/N): ")
        if response.lower() != "y":
            print("処理を中止しました")
            return

        # レビューごとに同期
        success_count = 0
        error_count = 0
        skipped_count = 0

        for i, review in enumerate(reviews, 1):
            try:
                # 進捗表示
                if i % 10 == 0 or i == total_reviews:
                    print(f"処理中... {i}/{total_reviews} ({i*100//total_reviews}%)")

                # スタンプ同期を実行
                StampService.sync_stamp_from_review(session, review.id)
                success_count += 1

            except Exception as e:
                error_message = str(e)

                # 都道府県が見つからない場合はスキップ（エラーとしてカウントしない）
                if "prefecture" in error_message.lower() or "not found" in error_message.lower():
                    skipped_count += 1
                else:
                    error_count += 1
                    print(f"  ✗ エラー (Review ID: {review.id}): {e}")

        # 結果サマリー
        print("\n=== 同期結果 ===")
        print(f"総レビュー数: {total_reviews}")
        print(f"✓ 成功: {success_count}")
        print(f"- スキップ: {skipped_count} (都道府県情報なし等)")
        print(f"✗ エラー: {error_count}")

        if success_count > 0:
            print("\n同期が完了しました！")
        elif skipped_count == total_reviews:
            print("\n注意: すべてのレビューがスキップされました")
            print("ファームデータに都道府県情報が設定されているか確認してください")
        else:
            print("\n警告: 一部のレビューの同期に失敗しました")


def show_sync_stats():
    """同期後の統計情報を表示"""
    print("\n=== スタンプコレクション統計 ===")

    engine = create_engine(settings.DATABASE_URL)

    with Session(engine) as session:
        from models import UserStampCollection, UserStampDetail

        # コレクション数
        collections = list(session.exec(select(UserStampCollection)).all())
        print(f"ユーザースタンプコレクション数: {len(collections)}")

        # 詳細レコード数
        details = list(session.exec(select(UserStampDetail)).all())
        print(f"訪問詳細レコード数: {len(details)}")

        if collections:
            # ユーザー別集計
            from collections import defaultdict

            user_stats = defaultdict(int)
            for collection in collections:
                user_stats[collection.guest_id] += 1

            print(f"\nユーザー数: {len(user_stats)}")
            print("訪問都道府県数トップ5:")
            top_users = sorted(user_stats.items(), key=lambda x: x[1], reverse=True)[:5]
            for user_id, count in top_users:
                print(f"  User ID {user_id}: {count} 都道府県")


if __name__ == "__main__":
    print("=" * 60)
    print("スタンプコレクション同期スクリプト")
    print("=" * 60)
    print()

    # 同期実行
    sync_all_reviews()

    # 統計表示
    show_sync_stats()

    print("\n完了！")

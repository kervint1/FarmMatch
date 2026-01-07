"""
都道府県スタンプマスタデータ初期化スクリプト

Usage:
    cd backend
    python scripts/init_prefecture_stamps.py
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from sqlmodel import Session, create_engine, select
from core.config import settings
from models import PrefectureStamp


PREFECTURE_DATA = [
    # 北海道
    {"code": "01", "name": "北海道", "romaji": "hokkaido", "region": "hokkaido", "order": 1},
    # 東北
    {"code": "02", "name": "青森県", "romaji": "aomori", "region": "tohoku", "order": 2},
    {"code": "03", "name": "岩手県", "romaji": "iwate", "region": "tohoku", "order": 3},
    {"code": "04", "name": "宮城県", "romaji": "miyagi", "region": "tohoku", "order": 4},
    {"code": "05", "name": "秋田県", "romaji": "akita", "region": "tohoku", "order": 5},
    {"code": "06", "name": "山形県", "romaji": "yamagata", "region": "tohoku", "order": 6},
    {"code": "07", "name": "福島県", "romaji": "fukushima", "region": "tohoku", "order": 7},
    # 関東
    {"code": "08", "name": "茨城県", "romaji": "ibaraki", "region": "kanto", "order": 8},
    {"code": "09", "name": "栃木県", "romaji": "tochigi", "region": "kanto", "order": 9},
    {"code": "10", "name": "群馬県", "romaji": "gunma", "region": "kanto", "order": 10},
    {"code": "11", "name": "埼玉県", "romaji": "saitama", "region": "kanto", "order": 11},
    {"code": "12", "name": "千葉県", "romaji": "chiba", "region": "kanto", "order": 12},
    {"code": "13", "name": "東京都", "romaji": "tokyo", "region": "kanto", "order": 13},
    {"code": "14", "name": "神奈川県", "romaji": "kanagawa", "region": "kanto", "order": 14},
    # 中部
    {"code": "15", "name": "新潟県", "romaji": "niigata", "region": "chubu", "order": 15},
    {"code": "16", "name": "富山県", "romaji": "toyama", "region": "chubu", "order": 16},
    {"code": "17", "name": "石川県", "romaji": "ishikawa", "region": "chubu", "order": 17},
    {"code": "18", "name": "福井県", "romaji": "fukui", "region": "chubu", "order": 18},
    {"code": "19", "name": "山梨県", "romaji": "yamanashi", "region": "chubu", "order": 19},
    {"code": "20", "name": "長野県", "romaji": "nagano", "region": "chubu", "order": 20},
    {"code": "21", "name": "岐阜県", "romaji": "gifu", "region": "chubu", "order": 21},
    {"code": "22", "name": "静岡県", "romaji": "shizuoka", "region": "chubu", "order": 22},
    {"code": "23", "name": "愛知県", "romaji": "aichi", "region": "chubu", "order": 23},
    # 近畿
    {"code": "24", "name": "三重県", "romaji": "mie", "region": "kinki", "order": 24},
    {"code": "25", "name": "滋賀県", "romaji": "shiga", "region": "kinki", "order": 25},
    {"code": "26", "name": "京都府", "romaji": "kyoto", "region": "kinki", "order": 26},
    {"code": "27", "name": "大阪府", "romaji": "osaka", "region": "kinki", "order": 27},
    {"code": "28", "name": "兵庫県", "romaji": "hyogo", "region": "kinki", "order": 28},
    {"code": "29", "name": "奈良県", "romaji": "nara", "region": "kinki", "order": 29},
    {"code": "30", "name": "和歌山県", "romaji": "wakayama", "region": "kinki", "order": 30},
    # 中国
    {"code": "31", "name": "鳥取県", "romaji": "tottori", "region": "chugoku", "order": 31},
    {"code": "32", "name": "島根県", "romaji": "shimane", "region": "chugoku", "order": 32},
    {"code": "33", "name": "岡山県", "romaji": "okayama", "region": "chugoku", "order": 33},
    {"code": "34", "name": "広島県", "romaji": "hiroshima", "region": "chugoku", "order": 34},
    {"code": "35", "name": "山口県", "romaji": "yamaguchi", "region": "chugoku", "order": 35},
    # 四国
    {"code": "36", "name": "徳島県", "romaji": "tokushima", "region": "shikoku", "order": 36},
    {"code": "37", "name": "香川県", "romaji": "kagawa", "region": "shikoku", "order": 37},
    {"code": "38", "name": "愛媛県", "romaji": "ehime", "region": "shikoku", "order": 38},
    {"code": "39", "name": "高知県", "romaji": "kochi", "region": "shikoku", "order": 39},
    # 九州・沖縄
    {"code": "40", "name": "福岡県", "romaji": "fukuoka", "region": "kyushu", "order": 40},
    {"code": "41", "name": "佐賀県", "romaji": "saga", "region": "kyushu", "order": 41},
    {"code": "42", "name": "長崎県", "romaji": "nagasaki", "region": "kyushu", "order": 42},
    {"code": "43", "name": "熊本県", "romaji": "kumamoto", "region": "kyushu", "order": 43},
    {"code": "44", "name": "大分県", "romaji": "oita", "region": "kyushu", "order": 44},
    {"code": "45", "name": "宮崎県", "romaji": "miyazaki", "region": "kyushu", "order": 45},
    {"code": "46", "name": "鹿児島県", "romaji": "kagoshima", "region": "kyushu", "order": 46},
    {"code": "47", "name": "沖縄県", "romaji": "okinawa", "region": "kyushu", "order": 47},
]


def init_prefecture_stamps():
    """都道府県スタンプマスタデータを初期化"""
    print("都道府県スタンプマスタデータ初期化を開始...")

    engine = create_engine(settings.DATABASE_URL)

    with Session(engine) as session:
        # 既存データをチェック
        existing_count = len(list(session.exec(select(PrefectureStamp)).all()))
        if existing_count > 0:
            print(f"警告: 既に {existing_count} 件のデータが存在します")
            response = input("既存データを削除して再作成しますか? (y/N): ")
            if response.lower() != "y":
                print("処理を中止しました")
                return

            # 既存データを削除
            for stamp in session.exec(select(PrefectureStamp)).all():
                session.delete(stamp)
            session.commit()
            print("既存データを削除しました")

        # 新規データを挿入
        created_count = 0
        for data in PREFECTURE_DATA:
            stamp = PrefectureStamp(
                prefecture_code=data["code"],
                name=data["name"],
                name_romaji=data["romaji"],
                image_url=f"/uploads/stamps/prefectures/{data['code']}_{data['romaji']}.png",
                region=data["region"],
                display_order=data["order"],
                is_active=True,
            )
            session.add(stamp)
            created_count += 1

        session.commit()
        print(f"✓ {created_count} 件の都道府県データを作成しました")

        # 作成されたデータを確認
        print("\n作成されたデータ:")
        for stamp in session.exec(
            select(PrefectureStamp).order_by(PrefectureStamp.display_order)
        ).all():
            print(
                f"  {stamp.prefecture_code}: {stamp.name} ({stamp.name_romaji}) - {stamp.region}"
            )

    print("\n初期化が完了しました！")
    print(
        "\n次のステップ: backend/uploads/stamps/prefectures/ に画像ファイルを配置してください"
    )
    print("  例: 01_hokkaido.png, 02_aomori.png, ...")


if __name__ == "__main__":
    init_prefecture_stamps()

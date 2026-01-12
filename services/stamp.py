from datetime import datetime
from sqlmodel import Session, select, func
from typing import Optional


from models import (
    PrefectureStamp,
    UserStampCollection,
    UserStampDetail,
    Review,
    Farm,
)
from schemas.stamp import (
    StampCollectionSummary,
    PrefectureStampStatus,
    StampCollectionResponse,
    PrefectureDetailResponse,
    VisitedFarmInfo,
)




class StampService:
    """スタンプラリー関連のビジネスロジック"""


    @staticmethod
    def get_all_prefectures(session: Session) -> list[PrefectureStamp]:
        """全都道府県マスタを取得"""
        query = (
            select(PrefectureStamp)
            .where(PrefectureStamp.is_active == True)
            .order_by(PrefectureStamp.display_order)
        )
        return list(session.exec(query).all())


    @staticmethod
    def get_user_stamp_collection(
        session: Session, guest_id: int
    ) -> StampCollectionResponse:
        """ユーザーのスタンプ収集状況を取得"""


        # 全都道府県マスタを取得
        all_prefectures = StampService.get_all_prefectures(session)


        # ユーザーの収集状況を取得
        user_collections = list(
            session.exec(
                select(UserStampCollection).where(
                    UserStampCollection.guest_id == guest_id
                )
            ).all()
        )


        # 都道府県コードをキーにした辞書を作成
        collection_dict = {uc.prefecture_code: uc for uc in user_collections}


        # 各都道府県のステータスを生成
        stamps = []
        total_visits = 0
        total_farms = 0


        for pref in all_prefectures:
            collection = collection_dict.get(pref.prefecture_code)


            if collection:
                stamps.append(
                    PrefectureStampStatus(
                        prefecture_code=pref.prefecture_code,
                        name=pref.name,
                        image_url=pref.image_url,
                        region=pref.region,
                        is_visited=True,
                        visit_count=collection.visit_count,
                        first_visit_date=collection.first_visit_date,
                        last_visit_date=collection.last_visit_date,
                        unique_farms_count=collection.unique_farms_count,
                    )
                )
                total_visits += collection.visit_count
                total_farms += collection.unique_farms_count
            else:
                stamps.append(
                    PrefectureStampStatus(
                        prefecture_code=pref.prefecture_code,
                        name=pref.name,
                        image_url=pref.image_url,
                        region=pref.region,
                        is_visited=False,
                    )
                )


        # サマリー生成
        total_prefectures = len(user_collections)
        completion_rate = (
            (total_prefectures / 47.0) * 100 if total_prefectures > 0 else 0
        )


        summary = StampCollectionSummary(
            total_prefectures=total_prefectures,
            total_visits=total_visits,
            total_farms=total_farms,
            completion_rate=round(completion_rate, 1),
        )


        return StampCollectionResponse(summary=summary, stamps=stamps)


    @staticmethod
    def get_prefecture_detail(
        session: Session, guest_id: int, prefecture_code: str
    ) -> Optional[PrefectureDetailResponse]:
        """特定都道府県の詳細情報を取得"""


        # 収集状況を取得
        collection = session.exec(
            select(UserStampCollection).where(
                UserStampCollection.guest_id == guest_id,
                UserStampCollection.prefecture_code == prefecture_code,
            )
        ).first()


        if not collection:
            return None


        # 都道府県名を取得
        prefecture = session.exec(
            select(PrefectureStamp).where(
                PrefectureStamp.prefecture_code == prefecture_code
            )
        ).first()


        if not prefecture:
            return None


        # 訪問詳細を取得（ファーム情報を含む）
        query = (
            select(UserStampDetail, Farm)
            .join(Farm, UserStampDetail.farm_id == Farm.id)
            .where(
                UserStampDetail.guest_id == guest_id,
                UserStampDetail.prefecture_code == prefecture_code,
            )
            .order_by(UserStampDetail.visit_date.desc())
        )


        results = list(session.exec(query).all())


        visited_farms = [
            VisitedFarmInfo(
                farm_id=detail.farm_id,
                farm_name=farm.name,
                visit_date=detail.visit_date,
                experience_type=detail.experience_type,
                review_id=detail.review_id,
            )
            for detail, farm in results
        ]


        return PrefectureDetailResponse(
            prefecture_code=prefecture_code,
            name=prefecture.name,
            visit_count=collection.visit_count,
            first_visit_date=collection.first_visit_date,
            last_visit_date=collection.last_visit_date,
            unique_farms_count=collection.unique_farms_count,
            visited_farms=visited_farms,
        )


    @staticmethod
    def sync_stamp_from_review(session: Session, review_id: int) -> None:
        """レビュー投稿時にスタンプコレクションを同期（自動実行）"""


        # レビュー情報を取得
        result = session.exec(
            select(Review, Farm)
            .join(Farm, Review.farm_id == Farm.id)
            .where(Review.id == review_id)
        ).first()


        if not result:
            return


        review_obj, farm = result


        # 都道府県コードを取得
        prefecture_code = StampService._get_prefecture_code(farm.prefecture)
        if not prefecture_code:
            return


        # UserStampDetail を作成（重複チェック: review_id が unique）
        existing_detail = session.exec(
            select(UserStampDetail).where(UserStampDetail.review_id == review_id)
        ).first()


        if not existing_detail:
            detail = UserStampDetail(
                guest_id=review_obj.guest_id,
                prefecture_code=prefecture_code,
                farm_id=farm.id,
                review_id=review_id,
                visit_date=review_obj.experience_date,
                experience_type=farm.experience_type,
            )
            session.add(detail)


        # UserStampCollection を更新または作成
        collection = session.exec(
            select(UserStampCollection).where(
                UserStampCollection.guest_id == review_obj.guest_id,
                UserStampCollection.prefecture_code == prefecture_code,
            )
        ).first()


        if collection:
            # 既存レコードを更新
            collection.visit_count += 1
            collection.last_visit_date = max(
                collection.last_visit_date, review_obj.experience_date
            )
            collection.first_visit_date = min(
                collection.first_visit_date, review_obj.experience_date
            )


            # 訪問ファーム数を再計算
            unique_farms = session.exec(
                select(func.count(func.distinct(UserStampDetail.farm_id))).where(
                    UserStampDetail.guest_id == review_obj.guest_id,
                    UserStampDetail.prefecture_code == prefecture_code,
                )
            ).first()
            collection.unique_farms_count = unique_farms or 1


            collection.updated_at = datetime.utcnow()
        else:
            # 新規作成
            collection = UserStampCollection(
                guest_id=review_obj.guest_id,
                prefecture_code=prefecture_code,
                visit_count=1,
                first_visit_date=review_obj.experience_date,
                last_visit_date=review_obj.experience_date,
                unique_farms_count=1,
            )
            session.add(collection)


        session.commit()


    @staticmethod
    def get_ranking(
        session: Session, limit: int = 50, current_user_id: Optional[int] = None
    ) -> dict:
        """スタンプラリーランキングを取得"""
        from models import User


        # メインランキングクエリ
        ranking_query = (
            select(
                User.id.label("guest_id"),
                User.name.label("guest_name"),
                User.avatar_url,
                func.count(func.distinct(UserStampCollection.prefecture_code)).label(
                    "total_prefectures"
                ),
            )
            .join(UserStampCollection, User.id == UserStampCollection.guest_id)
            .group_by(User.id, User.name, User.avatar_url)
            .order_by(
                func.count(func.distinct(UserStampCollection.prefecture_code)).desc(),
                User.id.asc(),
            )
            .limit(limit)
        )


        results = list(session.exec(ranking_query).all())


        # ランキングエントリ生成
        rankings = []
        for rank, result in enumerate(results, start=1):
            completion_rate = round((result.total_prefectures / 47.0) * 100, 1)
            rankings.append(
                {
                    "rank": rank,
                    "guest_id": result.guest_id,
                    "guest_name": result.guest_name,
                    "avatar_url": result.avatar_url,
                    "total_prefectures": result.total_prefectures,
                    "completion_rate": completion_rate,
                }
            )


        # 自分の順位を取得（current_user_idが指定されている場合）
        my_ranking = None
        if current_user_id:
            for entry in rankings:
                if entry["guest_id"] == current_user_id:
                    my_ranking = entry
                    break


        # 総ユーザー数
        total_users_query = select(
            func.count(func.distinct(UserStampCollection.guest_id))
        )
        total_users = session.exec(total_users_query).first() or 0


        return {
            "rankings": rankings,
            "my_ranking": my_ranking,
            "total_users": total_users,
        }


    @staticmethod
    def _get_prefecture_code(prefecture_name: str) -> Optional[str]:
        """都道府県名からコードに変換（マッピングテーブル）"""
        prefecture_map = {
            "北海道": "01",
            "青森県": "02",
            "岩手県": "03",
            "宮城県": "04",
            "秋田県": "05",
            "山形県": "06",
            "福島県": "07",
            "茨城県": "08",
            "栃木県": "09",
            "群馬県": "10",
            "埼玉県": "11",
            "千葉県": "12",
            "東京都": "13",
            "神奈川県": "14",
            "新潟県": "15",
            "富山県": "16",
            "石川県": "17",
            "福井県": "18",
            "山梨県": "19",
            "長野県": "20",
            "岐阜県": "21",
            "静岡県": "22",
            "愛知県": "23",
            "三重県": "24",
            "滋賀県": "25",
            "京都府": "26",
            "大阪府": "27",
            "兵庫県": "28",
            "奈良県": "29",
            "和歌山県": "30",
            "鳥取県": "31",
            "島根県": "32",
            "岡山県": "33",
            "広島県": "34",
            "山口県": "35",
            "徳島県": "36",
            "香川県": "37",
            "愛媛県": "38",
            "高知県": "39",
            "福岡県": "40",
            "佐賀県": "41",
            "長崎県": "42",
            "熊本県": "43",
            "大分県": "44",
            "宮崎県": "45",
            "鹿児島県": "46",
            "沖縄県": "47",
        }
        return prefecture_map.get(prefecture_name)



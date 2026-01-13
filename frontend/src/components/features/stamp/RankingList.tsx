"use client";

import { useEffect, useState } from "react";
import { getRanking } from "@/lib/api/stamps";
import type { RankingResponse, RankingEntry } from "@/types/stamp";

interface RankingListProps {
  userId: string | null;
}

export function RankingList({ userId }: RankingListProps) {
  const [ranking, setRanking] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const data = await getRanking(50, userId || undefined);
        setRanking(data);
      } catch (error) {
        console.error("Error fetching ranking:", error);
        setError("ランキングの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-500 mb-4"></div>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error || !ranking) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "ランキングの取得に失敗しました"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 自分の順位（ハイライト表示） */}
      {ranking.my_ranking && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎖️</span>
            あなたの順位
          </h3>
          <RankingRow entry={ranking.my_ranking} highlight={true} />
        </div>
      )}

      {/* ランキングリスト */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <h2 className="text-2xl font-bold">全国ランキング</h2>
          <p className="text-green-100 mt-1">参加者数: {ranking.total_users}人</p>
        </div>

        <div className="divide-y">
          {ranking.rankings.map((entry) => (
            <RankingRow
              key={entry.guest_id}
              entry={entry}
              highlight={userId ? entry.guest_id === parseInt(userId) : false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RankingRowProps {
  entry: RankingEntry;
  highlight?: boolean;
}

function RankingRow({ entry, highlight }: RankingRowProps) {
  // トップ3のメダル
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const medal = getMedalIcon(entry.rank);

  return (
    <div
      className={`p-4 flex items-center gap-4 ${
        highlight ? "bg-green-50" : "hover:bg-gray-50"
      } transition-colors`}
    >
      {/* 順位 */}
      <div className="flex-shrink-0 w-16 text-center">
        {medal ? (
          <span className="text-3xl">{medal}</span>
        ) : (
          <span className="text-2xl font-bold text-gray-600">{entry.rank}</span>
        )}
      </div>

      {/* ユーザー情報 */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{entry.guest_name}</p>
      </div>

      {/* 統計情報 */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">
        <div className="text-right">
          <p className="text-sm text-gray-600">訪問都道府県</p>
          <p className="text-xl font-bold text-green-600">
            {entry.total_prefectures}
            <span className="text-sm text-gray-500">/47</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">達成率</p>
          <p className="text-xl font-bold text-green-600">
            {entry.completion_rate}%
          </p>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="hidden md:block w-32">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600"
            style={{ width: `${entry.completion_rate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

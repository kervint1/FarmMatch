"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPrefectureDetail } from "@/lib/api/stamps";
import type { PrefectureDetailResponse } from "@/types/stamp";

interface StampDetailModalProps {
  userId: string;
  prefectureCode: string;
  onClose: () => void;
}

export function StampDetailModal({
  userId,
  prefectureCode,
  onClose,
}: StampDetailModalProps) {
  const [detail, setDetail] = useState<PrefectureDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPrefectureDetail(userId, prefectureCode);
        setDetail(data);
      } catch (err) {
        console.error("Failed to fetch prefecture detail:", err);
        setError("詳細情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [userId, prefectureCode]);

  // モーダル外クリックで閉じる
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {detail?.name || "読み込み中..."}
              </h2>
              {detail && (
                <p className="text-green-100 text-sm mt-1">
                  訪問回数: {detail.visit_count}回 | ファーム数:{" "}
                  {detail.unique_farms_count}箇所
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {detail && (
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-green-100">初回訪問</p>
                <p className="font-bold">
                  {new Date(detail.first_visit_date).toLocaleDateString(
                    "ja-JP",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-green-100">最終訪問</p>
                <p className="font-bold">
                  {new Date(detail.last_visit_date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-500"></div>
              <p className="text-gray-600 mt-4">読み込み中...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {detail && !isLoading && !error && (
            <>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                訪問履歴 ({detail.visited_farms.length}件)
              </h3>

              {detail.visited_farms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  訪問履歴がありません
                </p>
              ) : (
                <div className="space-y-3">
                  {detail.visited_farms.map((farm) => (
                    <Link
                      key={farm.review_id}
                      href={`/farms/${farm.farm_id}`}
                      className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200 hover:border-green-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {farm.farm_name}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {new Date(farm.visit_date).toLocaleDateString(
                                "ja-JP"
                              )}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                              {farm.experience_type === "agriculture"
                                ? "農業体験"
                                : farm.experience_type === "livestock"
                                  ? "畜産体験"
                                  : farm.experience_type === "fishery"
                                    ? "漁業体験"
                                    : farm.experience_type}
                            </span>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHostReceivedReviews } from "@/lib/api/users";
import { getUserStampCollection } from "@/lib/api/stamps";
import { calculateUserTitles } from "@/lib/utils/titles";
import type { HostReceivedReviewsResponse } from "@/types/user";
import type { StampCollectionResponse } from "@/types/stamp";

interface UserProfileModalProps {
  userId: number;
  userName: string;
  userType: "host" | "guest";
  onClose: () => void;
}

export function UserProfileModal({
  userId,
  userName,
  userType,
  onClose,
}: UserProfileModalProps) {
  const [hostReviews, setHostReviews] = useState<HostReceivedReviewsResponse | null>(null);
  const [guestCollection, setGuestCollection] = useState<StampCollectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (userType === "host") {
          const data = await getHostReceivedReviews(userId.toString());
          setHostReviews(data);
        } else {
          const data = await getUserStampCollection(userId.toString());
          setGuestCollection(data);
        }
      } catch (err) {
        setError("プロフィール情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId, userType]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
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
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p className="text-green-100 text-sm mt-1">
                {userType === "host" ? "農家" : "ゲスト"}
              </p>
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
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-500 mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-12 text-red-600">{error}</div>
          )}

          {/* 農家：レビュー表示 */}
          {!isLoading && !error && userType === "host" && hostReviews && (
            <>
              <div className="mb-6 p-4 bg-green-50 rounded-lg grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gray-600 text-sm">総レビュー数</p>
                  <p className="text-2xl font-bold text-green-600">
                    {hostReviews.total_reviews}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">平均評価</p>
                  <p className="text-2xl font-bold text-green-600">
                    {hostReviews.average_rating}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                受け取ったレビュー
              </h3>
              {hostReviews.reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  まだレビューはありません
                </p>
              ) : (
                <div className="space-y-4">
                  {hostReviews.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.guest_name}
                          </p>
                          <Link
                            href={`/farms/${review.farm_id}`}
                            className="text-sm text-green-600 hover:underline"
                            onClick={onClose}
                          >
                            {review.farm_name}
                          </Link>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-500">
                            {"⭐".repeat(review.rating)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.experience_date).toLocaleDateString(
                              "ja-JP"
                            )}
                          </p>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ゲスト：称号表示 */}
          {!isLoading && !error && userType === "guest" && guestCollection && (
            <>
              <div className="mb-6 p-4 bg-green-50 rounded-lg grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-600 text-sm">訪問都道府県</p>
                  <p className="text-2xl font-bold text-green-600">
                    {guestCollection.summary.total_prefectures}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">訪問ファーム</p>
                  <p className="text-2xl font-bold text-green-600">
                    {guestCollection.summary.total_farms}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">総訪問回数</p>
                  <p className="text-2xl font-bold text-green-600">
                    {guestCollection.summary.total_visits}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">称号</h3>
              <div className="space-y-3">
                {calculateUserTitles(guestCollection.summary).map((title, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{title.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          {title.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {title.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/stamp-rally"
                  className="text-green-600 hover:text-green-700 font-medium"
                  onClick={onClose}
                >
                  スタンプコレクションを見る →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { ReviewList } from "@/components/features/review/ReviewList";
import { StarRatingDisplay } from "@/components/features/review/StarRatingDisplay";
import { getFarmsByHost } from "@/lib/api/farms";
import { getReviews } from "@/lib/api/reviews";

interface HostReviewsProps {
  userId: number;
}

interface ReviewWithDetails {
  id: string;
  guest_id: number;
  rating: number;
  comment?: string;
  experience_date: string;
  created_at: string;
  guest_name?: string;
  farm_name?: string;
}

export function HostReviews({ userId }: HostReviewsProps) {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // ホストの全ファームを取得
        const farms = await getFarmsByHost(userId.toString());

        if (!farms || farms.length === 0) {
          setReviews([]);
          setLoading(false);
          return;
        }

        // 各ファームのレビューを並列取得
        const reviewPromises = farms.map(async (farm: any) => {
          try {
            const farmReviews = await getReviews(
              undefined,
              undefined,
              farm.id.toString()
            );
            // ファーム名を各レビューに追加
            return (farmReviews || []).map((review: any) => ({
              ...review,
              farm_name: farm.name,
            }));
          } catch (err) {
            console.error(`Error fetching reviews for farm ${farm.id}:`, err);
            return [];
          }
        });

        const allReviewsArrays = await Promise.all(reviewPromises);
        const allReviews = allReviewsArrays.flat();

        // 作成日時でソート（新しい順）
        const sortedReviews = allReviews.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setReviews(sortedReviews);

        // 統計情報を計算
        if (sortedReviews.length > 0) {
          const totalRating = sortedReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          setStats({
            totalReviews: sortedReviews.length,
            averageRating: totalRating / sortedReviews.length,
          });
        } else {
          setStats({
            totalReviews: 0,
            averageRating: 0,
          });
        }
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
        setError("レビューの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* 統計サマリー */}
      {!loading && !error && stats.totalReviews > 0 && (
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              受け取ったレビュー
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">総レビュー数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalReviews}件
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">平均評価</p>
                <StarRatingDisplay
                  rating={stats.averageRating}
                  size="md"
                  showNumber={true}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* レビューリスト */}
      <ReviewList
        reviews={reviews}
        loading={loading}
        error={error || undefined}
        showFarmName={true}
      />
    </div>
  );
}

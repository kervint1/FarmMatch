"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { createReview } from "@/lib/api";

interface ReviewFormProps {
  reservationId: string;
  farmId: number;
  guestId: number;
  farmName: string;
  experienceDate: string;
  onSuccess?: () => void;
}

export function ReviewForm({
  reservationId,
  farmId,
  guestId,
  farmName,
  experienceDate,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("評価を選択してください");
      return;
    }

    try {
      setSubmitting(true);

      await createReview({
        reservation_id: reservationId,
        farm_id: farmId,
        guest_id: guestId,
        rating,
        comment: comment.trim() || undefined,
        experience_date: experienceDate,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/mypage");
      }
    } catch (err: any) {
      console.error("Error creating review:", err);
      if (
        err.message?.includes("unique") ||
        err.message?.includes("already exists")
      ) {
        setError("この予約は既にレビュー済みです");
      } else {
        setError(err.message || "レビューの投稿に失敗しました");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-6">レビューを投稿</CardTitle>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">ファーム</p>
          <p className="font-semibold text-gray-900">{farmName}</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              評価
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              コメント（オプション）
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="体験の感想をお聞かせください"
              rows={6}
              disabled={submitting}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={submitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || rating === 0}
            >
              {submitting ? "投稿中..." : "レビューを投稿"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

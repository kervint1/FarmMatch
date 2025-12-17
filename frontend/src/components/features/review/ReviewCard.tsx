import { Card, CardBody } from "@/components/ui/card";
import { StarRatingDisplay } from "./StarRatingDisplay";

interface ReviewCardProps {
  review: {
    id: string;
    guest_id: number;
    rating: number;
    comment?: string;
    experience_date: string;
    created_at: string;
  };
  guestName?: string;
  farmName?: string;
  showFarmName?: boolean;
}

export function ReviewCard({
  review,
  guestName,
  farmName,
  showFarmName = false,
}: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardBody>
        <div className="space-y-3">
          {/* ヘッダー: ゲスト名、星評価、投稿日 */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-900 font-semibold">
                  {guestName || "ゲスト"}さん
                </span>
                <StarRatingDisplay rating={review.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(review.created_at)}投稿
              </p>
            </div>
          </div>

          {/* コメント */}
          {review.comment && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">
                {review.comment}
              </p>
            </div>
          )}

          {/* フッター: 体験日、ファーム名 */}
          <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>体験日: {formatDate(review.experience_date)}</span>
            </div>
            {showFarmName && farmName && (
              <div className="flex items-center gap-1">
                <span>🏡</span>
                <span>{farmName}</span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

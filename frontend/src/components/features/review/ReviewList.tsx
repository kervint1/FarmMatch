import { Card, CardBody } from "@/components/ui/card";
import { ReviewCard } from "./ReviewCard";

interface Review {
  id: string;
  guest_id: number;
  rating: number;
  comment?: string;
  experience_date: string;
  created_at: string;
}

interface ReviewWithDetails extends Review {
  guest_name?: string;
  farm_name?: string;
}

interface ReviewListProps {
  reviews: ReviewWithDetails[];
  loading?: boolean;
  error?: string;
  showFarmName?: boolean;
}

export function ReviewList({
  reviews,
  loading = false,
  error,
  showFarmName = false,
}: ReviewListProps) {
  // ローディング状態
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardBody>
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
        </CardBody>
      </Card>
    );
  }

  // 空状態
  if (reviews.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-gray-600">まだレビューがありません</p>
        </CardBody>
      </Card>
    );
  }

  // レビュー表示
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          guestName={review.guest_name}
          farmName={review.farm_name}
          showFarmName={showFarmName}
        />
      ))}
    </div>
  );
}

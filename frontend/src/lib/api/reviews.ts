import { apiCall } from "@/lib/utils/api-client";

export async function getReviews(
  skip?: number,
  limit?: number,
  farmId?: string,
  guestId?: string
) {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());

  const queryString = params.toString();
  let endpoint: string;

  // ファームIDがある場合は farm specific endpoint を使用
  if (farmId) {
    endpoint = `/api/farms/${farmId}/reviews${queryString ? `?${queryString}` : ""}`;
  } else if (guestId) {
    // ゲスト別は後で実装（今はサポートされていない）
    endpoint = `/api/reviews${queryString ? `?${queryString}` : ""}`;
  } else {
    endpoint = `/api/reviews${queryString ? `?${queryString}` : ""}`;
  }

  return apiCall<any[]>(endpoint);
}

export async function createReview(data: {
  reservation_id: string;
  farm_id: number;
  guest_id: number;
  rating: number;
  comment?: string;
  experience_date: string;
}) {
  return apiCall<any>(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

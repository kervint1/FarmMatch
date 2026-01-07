export interface ReceivedReviewInfo {
  id: number;
  guest_id: number;
  guest_name: string;
  rating: number;
  comment: string | null;
  experience_date: string;
  farm_id: number;
  farm_name: string;
  created_at: string;
}

export interface HostReceivedReviewsResponse {
  host_id: number;
  host_name: string;
  total_reviews: number;
  average_rating: number;
  reviews: ReceivedReviewInfo[];
}

export interface UserTitle {
  title: string;
  description: string;
  icon: string;
}

import { apiCall } from "@/lib/utils/api-client";
import type {
  PrefectureStamp,
  StampCollectionResponse,
  PrefectureDetailResponse,
} from "@/types/stamp";

/**
 * Get all prefecture master data
 */
export async function getAllPrefectures() {
  return apiCall<PrefectureStamp[]>(`/api/stamps/prefectures`);
}

/**
 * Get user's stamp collection (all 47 prefectures with visit status)
 */
export async function getUserStampCollection(userId: string) {
  return apiCall<StampCollectionResponse>(
    `/api/stamps/users/${userId}/collection`
  );
}

/**
 * Get detailed information for a specific prefecture
 */
export async function getPrefectureDetail(
  userId: string,
  prefectureCode: string
) {
  return apiCall<PrefectureDetailResponse>(
    `/api/stamps/users/${userId}/collection/${prefectureCode}`
  );
}

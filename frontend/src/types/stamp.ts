/**
 * Stamp Rally Type Definitions
 */

export interface PrefectureStamp {
  prefecture_code: string;
  name: string;
  name_romaji: string;
  image_url: string;
  region: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface StampCollectionSummary {
  total_prefectures: number; // 訪問都道府県数
  total_visits: number; // 総訪問回数
  total_farms: number; // 訪問ファーム数
  completion_rate: number; // 達成率 (0-100)
}

export interface PrefectureStampStatus {
  prefecture_code: string;
  name: string;
  image_url: string;
  region: string;
  is_visited: boolean;
  visit_count: number;
  first_visit_date: string | null;
  last_visit_date: string | null;
  unique_farms_count: number;
}

export interface StampCollectionResponse {
  summary: StampCollectionSummary;
  stamps: PrefectureStampStatus[];
}

export interface VisitedFarmInfo {
  farm_id: number;
  farm_name: string;
  visit_date: string;
  experience_type: string;
  review_id: number;
}

export interface PrefectureDetailResponse {
  prefecture_code: string;
  name: string;
  visit_count: number;
  first_visit_date: string;
  last_visit_date: string;
  unique_farms_count: number;
  visited_farms: VisitedFarmInfo[];
}

// 地方区分マッピング
export const REGION_NAMES: Record<string, string> = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "関東",
  chubu: "中部",
  kinki: "近畿",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州・沖縄",
};

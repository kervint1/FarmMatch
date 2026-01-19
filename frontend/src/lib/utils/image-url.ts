const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// デフォルトの農場画像
const DEFAULT_FARM_IMAGE = "/uploads/farm_images/farm1_main.jpg";

// 画像読み込み失敗時のフォールバック画像（絶対URL）
export const FALLBACK_FARM_IMAGE = `${API_URL}${DEFAULT_FARM_IMAGE}`;

/**
 * Convert relative image URL to absolute URL pointing to backend
 * @param imageUrl - Image URL from API (e.g., "/uploads/farm_images/xxx.png")
 * @returns Absolute URL (e.g., "http://localhost:8000/uploads/farm_images/xxx.png")
 */
export function getImageUrl(imageUrl: string | null | undefined): string {
  // If no image provided, use default
  if (!imageUrl) {
    return `${API_URL}${DEFAULT_FARM_IMAGE}`;
  }

  // If already absolute URL, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Convert relative URL to absolute
  return `${API_URL}${imageUrl}`;
}

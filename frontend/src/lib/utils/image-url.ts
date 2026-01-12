const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Convert relative image URL to absolute URL pointing to backend
 * @param imageUrl - Image URL from API (e.g., "/uploads/farm_images/xxx.png")
 * @returns Absolute URL (e.g., "http://localhost:8000/uploads/farm_images/xxx.png")
 */
export function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;

  // If already absolute URL, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Convert relative URL to absolute
  return `${API_URL}${imageUrl}`;
}

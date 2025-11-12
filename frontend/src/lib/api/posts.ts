import { apiCall } from "@/lib/utils/api-client";

export async function getPosts(skip?: number, limit?: number, farmId?: string) {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());
  if (farmId) params.append("farm_id", farmId);

  const queryString = params.toString();
  const endpoint = `/api/posts${queryString ? `?${queryString}` : ""}`;

  return apiCall<any[]>(endpoint);
}

export async function createPost(data: {
  user_id: string;
  title: string;
  content: string;
  farm_id?: string;
}) {
  return apiCall<any>(`/api/posts`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

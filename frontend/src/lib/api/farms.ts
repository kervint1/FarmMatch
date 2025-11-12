import { apiCall } from "@/lib/utils/api-client";

export async function getFarms(
  skip?: number,
  limit?: number,
  location?: string,
  type?: string
) {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());
  if (location) params.append("prefecture", location);
  if (type) params.append("experience_type", type);

  const queryString = params.toString();
  const endpoint = `/api/farms${queryString ? `?${queryString}` : ""}`;

  return apiCall<any[]>(endpoint);
}

export async function getFarm(id: string) {
  return apiCall<any>(`/api/farms/${id}`);
}

export async function getFarmsByHost(hostId: string) {
  return apiCall<any[]>(`/api/farms/host/${hostId}`);
}

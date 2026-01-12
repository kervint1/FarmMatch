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

export async function createFarm(data: {
  host_id: number;
  name: string;
  description: string;
  prefecture: string;
  city: string;
  address: string;
  experience_type: string;
  price_per_day: number;
  price_per_night?: number;
  max_guests: number;
  latitude?: number;
  longitude?: number;
  facilities?: Record<string, any>;
  access_info?: string;
}) {
  return apiCall<any>(`/api/farms`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadFarmImage(
  farmId: string | number,
  file: File,
  isMain: boolean = false
) {
  const formData = new FormData();
  formData.append("file", file);

  const params = new URLSearchParams();
  if (isMain) params.append("is_main", "true");

  const queryString = params.toString();
  const endpoint = `/api/farms/${farmId}/images${queryString ? `?${queryString}` : ""}`;

  return apiCall<any>(endpoint, {
    method: "POST",
    body: formData,
  });
}

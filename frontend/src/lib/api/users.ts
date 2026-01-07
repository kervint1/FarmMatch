import { apiCall } from "@/lib/utils/api-client";
import type { HostReceivedReviewsResponse } from "@/types/user";

export async function createUser(data: {
  google_id: string;
  email: string;
  name: string;
  user_type: "guest" | "host";
}) {
  return apiCall<any>(`/api/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getUser(id: string) {
  return apiCall<any>(`/api/users/${id}`);
}

export async function getUserByEmail(email: string) {
  return apiCall<any>(`/api/users/email/${email}`);
}

export async function updateUser(id: string, data: Record<string, any>) {
  return apiCall<any>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function uploadUserAvatar(userId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiCall<any>(`/api/users/${userId}/avatar`, {
    method: "POST",
    body: formData,
    headers: {}, // Let browser set Content-Type for FormData
  });
}

export async function getHostReceivedReviews(userId: string) {
  return apiCall<HostReceivedReviewsResponse>(`/api/users/${userId}/reviews/received`);
}

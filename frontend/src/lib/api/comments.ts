import { apiCall } from "@/lib/utils/api-client";

export async function getComments(postId: string) {
  return apiCall<any[]>(`/api/posts/${postId}/comments`);
}

export async function createComment(data: {
  post_id: string;
  user_id: string;
  content: string;
}) {
  return apiCall<any>(`/api/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

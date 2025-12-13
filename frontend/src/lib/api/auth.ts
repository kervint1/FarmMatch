import { apiCall } from "@/lib/utils/api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
}

/**
 * バックエンドからJWTトークンを取得
 *
 * @param googleId GoogleユーザーID
 * @returns JWTトークンとユーザーID
 */
export async function loginWithGoogleId(googleId: string): Promise<LoginResponse> {
  // この関数はapiCallを使わず直接fetchを使用（トークンが必要ないため）
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      google_id: googleId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return response.json();
}

/**
 * 現在のユーザー情報を取得（JWT認証が必要）
 */
export async function getCurrentUser() {
  return apiCall<any>("/auth/me", {
    method: "GET",
  });
}

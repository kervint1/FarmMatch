const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {};

  // bodyがFormDataの場合はContent-Typeを設定しない（ブラウザが自動設定）
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  // JWTトークンをlocalStorageから取得してAuthorizationヘッダーに追加
  const token = localStorage.getItem("farmMatch_jwt");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const error = await response.json();
      // FastAPIのバリデーションエラーはdetailフィールドに配列またはオブジェクトが入る
      if (error.detail) {
        if (Array.isArray(error.detail)) {
          errorMessage = error.detail
            .map((e: any) => `${e.loc?.join(".")}: ${e.msg}`)
            .join("; ");
        } else if (typeof error.detail === "string") {
          errorMessage = error.detail;
        }
      }
    } catch (e) {
      // JSON解析失敗時は無視
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

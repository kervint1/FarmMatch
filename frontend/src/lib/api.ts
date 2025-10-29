const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

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

// Farms API
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

// Users API
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

export async function updateUser(
  id: string,
  data: Record<string, any>
) {
  return apiCall<any>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Reservations API
export async function getReservations(
  skip?: number,
  limit?: number,
  guestId?: string,
  farmId?: string,
  status?: string
) {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());
  if (guestId) params.append("guest_id", guestId);
  if (farmId) params.append("farm_id", farmId);
  if (status) params.append("status", status);

  const queryString = params.toString();
  const endpoint = `/api/reservations${queryString ? `?${queryString}` : ""}`;

  return apiCall<any[]>(endpoint);
}

export async function createReservation(data: {
  farm_id: string | number;
  guest_id: string | number;
  start_date: string;
  end_date: string;
  num_guests: number;
  total_amount: number;
  contact_phone: string;
  message?: string;
}) {
  const payload = {
    farm_id: parseInt(String(data.farm_id)),
    guest_id: parseInt(String(data.guest_id)),
    start_date: data.start_date,
    end_date: data.end_date,
    num_guests: parseInt(String(data.num_guests)),
    total_amount: Math.floor(parseFloat(String(data.total_amount))),
    contact_phone: data.contact_phone,
    message: data.message || null,
  };

  console.log("Creating reservation with payload:", payload);

  return apiCall<any>(`/api/reservations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateReservation(
  id: string,
  data: Record<string, any>
) {
  return apiCall<any>(`/api/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function cancelReservation(id: string) {
  return apiCall<any>(`/api/reservations/${id}/cancel`, {
    method: "POST",
  });
}

// Reviews API
export async function getReviews(
  skip?: number,
  limit?: number,
  farmId?: string,
  guestId?: string
) {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());

  const queryString = params.toString();
  let endpoint: string;

  // ファームIDがある場合は farm specific endpoint を使用
  if (farmId) {
    endpoint = `/api/farms/${farmId}/reviews${queryString ? `?${queryString}` : ""}`;
  } else if (guestId) {
    // ゲスト別は後で実装（今はサポートされていない）
    endpoint = `/api/reviews${queryString ? `?${queryString}` : ""}`;
  } else {
    endpoint = `/api/reviews${queryString ? `?${queryString}` : ""}`;
  }

  return apiCall<any[]>(endpoint);
}

export async function createReview(data: {
  reservation_id: string;
  rating: number;
  comment?: string;
}) {
  return apiCall<any>(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Posts API
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

// Comments API
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ファーム関連のAPI
export interface Farm {
  id: number;
  name: string;
  location: string;
  prefecture: string;
  description: string;
  experience_type: string;
  price_per_person: number;
  max_participants: number;
  available_from: string;
  available_to: string;
  main_image_url?: string;
  rating?: number;
  review_count?: number;
  owner_id: number;
}

export interface FarmSearchParams {
  skip?: number;
  limit?: number;
  prefecture?: string;
  experience_type?: string;
  min_price?: number;
  max_price?: number;
}

// ファーム一覧を取得
export async function getFarms(
  skip: number = 0,
  limit: number = 10,
  params?: FarmSearchParams
): Promise<Farm[]> {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });

  if (params?.prefecture) {
    queryParams.append("prefecture", params.prefecture);
  }
  if (params?.experience_type) {
    queryParams.append("experience_type", params.experience_type);
  }
  if (params?.min_price) {
    queryParams.append("min_price", params.min_price.toString());
  }
  if (params?.max_price) {
    queryParams.append("max_price", params.max_price.toString());
  }

  const response = await fetch(`${API_BASE_URL}/api/farms?${queryParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch farms");
  }

  return response.json();
}

// ファーム詳細を取得
export async function getFarm(farmId: number): Promise<Farm> {
  const response = await fetch(`${API_BASE_URL}/api/farms/${farmId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch farm");
  }

  return response.json();
}

// 予約関連のAPI
export interface Reservation {
  id: number;
  farm_id: number;
  user_id: number;
  reservation_date: string;
  number_of_people: number;
  status: string;
  total_price: number;
  created_at: string;
}

export interface CreateReservationData {
  farm_id: number;
  reservation_date: string;
  number_of_people: number;
}

// 予約を作成
export async function createReservation(
  data: CreateReservationData,
  token: string
): Promise<Reservation> {
  const response = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create reservation");
  }

  return response.json();
}

// ユーザーの予約一覧を取得
export async function getUserReservations(token: string): Promise<Reservation[]> {
  const response = await fetch(`${API_BASE_URL}/api/reservations/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }

  return response.json();
}

// レビュー関連のAPI
export interface Review {
  id: number;
  farm_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CreateReviewData {
  farm_id: number;
  rating: number;
  comment: string;
}

// レビューを作成
export async function createReview(data: CreateReviewData, token: string): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create review");
  }

  return response.json();
}

// ファームのレビュー一覧を取得
export async function getFarmReviews(farmId: number): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/api/farms/${farmId}/reviews`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}

// ユーザー関連のAPI
export interface User {
  id: number;
  email: string;
  name: string;
  user_type: string;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  user_type: string;
}

// ログイン
export async function login(data: LoginData): Promise<{ access_token: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json();
}

// サインアップ
export async function signup(data: SignupData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to signup");
  }

  return response.json();
}

// 現在のユーザー情報を取得
export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

// 投稿関連のAPI
export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  farm_id?: number;
}

export interface CreatePostData {
  user_id: number;
  title: string;
  content: string;
  farm_id?: number;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentData {
  post_id: number;
  user_id: number;
  content: string;
}

// 投稿一覧を取得
export async function getPosts(
  skip: number = 0,
  limit: number = 50,
  userId?: number
): Promise<Post[]> {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });

  if (userId) {
    queryParams.append("user_id", userId.toString());
  }

  const response = await fetch(`${API_BASE_URL}/api/posts?${queryParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

// 投稿詳細を取得
export async function getPost(postId: number): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
}

// 投稿を作成
export async function createPost(data: CreatePostData): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
}

// 投稿にいいねする
export async function likePost(postId: number): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to like post");
  }

  return response.json();
}

// 投稿のコメント一覧を取得
export async function getPostComments(
  postId: number,
  skip: number = 0,
  limit: number = 100
): Promise<Comment[]> {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments?${queryParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

// コメントを作成
export async function createComment(data: CreateCommentData): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${data.post_id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}

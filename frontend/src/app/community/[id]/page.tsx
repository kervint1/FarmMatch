"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { UserProfileModal } from "@/components/features/community/UserProfileModal";
import { getUserByEmail } from "@/lib/api";

interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_type?: string;
  farm_id?: number;
  farm_name?: string;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user_name?: string;
  user_type?: string;
}

export default function PostDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    type: "host" | "guest";
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  // ユーザーID取得
  useEffect(() => {
    const fetchUserId = async () => {
      if (!session?.user) return;

      // LocalStorageから取得を試みる
      let currentUserId: string | null = localStorage.getItem("farmMatch_userId");

      if (!currentUserId && session.user.email) {
        try {
          const user = await getUserByEmail(session.user.email);
          currentUserId = user.id.toString();
          localStorage.setItem("farmMatch_userId", currentUserId);
        } catch (error) {
          console.error("Error fetching user by email:", error);
        }
      }

      setUserId(currentUserId);
    };

    fetchUserId();
  }, [session]);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/posts/${postId}`
      );
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else if (response.status === 404) {
        router.push("/community");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/posts/${postId}/comments`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/posts/${postId}/like`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        fetchPost();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !userId || !newComment.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment,
            user_id: parseInt(userId),
            post_id: parseInt(postId),
          }),
        }
      );

      if (response.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="py-8 bg-gray-50">
        <Container size="md">
          <div className="text-center py-12">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="py-8 bg-gray-50">
      <Container size="md">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Link
            href="/community"
            className="text-green-600 hover:text-green-700 flex items-center gap-2"
          >
            ← コミュニティに戻る
          </Link>
        </div>

        {/* 投稿詳細 */}
        <Card className="mb-6">
          <CardBody>
            {/* 投稿ヘッダー */}
            <div className="flex items-start gap-4 mb-6">
              <button
                onClick={() =>
                  setSelectedUser({
                    id: post.user_id,
                    name: post.user_name || `ユーザー${post.user_id}`,
                    type: (post.user_type === "host" ? "host" : "guest") as "host" | "guest",
                  })
                }
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-green-200 transition-colors cursor-pointer"
              >
                <span className="text-green-600 font-semibold text-2xl">
                  {post.user_name?.[0] || "U"}
                </span>
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {post.user_name || `ユーザー${post.user_id}`}
                </h3>
                <p className="text-gray-500 text-sm">{formatDate(post.created_at)}</p>
                {post.farm_name && (
                  <Link
                    href={`/farms/${post.farm_id}`}
                    className="text-sm text-green-600 hover:underline mt-1 inline-block"
                  >
                    📍 {post.farm_name}
                  </Link>
                )}
              </div>
            </div>

            {/* 投稿内容 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* アクション */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <span className="text-2xl">❤️</span>
                <span className="font-medium">{post.like_count}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">💬</span>
                <span className="font-medium">{comments.length}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* コメント投稿フォーム */}
        {session ? (
          <Card className="mb-6">
            <CardBody>
              <form onSubmit={handleSubmitComment}>
                <div className="mb-4 text-black">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="コメントを入力..."
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    コメントする
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardBody className="text-center py-6">
              <p className="text-gray-600 mb-4">コメントするにはログインが必要です</p>
              <div className="flex gap-3 justify-center">
                <Link href="/login">
                  <Button variant="outline">ログイン</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary">無料登録</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        )}

        {/* コメント一覧 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">コメント ({comments.length})</h2>

          {comments.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8">
                <p className="text-gray-600">まだコメントがありません</p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() =>
                          setSelectedUser({
                            id: comment.user_id,
                            name: comment.user_name || `ユーザー${comment.user_id}`,
                            type: (comment.user_type === "host" ? "host" : "guest") as
                              | "host"
                              | "guest",
                          })
                        }
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <span className="text-gray-600 font-semibold">
                          {comment.user_name?.[0] || "U"}
                        </span>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {comment.user_name || `ユーザー${comment.user_id}`}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ユーザープロフィールモーダル */}
        {selectedUser && (
          <UserProfileModal
            userId={selectedUser.id}
            userName={selectedUser.name}
            userType={selectedUser.type}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </Container>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  user_name?: string;
  user_type?: string;
  farm_id?: number;
  farm_name?: string;
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    type: "host" | "guest";
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const fetchPosts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/posts?limit=50`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !userId) {
      return;
    }

    const postData = {
      ...newPost,
      user_id: parseInt(userId),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setNewPost({ title: "", content: "" });
        setShowCreateModal(false);
        fetchPosts();
      } else {
        console.error("Failed to create post:", response.status);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    return "たった今";
  };

  return (
    <div className="py-8 bg-gray-50">
      <Container size="md">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">コミュニティ</h1>
              <p className="text-gray-600 mt-2">農業体験の感想や情報を共有しましょう</p>
            </div>
            {session && (
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                投稿する
              </Button>
            )}
          </div>
        </div>

        {/* 投稿作成モーダル */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">新規投稿</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreatePost}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="投稿のタイトルを入力"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="体験の感想や気づきを共有してください"
                      rows={6}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    fullWidth
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" variant="primary" fullWidth>
                    投稿する
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 投稿一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600 mb-4">まだ投稿がありません</p>
              {session && (
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  最初の投稿をする
                </Button>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} hoverable>
                <CardBody>
                  {/* 投稿ヘッダー */}
                  <div className="flex items-start gap-4 mb-4">
                    <button
                      onClick={() =>
                        setSelectedUser({
                          id: post.user_id,
                          name: post.user_name || `ユーザー${post.user_id}`,
                          type: (post.user_type === "host" ? "host" : "guest") as "host" | "guest",
                        })
                      }
                      className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-green-200 transition-colors cursor-pointer"
                    >
                      <span className="text-green-600 font-semibold text-lg">
                        {post.user_name?.[0] || "U"}
                      </span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {post.user_name || `ユーザー${post.user_id}`}
                        </h3>
                        <span className="text-gray-400 text-sm">{formatDate(post.created_at)}</span>
                      </div>
                      {post.farm_name && (
                        <Link
                          href={`/farms/${post.farm_id}`}
                          className="text-sm text-green-600 hover:underline"
                        >
                          📍 {post.farm_name}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* 投稿内容 */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* アクション */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <span className="text-xl">❤️</span>
                      <span className="text-sm font-medium">{post.like_count}</span>
                    </button>
                    <Link
                      href={`/community/${post.id}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <span className="text-xl">💬</span>
                      <span className="text-sm font-medium">コメント</span>
                    </Link>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/community/${post.id}`
                        );
                        alert("リンクをコピーしました！");
                      }}
                      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors ml-auto"
                    >
                      <span className="text-xl">🔗</span>
                      <span className="text-sm font-medium">共有</span>
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* ログインしていない場合のメッセージ */}
        {!session && !loading && posts.length > 0 && (
          <Card className="mt-8">
            <CardBody className="text-center py-8">
              <p className="text-gray-700 mb-4">投稿やコメントをするにはログインが必要です</p>
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

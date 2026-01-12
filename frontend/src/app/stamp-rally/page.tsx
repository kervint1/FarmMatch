
"use client";


import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StampProgress } from "@/components/features/stamp/StampProgress";
import { StampGrid } from "@/components/features/stamp/StampGrid";
import { RankingList } from "@/components/features/stamp/RankingList";
import { getUserByEmail } from "@/lib/api";
import { getUserStampCollection } from "@/lib/api/stamps";
import type { StampCollectionResponse } from "@/types/stamp";


export default function StampRallyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [collection, setCollection] = useState<StampCollectionResponse | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stamps" | "ranking">("stamps");


  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }


      try {
        setLoading(true);
        setError(null);


        // Get user ID from localStorage or email
        let currentUserId: string | null =
          localStorage.getItem("farmMatch_userId");


        if (!currentUserId && session.user.email) {
          try {
            const user = await getUserByEmail(session.user.email);
            currentUserId = user.id.toString();
            localStorage.setItem("farmMatch_userId", currentUserId);
          } catch (error) {
            console.error("Error fetching user by email:", error);
            setError("ユーザー情報の取得に失敗しました");
            return;
          }
        }


        if (!currentUserId) {
          setError("ユーザーIDを取得できませんでした");
          return;
        }


        setUserId(currentUserId);


        // Fetch stamp collection
        const data = await getUserStampCollection(currentUserId);
        setCollection(data);
      } catch (error) {
        console.error("Error fetching stamp collection:", error);
        setError("スタンプコレクションの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [session]);


  // Not logged in
  if (!session && !loading) {
    return (
      <div className="bg-white">
        <Container size="md" className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🗾</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ログインが必要です
            </h1>
            <p className="text-gray-600 mb-6">
              スタンプラリーを表示するにはログインしてください
            </p>
            <Link href="/login">
              <Button variant="primary" size="lg">
                ログイン
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }


  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50">
        <Container size="lg" className="py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-green-500 mb-4"></div>
            <p className="text-gray-600 text-lg">読み込み中...</p>
          </div>
        </Container>
      </div>
    );
  }


  // Error state
  if (error) {
    return (
      <div className="bg-gray-50">
        <Container size="lg" className="py-8">
          <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              エラーが発生しました
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              再読み込み
            </Button>
          </div>
        </Container>
      </div>
    );
  }


  // Main content
  return (
    <div className="bg-gray-50 min-h-screen">
      <Container size="lg" className="py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">🗾</div>
            <h1 className="text-3xl font-bold text-gray-900">
              全国ファームスタンプラリー
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            全国のファームを訪問してスタンプを集めよう！レビューを投稿すると自動的にスタンプが獲得できます。
          </p>
        </div>


        {collection && (
          <>
            {/* タブナビゲーション */}
            <nav className="flex space-x-8 border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab("stamps")}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "stamps"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                マイスタンプ
              </button>
              <button
                onClick={() => setActiveTab("ranking")}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "ranking"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                ランキング
              </button>
            </nav>


            {/* タブコンテンツ */}
            {activeTab === "stamps" ? (
              <>
                {/* 進捗表示 */}
                <div className="mb-8">
                  <StampProgress summary={collection.summary} />
                </div>


                {/* スタンプ一覧 */}
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      スタンプコレクション
                    </h2>
                    <p className="text-gray-600">
                      訪問済みの都道府県はカラーで表示されます。クリックすると詳細が確認できます。
                    </p>
                  </div>


                  {userId && (
                    <StampGrid stamps={collection.stamps} userId={userId} />
                  )}
                </div>
              </>
            ) : (
              <RankingList userId={userId} />
            )}


            {/* ヘルプセクション */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                スタンプの獲得方法
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>ファームを予約して訪問</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>
                    体験後にレビューを投稿（体験日を正しく入力してください）
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>
                    自動的にその都道府県のスタンプが獲得されます
                  </span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-green-200">
                <Link href="/search">
                  <Button variant="primary" className="w-full sm:w-auto">
                    ファームを探す
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}



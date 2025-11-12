"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { ReservationList } from "@/components/features/reservation/ReservationList";
import { getUser, getUserByEmail } from "@/lib/api";

export default function MyPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);

        // localStorageまたはメールアドレスでユーザーIDを取得
        let currentUserId: string | null = localStorage.getItem("farmMatch_userId");

        if (!currentUserId && session.user.email) {
          try {
            const user = await getUserByEmail(session.user.email);
            currentUserId = user.id.toString();
            localStorage.setItem("farmMatch_userId", currentUserId);
          } catch (error) {
            console.error("Error fetching user by email:", error);
            return;
          }
        }

        if (!currentUserId) {
          console.error("Could not determine user ID");
          return;
        }

        setUserId(currentUserId);
        const userData = await getUser(currentUserId);
        setUserProfile(userData);

        // TODO: ユーザーのレビュー取得エンドポイントが実装されたら有効化
        // const reviewsData = await getReviews(0, 100, undefined, userId);
        // setMyReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user]);

  if (!session) {
    return (
      <div className="bg-white">
        <Container size="md" className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ログインが必要です
            </h1>
            <p className="text-gray-600 mb-6">
              マイページを表示するにはログインしてください
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

  return (
    <div className="bg-gray-50">
      <Container size="lg" className="py-8">
        {/* プロフィールセクション */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : userProfile ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <img
                  src={userProfile.image || session?.user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"}
                  alt={userProfile.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userProfile.name}
                  </h1>
                  <p className="text-gray-600 mb-1">{userProfile.email}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    ユーザータイプ：{userProfile.user_type === "host" ? "ホスト（農家）" : "ゲスト（体験者）"}
                  </p>
                </div>
              </div>
              <Link href="/mypage/edit">
                <Button variant="secondary">プロフィール編集</Button>
              </Link>
            </div>
          </div>
        ) : null}

        {/* タブ */}
        <div className="bg-white border-b border-gray-200 mb-8 rounded-t-lg">
          <div className="flex overflow-x-auto">
            {[
              { key: "profile", label: "予約管理" },
              { key: "reviews", label: "レビュー" },
              { key: "wishlist", label: "ウィッシュリスト" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 font-medium transition border-b-2 ${
                  activeTab === tab.key
                    ? "text-green-600 border-green-600"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 予約管理タブ */}
        {activeTab === "profile" && (
          userId ? (
            <ReservationList userId={userId} />
          ) : (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-gray-600 mb-4">予約情報を読み込み中...</p>
              </CardBody>
            </Card>
          )
        )}

        {/* レビュータブ */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {myReviews.length > 0 ? (
              myReviews.map((review: any) => (
                <Card key={review.id}>
                  <CardBody>
                    <div className="flex items-start justify-between mb-3">
                      <CardTitle>{review.reservation?.farm?.name || "ファーム"}</CardTitle>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-gray-600">レビューはまだありません</p>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* ウィッシュリストタブ */}
        {activeTab === "wishlist" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist.length > 0 ? (
              wishlist.map((farm) => (
                <Link key={farm.id} href={`/farms/${farm.id}`}>
                  <Card hoverable>
                    <img
                      src={farm.image}
                      alt={farm.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <CardBody>
                      <CardTitle>{farm.name}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3">
                        {farm.location}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ¥{farm.price.toLocaleString()}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    ウィッシュリストは空です
                  </p>
                  <Link href="/search">
                    <Button variant="primary">ファームを探す</Button>
                  </Link>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

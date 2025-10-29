"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUser, getReservations, getReviews, getUserByEmail, cancelReservation } from "@/lib/api";

export default function MyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);

        // localStorageまたはメールアドレスでユーザーIDを取得
        let userId: string | null = localStorage.getItem("farmMatch_userId");

        if (!userId && session.user.email) {
          try {
            const user = await getUserByEmail(session.user.email);
            userId = user.id.toString();
            localStorage.setItem("farmMatch_userId", userId);
          } catch (error) {
            console.error("Error fetching user by email:", error);
            return;
          }
        }

        if (!userId) {
          console.error("Could not determine user ID");
          return;
        }

        const userData = await getUser(userId);
        setUserProfile(userData);

        const reservationsData = await getReservations(0, 100, userId);
        setReservations(reservationsData);

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "確定";
      case "pending":
        return "確認待ち";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm("この予約をキャンセルしてもよろしいですか？")) {
      return;
    }

    try {
      setCanceling(reservationId.toString());
      setCancelError(null);
      await cancelReservation(reservationId.toString());
      // キャンセル成功後、予約一覧を更新
      setReservations(
        reservations.map((res) =>
          res.id === reservationId ? { ...res, status: "cancelled" } : res
        )
      );
    } catch (error: any) {
      console.error("Error canceling reservation:", error);
      setCancelError(error.message || "キャンセルに失敗しました");
    } finally {
      setCanceling(null);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Container size="md" className="flex-1 flex items-center justify-center py-20">
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <Container size="lg" className="py-8 flex-1">
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
          <div className="space-y-6">
            {cancelError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {cancelError}
              </div>
            )}
            {reservations.length > 0 ? (
              reservations.map((reservation: any) => (
                <Card key={reservation.id}>
                  <CardBody>
                    <div className="flex gap-6">
                      <img
                        src={reservation.farm?.main_image_url || "http://localhost:8000/uploads/farm_images/farm1_main.jpg"}
                        alt={reservation.farm?.name}
                        className="w-32 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {reservation.farm?.name}
                          </h3>
                          <Badge
                            variant={getStatusColor(
                              reservation.status
                            ) as any}
                            size="sm"
                          >
                            {getStatusLabel(reservation.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">日時</p>
                            <p className="text-gray-900">{new Date(reservation.date).toLocaleDateString("ja-JP")}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">人数</p>
                            <p className="text-gray-900">
                              {reservation.num_people}人
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">合計金額</p>
                            <p className="text-lg font-bold text-green-600">
                              ¥{reservation.total_price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="secondary" size="sm">
                            詳細を見る
                          </Button>
                          {reservation.status === "pending" && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleCancelReservation(reservation.id)}
                              disabled={canceling === reservation.id.toString()}
                              isLoading={canceling === reservation.id.toString()}
                            >
                              キャンセル
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-gray-600 mb-4">予約がありません</p>
                  <Link href="/search">
                    <Button variant="primary">ファームを探す</Button>
                  </Link>
                </CardBody>
              </Card>
            )}
          </div>
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

      <Footer />
    </div>
  );
}

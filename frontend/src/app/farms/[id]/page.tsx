"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFarm, getReviews } from "@/lib/api";

export default function FarmDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState(0);
  const [farm, setFarm] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const farmData = await getFarm(params.id);
        setFarm(farmData);

        const reviewsData = await getReviews(0, 100, params.id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Container size="lg" className="py-8 flex-1 flex items-center justify-center">
          <p className="text-gray-600">読み込み中...</p>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Container size="lg" className="py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">ファームが見つかりません</p>
            <Link href="/search">
              <Button variant="primary">ファーム一覧に戻る</Button>
            </Link>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <Container size="lg" className="py-8 flex-1">
        {/* パンくずリスト */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-green-600 hover:text-green-700">
            ホーム
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <Link href="/search" className="text-green-600 hover:text-green-700">
            ファームを探す
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600">{farm.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* メイン画像 */}
            <div className="rounded-lg overflow-hidden shadow-lg mb-6">
              <img
                src={farm.main_image_url || "http://localhost:8000/uploads/farm_images/farm1_main.jpg"}
                alt={farm.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* ファーム情報 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {farm.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="text-xl font-semibold">
                    {farm.rating || "未評価"}
                  </span>
                </div>
                <Badge variant="primary">{farm.experience_type}</Badge>
              </div>
              <p className="text-gray-600">{farm.location}</p>
            </div>

            {/* 説明 */}
            <Card className="mb-8">
              <CardBody>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  概要
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {farm.description}
                </p>
              </CardBody>
            </Card>

            {/* 施設 */}
            {farm.facilities && (
              <Card className="mb-8">
                <CardBody>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    施設・アメニティ
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {Array.isArray(farm.facilities) ? (
                      farm.facilities.map(
                        (facility: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded"
                          >
                            <span className="text-lg">🏢</span>
                            <span className="text-gray-700">{facility}</span>
                          </div>
                        )
                      )
                    ) : (
                      <div className="col-span-2 text-gray-600">
                        {typeof farm.facilities === "string"
                          ? farm.facilities
                          : "施設情報なし"}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* レビュー */}
            <Card>
              <CardBody>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  レビュー（{reviews.length}件）
                </h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">
                                {review.guest?.name || "ゲスト"}
                              </h3>
                            </div>
                            <div className="flex gap-1 my-1">
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
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">レビューはまだありません</p>
                )}
              </CardBody>
            </Card>
          </div>

          {/* サイドバー - 予約 */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              {/* 価格 */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">1泊あたりの価格</p>
                <p className="text-3xl font-bold text-green-600">
                  ¥{farm.price_per_day?.toLocaleString() || "未定"}
                </p>
              </div>

              {/* 予約ボタン */}
              {session ? (
                <Link href={`/reservation/new?farmId=${farm.id}`} className="w-full">
                  <Button variant="primary" fullWidth>
                    予約に進む
                  </Button>
                </Link>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    予約するにはログインが必要です
                  </p>
                  <Link href="/login" className="w-full">
                    <Button variant="primary" fullWidth>
                      ログイン
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button variant="secondary" fullWidth>
                      新規登録
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}

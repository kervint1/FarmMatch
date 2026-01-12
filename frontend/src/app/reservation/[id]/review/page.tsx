"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { ReviewForm } from "@/components/features/review/ReviewForm";
import { getReservation } from "@/lib/api";
import { getImageUrl } from "@/lib/utils/image-url";

export default function ReviewPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) {
        setError("予約IDが指定されていません");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getReservation(reservationId);
        setReservation(data);

        // ステータスチェック
        if (data.status !== "approved") {
          setError("承認済みの予約のみレビュー可能です");
        }
      } catch (err) {
        console.error("Error fetching reservation:", err);
        setError("予約情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  // ログインチェック
  if (!session) {
    return (
      <div className="bg-white">
        <Container size="md" className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ログインが必要です
            </h1>
            <p className="text-gray-600 mb-6">
              レビューを投稿するにはログインしてください
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

  if (loading) {
    return (
      <div className="bg-gray-50">
        <Container size="md" className="py-20">
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600">読み込み中...</p>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="bg-gray-50">
        <Container size="md" className="py-20">
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600 mb-6">
                {error || "予約が見つかりません"}
              </p>
              <Button variant="primary" onClick={() => router.push("/mypage")}>
                マイページに戻る
              </Button>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Container size="md" className="py-8">
        {/* パンくずリスト */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-green-600 hover:text-green-700">
            ホーム
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <Link href="/mypage" className="text-green-600 hover:text-green-700">
            マイページ
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600">レビュー投稿</span>
        </div>

        {/* 予約情報カード */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex gap-4">
              <img
                src={
                  getImageUrl(reservation.farm?.main_image_url) ||
                  "https://images.unsplash.com/photo-1500595046891-cceef1ee6147?w=600&h=400&fit=crop"
                }
                alt={reservation.farm?.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {reservation.farm?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  宿泊期間:{" "}
                  {new Date(reservation.start_date).toLocaleDateString("ja-JP")}{" "}
                  〜{" "}
                  {new Date(reservation.end_date).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* レビューフォーム */}
        <ReviewForm
          reservationId={reservationId}
          farmId={reservation.farm_id}
          guestId={reservation.guest_id}
          farmName={reservation.farm?.name || ""}
          experienceDate={reservation.end_date}
          onSuccess={() => {
            router.push("/mypage");
          }}
        />
      </Container>
    </div>
  );
}

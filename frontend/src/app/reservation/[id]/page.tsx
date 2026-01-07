"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getReservation } from "@/lib/api/reservations";

interface ReservationDetail {
  id: number;
  farm_id: number;
  guest_id: number;
  start_date: string;
  end_date: string;
  num_guests: number;
  total_amount: number;
  contact_phone: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const data = await getReservation(reservationId);
        setReservation(data);
      } catch (err: any) {
        console.error("Error fetching reservation:", err);
        setError("予約情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "確定";
      case "approved":
        return "承認済み";
      case "pending":
        return "確認待ち";
      case "cancelled":
        return "キャンセル済み";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (!session) {
    return (
      <div className="bg-white min-h-screen">
        <Container size="md" className="py-20">
          <Card>
            <CardBody className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ログインが必要です
              </h2>
              <p className="text-gray-600 mb-6">
                予約詳細を表示するにはログインしてください
              </p>
              <Link href="/login">
                <Button variant="primary" size="lg">
                  ログイン
                </Button>
              </Link>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Container size="md" className="py-8">
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
      <div className="bg-gray-50 min-h-screen">
        <Container size="md" className="py-8">
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-red-600 mb-4">{error || "予約が見つかりません"}</p>
              <Button variant="secondary" onClick={() => router.push("/mypage")}>
                マイページに戻る
              </Button>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = () => {
    const start = new Date(reservation.start_date);
    const end = new Date(reservation.end_date);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Container size="md" className="py-8">
        {/* パンくずリスト */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/mypage" className="hover:text-green-600">
            マイページ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">予約詳細</span>
        </nav>

        {/* 予約詳細カード */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex items-start justify-between mb-6">
              <CardTitle>予約詳細</CardTitle>
              <Badge variant={getStatusColor(reservation.status) as any}>
                {getStatusLabel(reservation.status)}
              </Badge>
            </div>

            {/* 予約番号 */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">予約番号</p>
              <p className="text-lg font-semibold text-gray-900">
                #{reservation.id}
              </p>
            </div>

            {/* 宿泊情報 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  宿泊情報
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">チェックイン</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(reservation.start_date)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">チェックアウト</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(reservation.end_date)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">宿泊日数</p>
                  <p className="font-semibold text-gray-900">
                    {calculateNights()}泊
                  </p>
                </div>
              </div>

              {/* ゲスト情報 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ゲスト情報
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">人数</p>
                    <p className="font-semibold text-gray-900">
                      {reservation.num_guests}名
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">連絡先電話番号</p>
                    <p className="font-semibold text-gray-900">
                      {reservation.contact_phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* メッセージ */}
              {reservation.message && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    メッセージ
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {reservation.message}
                    </p>
                  </div>
                </div>
              )}

              {/* 料金情報 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  料金情報
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">合計金額</span>
                    <span className="text-2xl font-bold text-green-600">
                      ¥{reservation.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 予約日時 */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  予約日時: {formatDate(reservation.created_at)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* アクションボタン */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push("/mypage")}
            className="flex-1"
          >
            マイページに戻る
          </Button>
          {reservation.status === "approved" && (
            <Button
              variant="primary"
              onClick={() => router.push(`/reservation/${reservation.id}/review`)}
              className="flex-1"
            >
              レビューを書く
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}

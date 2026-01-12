"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cancelReservation, getReservations } from "@/lib/api";
import { getImageUrl } from "@/lib/utils/image-url";

interface Reservation {
  id: number;
  farm_id: number;
  guest_id: number;
  farm?: {
    name: string;
    main_image_url?: string;
  };
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  num_guests: number;
  has_review?: boolean;  // レビュー済みかどうか
}

interface ReservationListProps {
  userId?: string;
  reservations?: Reservation[];
  onReservationUpdate?: () => void;
}

export function ReservationList({
  userId,
  reservations: propReservations,
  onReservationUpdate,
}: ReservationListProps) {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>(propReservations || []);
  const [loading, setLoading] = useState(!propReservations && !!userId);
  const [canceling, setCanceling] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userId || propReservations) return;

      try {
        setLoading(true);
        const data = await getReservations(0, 100, userId);
        setReservations(data || []);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId, propReservations]);

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

  const handleCancelReservation = async (reservationId: number) => {
    if (
      !confirm("この予約をキャンセルしてもよろしいですか？")
    ) {
      return;
    }

    try {
      setCanceling(reservationId.toString());
      setCancelError(null);
      await cancelReservation(reservationId.toString());
      onReservationUpdate?.();
    } catch (error: any) {
      console.error("Error canceling reservation:", error);
      setCancelError(error.message || "キャンセルに失敗しました");
    } finally {
      setCanceling(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-gray-600 mb-4">読み込み中...</p>
        </CardBody>
      </Card>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-gray-600 mb-4">予約がありません</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {cancelError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {cancelError}
        </div>
      )}

      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardBody>
            <div className="flex gap-6">
              <img
                src={
                  getImageUrl(reservation.farm?.main_image_url) ||
                  "https://images.unsplash.com/photo-1500595046891-cceef1ee6147?w=600&h=400&fit=crop"
                }
                alt={reservation.farm?.name}
                className="w-32 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {reservation.farm?.name}
                  </h3>
                  <Badge
                    variant={getStatusColor(reservation.status) as any}
                    size="sm"
                  >
                    {getStatusLabel(reservation.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">チェックイン</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(reservation.start_date).toLocaleDateString(
                        "ja-JP"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">チェックアウト</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(reservation.end_date).toLocaleDateString(
                        "ja-JP"
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-lg font-bold text-green-600 mb-4">
                  ¥{reservation.total_amount?.toLocaleString()}
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/reservation/${reservation.id}`)}
                  >
                    詳細を見る
                  </Button>
                  {reservation.status === "pending" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelReservation(reservation.id)}
                      disabled={canceling === reservation.id.toString()}
                    >
                      {canceling === reservation.id.toString()
                        ? "キャンセル中..."
                        : "キャンセル"}
                    </Button>
                  )}
                  {reservation.status === "approved" && !reservation.has_review && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        router.push(`/reservation/${reservation.id}/review`)
                      }
                    >
                      レビューを書く
                    </Button>
                  )}
                  {reservation.status === "approved" && reservation.has_review && (
                    <Badge variant="success" size="sm">
                      レビュー済み
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

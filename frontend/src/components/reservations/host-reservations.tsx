"use client";

import { useState, useEffect } from "react";
import { getHostReservations, approveReservation } from "@/lib/api/reservations";
import { getFarm } from "@/lib/api/farms";
import { getUserByEmail } from "@/lib/api/users";

interface Reservation {
  id: number;
  farm_id: number;
  guest_id: number;
  start_date: string;
  end_date: string;
  num_guests: number;
  total_amount: number;
  status: string;
  created_at: string;
}

interface ReservationWithDetails extends Reservation {
  farmName?: string;
  guestName?: string;
}

interface HostReservationsProps {
  hostId: number;
}

export function HostReservations({ hostId }: HostReservationsProps) {
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null);
  const [approvalMessage, setApprovalMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const status = filter === "all" ? undefined : filter;
      const data = await getHostReservations(hostId, 0, 100, status);

      // Fetch farm and guest details for each reservation
      const reservationsWithDetails = await Promise.all(
        data.map(async (res: Reservation) => {
          try {
            const farm = await getFarm(res.farm_id.toString());
            // Note: We can't easily get guest info without an endpoint, so we'll skip for now
            return {
              ...res,
              farmName: farm?.name || "不明",
            };
          } catch (error) {
            return {
              ...res,
              farmName: "不明",
            };
          }
        })
      );

      setReservations(reservationsWithDetails);
    } catch (error) {
      console.error("Failed to load reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [hostId, filter]);

  const handleApproveClick = (reservation: ReservationWithDetails) => {
    setSelectedReservation(reservation);
    setApprovalMessage("");
    setApprovalModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedReservation) return;

    try {
      setSubmitting(true);
      await approveReservation(selectedReservation.id, hostId, approvalMessage);
      alert("予約を承認しました。ゲストにメール通知が送信されます。");
      setApprovalModalOpen(false);
      setSelectedReservation(null);
      setApprovalMessage("");
      loadReservations();
    } catch (error: any) {
      console.error("Failed to approve reservation:", error);
      alert(error.message || "予約の承認に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "確認待ち";
      case "approved":
        return "承認済み";
      case "completed":
        return "完了";
      case "cancelled":
        return "キャンセル";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">予約管理</h2>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "completed", "cancelled"].map((filterValue) => (
            <button
              key={filterValue}
              onClick={() => setFilter(filterValue)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === filterValue
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filterValue === "all" ? "すべて" : getStatusLabel(filterValue)}
            </button>
          ))}
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">予約がありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {reservation.farmName}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusBadgeColor(
                      reservation.status
                    )}`}
                  >
                    {getStatusLabel(reservation.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">予約日程</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(reservation.start_date).toLocaleDateString("ja-JP")} 〜{" "}
                    {new Date(reservation.end_date).toLocaleDateString("ja-JP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ゲスト数</p>
                  <p className="font-semibold text-gray-900">{reservation.num_guests}人</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">料金</p>
                  <p className="font-semibold text-gray-900">
                    ¥{reservation.total_amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">予約日時</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(reservation.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </div>

              {reservation.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveClick(reservation)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    承認する
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {approvalModalOpen && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">予約を承認</h3>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">ファーム:</span> {selectedReservation.farmName}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">日程:</span>{" "}
                {new Date(selectedReservation.start_date).toLocaleDateString("ja-JP")} 〜{" "}
                {new Date(selectedReservation.end_date).toLocaleDateString("ja-JP")}
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="approval-message" className="block text-sm font-semibold text-gray-900 mb-2">
                ゲストへのメッセージ（オプション）
              </label>
              <textarea
                id="approval-message"
                value={approvalMessage}
                onChange={(e) => setApprovalMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="ゲストに伝えたいメッセージがあれば入力してください"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setApprovalModalOpen(false)}
                disabled={submitting}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleApproveConfirm}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
              >
                {submitting ? "承認中..." : "承認する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

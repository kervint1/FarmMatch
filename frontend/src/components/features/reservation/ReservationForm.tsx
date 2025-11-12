"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/form";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { getFarm, createReservation } from "@/lib/api";

interface ReservationFormProps {
  farmId: string;
}

export function ReservationForm({ farmId }: ReservationFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    numPeople: "1",
    contactPhone: "",
    message: "",
  });

  useEffect(() => {
    const fetchFarm = async () => {
      if (!farmId) {
        setError("ファームが指定されていません");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const farmData = await getFarm(farmId);
        setFarm(farmData);
      } catch (err) {
        console.error("Error fetching farm:", err);
        setError("ファームの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [farmId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateNights = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate + "T00:00:00Z");
    const end = new Date(formData.endDate + "T00:00:00Z");
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const nights = calculateNights();
  const pricePerDay = parseInt(String(farm?.price_per_day || 0));
  const numPeopleForDisplay = parseInt(formData.numPeople);
  const totalPrice = pricePerDay * numPeopleForDisplay * nights;

  const validateForm = () => {
    if (!formData.startDate) {
      setError("チェックイン日を選択してください");
      return false;
    }
    if (!formData.endDate) {
      setError("チェックアウト日を選択してください");
      return false;
    }
    if (nights <= 0) {
      setError("チェックアウト日はチェックイン日より後の日付を選択してください");
      return false;
    }
    if (!formData.numPeople || parseInt(formData.numPeople) < 1) {
      setError("1人以上の人数を入力してください");
      return false;
    }
    if (!formData.contactPhone) {
      setError("電話番号を入力してください");
      return false;
    }
    const phoneRegex = /^[\d\-]+$/;
    if (!phoneRegex.test(formData.contactPhone)) {
      setError("電話番号の形式が正しくありません");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session?.user?.email) {
      setError("ログイン情報が見つかりません");
      return;
    }

    if (!farm) {
      setError("ファーム情報が見つかりません");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Get user ID from session or API
      let dbUserId = (session.user as any)?.dbUserId;

      if (!dbUserId && session.user?.email) {
        // If dbUserId not in session, fetch it from API
        try {
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/email/${encodeURIComponent(session.user.email)}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (userResponse.ok) {
            const user = await userResponse.json();
            dbUserId = user.id;
          } else {
            // Try to create user if it doesn't exist
            const createResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  google_id: (session.user as any)?.id || "unknown",
                  email: session.user.email,
                  name: session.user.name || "User",
                  avatar_url: session.user.image || null,
                  user_type: "guest",
                }),
              }
            );

            if (createResponse.ok) {
              const newUser = await createResponse.json();
              dbUserId = newUser.id;
            }
          }
        } catch (error) {
          console.error("Error fetching/creating user:", error);
        }
      }

      if (!dbUserId) {
        setError("ユーザー情報が見つかりません。再度ログインしてください。");
        return;
      }

      const pricePerDay = parseInt(String(farm.price_per_day)) || 0;
      const numPeople = parseInt(formData.numPeople);
      const totalAmount = Math.floor(pricePerDay * numPeople * nights);

      const reservation = await createReservation({
        farm_id: parseInt(String(farmId)),
        guest_id: parseInt(String(dbUserId)),
        start_date: formData.startDate,
        end_date: formData.endDate,
        num_guests: numPeople,
        total_amount: totalAmount,
        contact_phone: formData.contactPhone,
        message: formData.message || undefined,
      });

      router.push("/mypage");
    } catch (err: any) {
      console.error("Error creating reservation:", err);
      setError(err.message || "予約の作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">予約するにはログインが必要です</p>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{error || "ファームが見つかりません"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* フォーム */}
      <div className="lg:col-span-2">
        <Card>
          <CardBody>
            <CardTitle className="mb-6">予約フォーム</CardTitle>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* チェックイン日 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  チェックイン日
                </label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* チェックアウト日 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  チェックアウト日
                </label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 人数 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  人数（{farm.max_guests}名まで）
                </label>
                <Input
                  type="number"
                  name="numPeople"
                  min="1"
                  max={farm.max_guests}
                  value={formData.numPeople}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 電話番号 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  電話番号
                </label>
                <Input
                  type="tel"
                  name="contactPhone"
                  placeholder="090-1234-5678"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* メッセージ */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  ホストへのメッセージ（オプション）
                </label>
                <Textarea
                  name="message"
                  placeholder="特別なリクエストやご質問がありましたらご記入ください"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              {/* 利用規約 */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ✓ 予約確定後、ホストから確認の連絡が入ります
                </p>
                <p className="text-sm text-blue-900">
                  ✓ キャンセルは7日前までは無料です
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={submitting}
                type="submit"
              >
                {submitting ? "予約中..." : "予約を確定する"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* 予約概要 */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardBody>
            <CardTitle className="mb-6">予約概要</CardTitle>

            {/* ファーム画像 */}
            <img
              src={
                farm.main_image_url
                  ? `${process.env.NEXT_PUBLIC_API_URL}${farm.main_image_url}`
                  : "https://images.unsplash.com/photo-1500595046891-cceef1ee6147?w=600&h=400&fit=crop"
              }
              alt={farm.name}
              className="w-full h-40 rounded-lg object-cover mb-4"
            />

            {/* ファーム情報 */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {farm.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {farm.prefecture} {farm.city}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">チェックイン</span>
                  <span className="font-semibold">
                    {formData.startDate || "-"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">チェックアウト</span>
                  <span className="font-semibold">{formData.endDate || "-"}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">宿泊数</span>
                  <span className="font-semibold">{nights}泊</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">人数</span>
                  <span className="font-semibold">{formData.numPeople}人</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">1人1泊の価格</span>
                  <span className="font-semibold">
                    ¥{farm.price_per_day?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 bg-green-50 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    合計金額
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ¥{totalPrice > 0 ? totalPrice.toLocaleString() : "0"}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

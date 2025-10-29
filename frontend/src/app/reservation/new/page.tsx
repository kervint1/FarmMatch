"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFarm, createReservation } from "@/lib/api";

export default function ReservationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const farmId = searchParams.get("farmId");

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

  // ファーム情報を取得
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!formData.startDate) {
      setError("チェックイン日を選択してください");
      return;
    }

    if (!formData.endDate) {
      setError("チェックアウト日を選択してください");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("チェックアウト日はチェックイン日より後にしてください");
      return;
    }

    if (!formData.numPeople || parseInt(formData.numPeople) < 1) {
      setError("人数は1人以上を選択してください");
      return;
    }

    if (!formData.contactPhone.trim()) {
      setError("電話番号を入力してください");
      return;
    }

    if (!session?.user?.id || !farmId) {
      setError("ログイン情報またはファーム情報が不足しています");
      return;
    }

    try {
      setSubmitting(true);

      // ユーザーIDを取得
      const userId = localStorage.getItem("farmMatch_userId");
      if (!userId) {
        setError("ユーザー情報が見つかりません");
        return;
      }

      // 価格計算を詳しくログ
      const priceValue = farm.price_per_day;
      const pricePerDay = parseInt(String(priceValue || 0));
      const numPeople = parseInt(formData.numPeople);

      console.log("Price calculation debug:", {
        farm_price_per_day: priceValue,
        pricePerDay,
        numPeople,
        nights,
        multiplication: pricePerDay * numPeople * nights,
      });

      // nightsが0以下の場合は検証エラーを出す
      if (nights <= 0) {
        setError("宿泊数が0以下です。日付を確認してください");
        setSubmitting(false);
        return;
      }

      if (pricePerDay <= 0) {
        setError("ファームの価格が正しく取得できていません");
        setSubmitting(false);
        return;
      }

      const totalAmount = Math.floor(pricePerDay * numPeople * nights);

      console.log("Final reservation debug:", {
        pricePerDay,
        numPeople,
        nights,
        totalAmount,
        totalAmountType: typeof totalAmount,
      });

      const reservation = await createReservation({
        farm_id: parseInt(String(farmId)),
        guest_id: parseInt(String(userId)),
        start_date: formData.startDate,
        end_date: formData.endDate,
        num_guests: numPeople,
        total_amount: totalAmount,
        contact_phone: formData.contactPhone,
        message: formData.message || undefined,
      });

      console.log("Reservation created:", reservation);

      // 成功時はマイページにリダイレクト
      router.push("/mypage");
    } catch (err: any) {
      console.error("Error creating reservation:", err);
      setError(err.message || "予約の作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  // ログインチェック
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
              予約するにはログインしてください
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

  // 読み込み中
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Container size="lg" className="flex-1 flex items-center justify-center py-20">
          <p className="text-gray-600">読み込み中...</p>
        </Container>
        <Footer />
      </div>
    );
  }

  // エラー
  if (!farm) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Container size="lg" className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">{error || "ファームが見つかりません"}</p>
            <Link href="/search">
              <Button variant="primary">ファーム一覧に戻る</Button>
            </Link>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  // 宿泊数を計算（タイムゾーン考慮）
  const calculateNights = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    // YYYY-MM-DD形式で直接計算してタイムゾーン問題を回避
    const start = new Date(formData.startDate + 'T00:00:00Z');
    const end = new Date(formData.endDate + 'T00:00:00Z');
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const nights = calculateNights();
  const pricePerDay = parseInt(String(farm.price_per_day || 0));
  const numPeopleForDisplay = parseInt(formData.numPeople);
  const totalPrice = pricePerDay * numPeopleForDisplay * nights;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
          <Link href={`/farms/${farm.id}`} className="text-green-600 hover:text-green-700">
            {farm.name}
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600">予約</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：予約フォーム */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  予約確認
                </h1>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* チェックイン日 */}
                  <div>
                    <Input
                      label="チェックイン日"
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* チェックアウト日 */}
                  <div>
                    <Input
                      label="チェックアウト日"
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* 人数選択 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ご来園人数
                    </label>
                    <input
                      type="number"
                      name="numPeople"
                      min="1"
                      max="50"
                      value={formData.numPeople}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  {/* 電話番号 */}
                  <div>
                    <Input
                      label="ご連絡先電話番号"
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="09012345678"
                      required
                    />
                  </div>

                  {/* メッセージ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      農家さんへのメッセージ（任意）
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="ご質問やご要望があればお知らせください"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      rows={3}
                    />
                  </div>

                  {/* 注意事項 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">ご予約前にお読みください</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• ご予約後、農家さんより確認メールが届きます</li>
                      <li>• キャンセルは予約日の7日前までです</li>
                      <li>• 雨天時の対応については農家さんにご確認ください</li>
                    </ul>
                  </div>

                  {/* 送信ボタン */}
                  <Button
                    variant="primary"
                    fullWidth
                    type="submit"
                    disabled={submitting}
                    isLoading={submitting}
                  >
                    予約を確定
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* 右側：予約概要 */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  予約概要
                </h2>

                {/* ファーム画像 */}
                <img
                  src={farm.main_image_url || "http://localhost:8000/uploads/farm_images/farm1_main.jpg"}
                  alt={farm.name}
                  className="w-full h-40 rounded-lg object-cover mb-4"
                />

                {/* ファーム情報 */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600">ファーム名</p>
                    <p className="font-semibold text-gray-900">{farm.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">位置</p>
                    <p className="text-sm text-gray-900">{farm.location}</p>
                  </div>

                  <div>
                    <Badge variant="primary">{farm.experience_type}</Badge>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
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
      </Container>

      <Footer />
    </div>
  );
}

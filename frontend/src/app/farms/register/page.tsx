"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/container";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createFarm } from "@/lib/api/farms";
import { getUserByEmail } from "@/lib/api/users";

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const EXPERIENCE_TYPES = [
  { value: "agriculture", label: "農業体験" },
  { value: "livestock", label: "畜産体験" },
  { value: "fishery", label: "漁業体験" }
];

export default function FarmRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prefecture: "",
    city: "",
    address: "",
    experience_type: "agriculture",
    price_per_day: "",
    price_per_night: "",
    max_guests: "",
    access_info: "",
  });

  useEffect(() => {
    // 認証チェック
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // host チェック
    if (session && (session.user as any).userType !== "host") {
      alert("この機能は農家ホストのみ利用可能です");
      router.push("/");
    }
  }, [session, status, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!formData.name || formData.name.length > 100) {
      setError("ファーム名は1〜100文字で入力してください");
      return;
    }

    if (!formData.description) {
      setError("ファーム説明を入力してください");
      return;
    }

    if (!formData.prefecture) {
      setError("都道府県を選択してください");
      return;
    }

    if (!formData.city || formData.city.length > 50) {
      setError("市区町村は1〜50文字で入力してください");
      return;
    }

    if (!formData.address) {
      setError("詳細住所を入力してください");
      return;
    }

    const pricePerDay = parseInt(formData.price_per_day);
    if (isNaN(pricePerDay) || pricePerDay <= 0) {
      setError("日帰り料金は0より大きい数値を入力してください");
      return;
    }

    const maxGuests = parseInt(formData.max_guests);
    if (isNaN(maxGuests) || maxGuests <= 0) {
      setError("最大ゲスト数は0より大きい数値を入力してください");
      return;
    }

    try {
      setSubmitting(true);

      // ユーザーIDを取得（localStorage または API から）
      let userId: number | null = null;

      // まず localStorage から取得を試みる
      const cachedUserId = localStorage.getItem("farmMatch_userId");
      if (cachedUserId) {
        userId = parseInt(cachedUserId);
      }

      // localStorage にない場合は API から取得
      if (!userId && session?.user?.email) {
        try {
          const user = await getUserByEmail(session.user.email);
          userId = user.id;
          localStorage.setItem("farmMatch_userId", userId.toString());
        } catch (error) {
          console.error("Error fetching user by email:", error);
          setError("ユーザー情報の取得に失敗しました");
          return;
        }
      }

      if (!userId) {
        setError("ユーザー情報の取得に失敗しました");
        return;
      }

      const payload: any = {
        host_id: userId,
        name: formData.name,
        description: formData.description,
        prefecture: formData.prefecture,
        city: formData.city,
        address: formData.address,
        experience_type: formData.experience_type,
        price_per_day: pricePerDay,
        max_guests: maxGuests,
      };

      // オプショナルフィールド
      if (formData.price_per_night) {
        const pricePerNight = parseInt(formData.price_per_night);
        if (!isNaN(pricePerNight) && pricePerNight > 0) {
          payload.price_per_night = pricePerNight;
        }
      }

      if (formData.access_info) {
        payload.access_info = formData.access_info;
      }

      const result = await createFarm(payload);
      alert("ファームが登録されました！");
      router.push(`/farms/${result.id}`);
    } catch (err: any) {
      console.error("Error creating farm:", err);
      setError(err.message || "ファーム登録に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              ファーム登録
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
          {/* ファーム名 */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              ファーム名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="例: 田中農園"
            />
          </div>

          {/* ファーム説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              ファーム説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="ファームの特徴や魅力を説明してください"
            />
          </div>

          {/* 体験タイプ */}
          <div>
            <label htmlFor="experience_type" className="block text-sm font-semibold text-gray-900 mb-2">
              体験タイプ <span className="text-red-500">*</span>
            </label>
            <select
              id="experience_type"
              name="experience_type"
              value={formData.experience_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
            >
              {EXPERIENCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 所在地 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prefecture" className="block text-sm font-semibold text-gray-900 mb-2">
                都道府県 <span className="text-red-500">*</span>
              </label>
              <select
                id="prefecture"
                name="prefecture"
                value={formData.prefecture}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              >
                <option value="">選択してください</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                市区町村 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="例: 横浜市"
              />
            </div>
          </div>

          {/* 詳細住所 */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">
              詳細住所 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="例: 青葉区あざみ野1-2-3"
            />
          </div>

          {/* 料金 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price_per_day" className="block text-sm font-semibold text-gray-900 mb-2">
                日帰り料金（円） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price_per_day"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="5000"
              />
            </div>

            <div>
              <label htmlFor="price_per_night" className="block text-sm font-semibold text-gray-900 mb-2">
                宿泊料金（円）
              </label>
              <input
                type="number"
                id="price_per_night"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="15000"
              />
            </div>
          </div>

          {/* 最大ゲスト数 */}
          <div>
            <label htmlFor="max_guests" className="block text-sm font-semibold text-gray-900 mb-2">
              最大ゲスト数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="max_guests"
              name="max_guests"
              value={formData.max_guests}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="10"
            />
          </div>

          {/* アクセス情報 */}
          <div>
            <label htmlFor="access_info" className="block text-sm font-semibold text-gray-900 mb-2">
              アクセス情報
            </label>
            <textarea
              id="access_info"
              name="access_info"
              value={formData.access_info}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="最寄り駅からのアクセス方法など"
            />
          </div>

              {/* 送信ボタン */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {submitting ? "登録中..." : "ファームを登録"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

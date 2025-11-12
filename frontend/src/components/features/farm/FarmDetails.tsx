"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { getFarm } from "@/lib/api";

interface FarmDetailsProps {
  farmId: string;
}

export function FarmDetails({ farmId }: FarmDetailsProps) {
  const { data: session } = useSession();
  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarm = async () => {
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

    if (farmId) {
      fetchFarm();
    }
  }, [farmId]);

  if (loading) {
    return <div className="text-center py-12">読み込み中...</div>;
  }

  if (error || !farm) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">{error || "ファームが見つかりません"}</p>
        <Link href="/search">
          <Button variant="primary">農園一覧に戻る</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* メインコンテンツ */}
      <div className="lg:col-span-2">
        {/* メイン画像 */}
        <div className="rounded-lg overflow-hidden shadow-lg mb-6">
          <img
            src={
              farm.main_image_url ||
              "http://localhost:8000/uploads/farm_images/farm1_main.jpg"
            }
            alt={farm.name}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* ファーム情報 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{farm.name}</h1>
          <p className="text-lg text-gray-600 mb-6">
            {farm.prefecture} {farm.city}
          </p>

          <Card className="mb-6">
            <CardBody>
              <CardTitle className="mb-4">概要</CardTitle>
              <p className="text-gray-700 leading-relaxed">{farm.description}</p>
            </CardBody>
          </Card>

          <Card className="mb-6">
            <CardBody>
              <CardTitle className="mb-4">体験の種類</CardTitle>
              <p className="text-gray-700">
                {farm.experience_type === "agriculture"
                  ? "農業体験"
                  : farm.experience_type === "livestock"
                    ? "畜産体験"
                    : farm.experience_type === "fishery"
                      ? "漁業体験"
                      : farm.experience_type}
              </p>
            </CardBody>
          </Card>

          {farm.facilities && (
            <Card className="mb-6">
              <CardBody>
                <CardTitle className="mb-4">施設</CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  {Array.isArray(farm.facilities) ? (
                    farm.facilities.map((facility: string, index: number) => (
                      <div key={index} className="text-gray-700">
                        ✓ {facility}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-700">
                      {typeof farm.facilities === "string"
                        ? farm.facilities
                        : "情報なし"}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {farm.access_info && (
            <Card>
              <CardBody>
                <CardTitle className="mb-4">アクセス</CardTitle>
                <p className="text-gray-700">{farm.access_info}</p>
              </CardBody>
            </Card>
          )}
        </div>
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
            <Link
              href={`/reservation/new?farmId=${farm.id}`}
              className="w-full"
            >
              <Button variant="primary" size="lg" fullWidth>
                予約する
              </Button>
            </Link>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                予約するにはログインが必要です
              </p>
              <Link href="/login" className="w-full">
                <Button variant="primary" size="lg" fullWidth>
                  ログイン
                </Button>
              </Link>
            </>
          )}

          <p className="text-xs text-gray-500 mt-4">
            キャンセル料金は予約の7日前まで無料です
          </p>
        </div>
      </div>
    </div>
  );
}

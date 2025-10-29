"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { Card, CardBody, CardImage, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFarms } from "@/lib/api";

export default function SearchPage() {
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    priceMin: "",
    priceMax: "",
  });

  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        const data = await getFarms(0, 100, filters.location || undefined, filters.type || undefined);
        setFarms(data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [filters.location, filters.type]);

  const locationOptions = [
    { value: "", label: "すべての地域" },
    { value: "長野県", label: "長野県" },
    { value: "山梨県", label: "山梨県" },
    { value: "千葉県", label: "千葉県" },
    { value: "新潟県", label: "新潟県" },
    { value: "愛知県", label: "愛知県" },
  ];

  const typeOptions = [
    { value: "", label: "すべての体験" },
    { value: "野菜栽培", label: "野菜栽培" },
    { value: "果実収穫", label: "果実収穫" },
    { value: "花卉栽培", label: "花卉栽培" },
    { value: "稲作体験", label: "稲作体験" },
  ];

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      location: "",
      type: "",
      priceMin: "",
      priceMax: "",
    });
  };

  // 価格フィルター（クライアント側）
  const filteredFarms = farms.filter((farm) => {
    if (filters.priceMin && farm.price_per_day < parseInt(filters.priceMin))
      return false;
    if (filters.priceMax && farm.price_per_day > parseInt(filters.priceMax))
      return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* ページタイトル */}
      <section className="bg-white border-b border-gray-200 py-8">
        <Container size="lg">
          <h1 className="text-3xl font-bold text-gray-900">ファームを探す</h1>
          <p className="text-gray-600 mt-2">
            全国の農場から、あなたにぴったりの体験を見つけよう
          </p>
        </Container>
      </section>

      {/* コンテンツ */}
      <div className="flex-1">
        <Container size="lg" className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* サイドバー - フィルター */}
            <aside className="md:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  フィルター
                </h2>

                <div className="space-y-4">
                  {/* 地域 */}
                  <div>
                    <Select
                      label="地域"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      options={locationOptions}
                    />
                  </div>

                  {/* 体験タイプ */}
                  <div>
                    <Select
                      label="体験タイプ"
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      options={typeOptions}
                    />
                  </div>

                  {/* 価格範囲 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      価格範囲（円）
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="最小"
                        name="priceMin"
                        value={filters.priceMin}
                        onChange={handleFilterChange}
                      />
                      <Input
                        type="number"
                        placeholder="最大"
                        name="priceMax"
                        value={filters.priceMax}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>

                  {/* リセットボタン */}
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={handleReset}
                  >
                    リセット
                  </Button>
                </div>
              </div>
            </aside>

            {/* ファーム一覧 */}
            <div className="md:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">読み込み中...</p>
                </div>
              ) : filteredFarms.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-6">
                    {filteredFarms.length}件のファームが見つかりました
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFarms.map((farm) => (
                      <Link key={farm.id} href={`/farms/${farm.id}`}>
                        <Card hoverable className="h-full">
                          <CardImage
                            src={farm.main_image_url || "http://localhost:8000/uploads/farm_images/farm1_main.jpg"}
                            alt={farm.name}
                          />
                          <CardBody>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="flex-1">
                                {farm.name}
                              </CardTitle>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {farm.location}
                            </p>
                            <p className="text-sm text-gray-700 mb-3">
                              {farm.description}
                            </p>

                            <div className="flex items-center gap-2 mb-4">
                              <Badge variant="primary" size="sm">
                                {farm.experience_type}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-1 mb-4">
                              <span className="text-yellow-400 text-lg">⭐</span>
                              <span className="font-semibold text-gray-900">
                                {farm.rating || "未評価"}
                              </span>
                            </div>

                            <div className="text-lg font-bold text-green-600">
                              ¥{farm.price_per_day?.toLocaleString()}
                            </div>
                          </CardBody>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    条件に合うファームが見つかりません
                  </p>
                  <Button variant="secondary" onClick={handleReset}>
                    フィルターをリセット
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  );
}

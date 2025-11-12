"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/container";
import { SearchFilter } from "@/components/features/search/SearchFilter";
import { SearchResults } from "@/components/features/search/SearchResults";
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

  // 価格フィルター（クライアント側）
  const filteredFarms = farms.filter((farm) => {
    if (filters.priceMin && farm.price_per_day < parseInt(filters.priceMin))
      return false;
    if (filters.priceMax && farm.price_per_day > parseInt(filters.priceMax))
      return false;
    return true;
  });

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({ ...prev, location: value }));
  };

  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, type: value }));
  };

  const handlePriceMinChange = (value: string) => {
    setFilters((prev) => ({ ...prev, priceMin: value }));
  };

  const handlePriceMaxChange = (value: string) => {
    setFilters((prev) => ({ ...prev, priceMax: value }));
  };

  const handleReset = () => {
    setFilters({
      location: "",
      type: "",
      priceMin: "",
      priceMax: "",
    });
  };

  return (
    <div className="bg-gray-50">
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
                <SearchFilter
                  location={filters.location}
                  type={filters.type}
                  priceMin={filters.priceMin}
                  priceMax={filters.priceMax}
                  onLocationChange={handleLocationChange}
                  onTypeChange={handleTypeChange}
                  onPriceMinChange={handlePriceMinChange}
                  onPriceMaxChange={handlePriceMaxChange}
                  onReset={handleReset}
                />
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
                  <SearchResults farms={filteredFarms} loading={false} />
                </>
              ) : (
                <SearchResults farms={filteredFarms} loading={false} />
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

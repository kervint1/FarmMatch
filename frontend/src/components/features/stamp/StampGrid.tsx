"use client";

import { useState } from "react";
import { StampCard } from "./StampCard";
import { StampDetailModal } from "./StampDetailModal";
import type { PrefectureStampStatus } from "@/types/stamp";
import { REGION_NAMES } from "@/types/stamp";

interface StampGridProps {
  stamps: PrefectureStampStatus[];
  userId: string;
}

export function StampGrid({ stamps, userId }: StampGridProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(
    null
  );

  // 地方別にグループ化
  const regionGroups: Record<
    string,
    { name: string; stamps: PrefectureStampStatus[] }
  > = {
    hokkaido: { name: REGION_NAMES.hokkaido, stamps: [] },
    tohoku: { name: REGION_NAMES.tohoku, stamps: [] },
    kanto: { name: REGION_NAMES.kanto, stamps: [] },
    chubu: { name: REGION_NAMES.chubu, stamps: [] },
    kinki: { name: REGION_NAMES.kinki, stamps: [] },
    chugoku: { name: REGION_NAMES.chugoku, stamps: [] },
    shikoku: { name: REGION_NAMES.shikoku, stamps: [] },
    kyushu: { name: REGION_NAMES.kyushu, stamps: [] },
  };

  // スタンプを地方別に振り分け
  stamps.forEach((stamp) => {
    if (regionGroups[stamp.region]) {
      regionGroups[stamp.region].stamps.push(stamp);
    }
  });

  const handleStampClick = (prefectureCode: string) => {
    setSelectedPrefecture(prefectureCode);
  };

  const handleCloseModal = () => {
    setSelectedPrefecture(null);
  };

  return (
    <>
      <div className="space-y-8">
        {Object.entries(regionGroups).map(([regionKey, regionData]) => {
          // 空の地方はスキップ
          if (regionData.stamps.length === 0) return null;

          // 訪問済み都道府県数を計算
          const visitedCount = regionData.stamps.filter(
            (s) => s.is_visited
          ).length;

          return (
            <div key={regionKey}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {regionData.name}
                </h3>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-green-600">
                    {visitedCount}
                  </span>
                  <span className="text-gray-400">
                    {" "}
                    / {regionData.stamps.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {regionData.stamps.map((stamp) => (
                  <StampCard
                    key={stamp.prefecture_code}
                    stamp={stamp}
                    onClick={() => handleStampClick(stamp.prefecture_code)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 詳細モーダル */}
      {selectedPrefecture && (
        <StampDetailModal
          userId={userId}
          prefectureCode={selectedPrefecture}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
  location: string;
  type: string;
  priceMin: string;
  priceMax: string;
  onLocationChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  onReset: () => void;
}

export function SearchFilter({
  location,
  type,
  priceMin,
  priceMax,
  onLocationChange,
  onTypeChange,
  onPriceMinChange,
  onPriceMaxChange,
  onReset,
}: SearchFilterProps) {
  const prefectures = [
    "全て",
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];

  const experienceTypes = [
    { value: "agriculture", label: "農業体験" },
    { value: "livestock", label: "畜産体験" },
    { value: "fishery", label: "漁業体験" },
  ];

  return (
    <div className="space-y-6">
      {/* 都道府県 */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          都道府県
        </label>
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {prefectures.map((pref) => (
            <option key={pref} value={pref === "全て" ? "" : pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>

      {/* 体験タイプ */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          体験タイプ
        </label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">全て</option>
          {experienceTypes.map((exp) => (
            <option key={exp.value} value={exp.value}>
              {exp.label}
            </option>
          ))}
        </select>
      </div>

      {/* 価格範囲 */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          1泊の価格（円）
        </label>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="最小"
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
          />
          <span className="flex items-center text-gray-500">〜</span>
          <Input
            type="number"
            placeholder="最大"
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
          />
        </div>
      </div>

      {/* リセットボタン */}
      <Button variant="outline" fullWidth onClick={onReset}>
        フィルターをリセット
      </Button>
    </div>
  );
}

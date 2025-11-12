"use client";

import { FarmCard } from "@/components/features/farm/FarmCard";

interface Farm {
  id: number;
  name: string;
  city: string;
  prefecture: string;
  experience_type: string;
  price_per_day: number;
  main_image_url?: string;
  rating?: number;
}

interface SearchResultsProps {
  farms: Farm[];
  loading: boolean;
  error?: string | null;
}

export function SearchResults({ farms, loading, error }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          条件に合うファームが見つかりませんでした
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {farms.map((farm) => (
        <FarmCard key={farm.id} {...farm} />
      ))}
    </div>
  );
}

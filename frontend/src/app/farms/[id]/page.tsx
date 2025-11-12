"use client";

import { FarmDetails } from "@/components/features/farm/FarmDetails";

export default function FarmDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-white">
      <FarmDetails farmId={params.id} />
    </div>
  );
}

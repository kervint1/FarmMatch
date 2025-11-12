"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FarmDetails } from "@/components/features/farm/FarmDetails";

export default function FarmDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <FarmDetails farmId={params.id} />
      <Footer />
    </div>
  );
}

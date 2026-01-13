"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ReservationForm } from "@/components/features/reservation/ReservationForm";

function ReservationPageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const farmId = searchParams.get("farmId");

  // ログインチェック
  if (!session) {
    return (
      <div className="bg-white">
        <Container size="md" className="flex items-center justify-center py-20">
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
      </div>
    );
  }

  if (!farmId) {
    return (
      <div className="bg-white">
        <Container size="md" className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">ファームが指定されていません</p>
            <Link href="/search">
              <Button variant="primary">ファーム一覧に戻る</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Container size="lg" className="py-8">
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
          <span className="text-gray-600">予約</span>
        </div>

        <ReservationForm farmId={farmId} />
      </Container>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={
      <div className="bg-white">
        <Container size="md" className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </Container>
      </div>
    }>
      <ReservationPageContent />
    </Suspense>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/container";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FarmRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          ファーム登録
        </h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-gray-700">
            このページは現在開発中です。ファーム登録フォームは別のタスクで実装予定です。
          </p>
        </div>
      </div>
    </Container>
  );
}

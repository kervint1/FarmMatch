"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Link href="/search">
        <Button variant="primary" size="lg" fullWidth>
          ファームを探す
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Link href="/signup" className="flex-1">
        <Button variant="primary" size="lg" fullWidth>
          無料で始める
        </Button>
      </Link>
      <Link href="/login" className="flex-1">
        <Button variant="outline" size="lg" fullWidth>
          ログイン
        </Button>
      </Link>
    </>
  );
}

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function CtaButton() {
  const { data: session } = useSession();

  // Only show CTA button for unauthenticated users
  if (session) {
    return null;
  }

  return (
    <Link href="/signup">
      <Button variant="secondary" size="lg">
        無料登録
      </Button>
    </Link>
  );
}

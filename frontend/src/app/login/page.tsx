"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        redirect: true,
        callbackUrl: "/"
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Match</h1>
          <p className="text-gray-600">農業体験をシェアしよう</p>
        </div>

        {/* ログインフォーム */}
        <div className="space-y-6">
          {/* Google OAuth ボタン */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-gray-700 font-medium">
              {isLoading ? "ログイン中..." : "Googleでログイン"}
            </span>
          </button>

          {/* ディバイダ */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          {/* ゲストログイン */}
          <button
            disabled={isLoading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ゲストとして続行
          </button>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            アカウントをお持ちですか？{" "}
            <Link
              href="/signup"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              サインアップ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log("Current session userType:", session?.user.userType);

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌾</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:inline">Farm Match</span>
          </Link>

          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/search" className="text-gray-600 hover:text-gray-900 font-medium">
              ファームを探す
            </Link>
            {/* ファーム登録ボタン - host のみ表示 */}
            {session && (session.user as { userType?: string }).userType === "host" && (
              <Link
                href="/farms/register"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ファーム登録
              </Link>
            )}
            <Link href="/community" className="text-gray-600 hover:text-gray-900 font-medium">
              コミュニティ
            </Link>

            {session ? (
              <>
                <Link href="/mypage" className="text-gray-600 hover:text-gray-900 font-medium">
                  マイページ
                </Link>
                <div className="flex items-center gap-4">
                  {session.user?.image && (
                    <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
                  )}
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-900 font-medium hover:bg-gray-100 rounded-lg"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  サインアップ
                </Link>
              </div>
            )}
          </div>

          {/* モバイルメニューボタン */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 border-t pt-4">
            <Link href="/search" className="block py-2 text-gray-600 hover:text-gray-900">
              ファームを探す
            </Link>
            {/* ファーム登録ボタン - host のみ表示 */}
            {session && (session.user as { userType?: string }).userType === "host" && (
              <Link href="/farms/register" className="block py-2 text-gray-600 hover:text-gray-900">
                ファーム登録
              </Link>
            )}
            <Link href="/community" className="block py-2 text-gray-600 hover:text-gray-900">
              コミュニティ
            </Link>
            {session ? (
              <>
                <Link href="/mypage" className="block py-2 text-gray-600 hover:text-gray-900">
                  マイページ
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-2">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2 text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 px-4 py-2 text-center bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  サインアップ
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

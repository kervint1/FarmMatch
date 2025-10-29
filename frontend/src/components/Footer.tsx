import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-green-600 mb-4">🌾 Farm Match</h3>
            <p className="text-gray-600 text-sm">
              ファームステイ先の検索・予約から体験の記録・共有まで一元管理できるWebアプリケーション
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">サービス</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/search" className="hover:text-green-600 transition">
                  ファーム検索
                </Link>
              </li>
              <li>
                <Link href="/posts" className="hover:text-green-600 transition">
                  体験記
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-600 transition">
                  Farm Matchとは
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">ヘルプ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/terms" className="hover:text-green-600 transition">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-green-600 transition">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-600 transition">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          © 2025 Farm Match. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

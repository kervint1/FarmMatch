import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              農業体験で、新しい旅を。
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Farm Matchは、ファームステイ先の検索・予約から体験の記録・共有まで
              一元管理できるWebアプリケーションです。
            </p>
            
            <div className="flex gap-4 justify-center mb-12">
              <Link href="/search">
                <Button size="lg">ファームを探す</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">詳しく見る</Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="キーワードで検索（例：有機農業、田植え体験）"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">都道府県</option>
                  <option value="hokkaido">北海道</option>
                  <option value="aomori">青森県</option>
                  <option value="nagano">長野県</option>
                  <option value="shizuoka">静岡県</option>
                </select>
                <Button size="lg">検索</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">主要機能</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">ファームステイ検索</h3>
              <p className="text-gray-600">
                キーワードや都道府県から、あなたにぴったりのファームステイ先を簡単に検索できます。
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-3">簡単予約</h3>
              <p className="text-gray-600">
                気になるファームを見つけたら、そのまま予約申込み。スムーズな予約体験を提供します。
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-xl font-semibold mb-3">体験記録・共有</h3>
              <p className="text-gray-600">
                体験後は5段階評価やレビューを投稿。SNS機能で他のユーザーと体験を共有できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            さあ、農業体験の旅を始めよう
          </h2>
          <p className="text-lg mb-8">
            今すぐ無料登録して、あなたにぴったりのファームステイを見つけましょう。
          </p>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg" className="bg-white text-green-600 hover:bg-gray-100 border-white">
              無料で始める
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

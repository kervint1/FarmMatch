import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-600">
              🌾 Farm Match
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-700 hover:text-green-600 transition">
              検索
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition">
              Farm Matchとは
            </Link>
            <Link href="/posts" className="text-gray-700 hover:text-green-600 transition">
              体験記
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/signin" 
              className="text-gray-700 hover:text-green-600 transition"
            >
              ログイン
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              新規登録
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

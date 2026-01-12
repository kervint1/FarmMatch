import type { StampCollectionSummary } from "@/types/stamp";

interface StampProgressProps {
  summary: StampCollectionSummary;
}

export function StampProgress({ summary }: StampProgressProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        スタンプコレクション進捗
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* 訪問都道府県数 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-1">訪問都道府県</p>
          <p className="text-3xl font-bold text-green-600">
            {summary.total_prefectures}
            <span className="text-lg text-gray-600">/47</span>
          </p>
        </div>

        {/* 総訪問回数 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-1">総訪問回数</p>
          <p className="text-3xl font-bold text-blue-600">
            {summary.total_visits}
          </p>
        </div>

        {/* 訪問ファーム数 */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-1">訪問ファーム数</p>
          <p className="text-3xl font-bold text-yellow-600">
            {summary.total_farms}
          </p>
        </div>

        {/* 達成率 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-1">達成率</p>
          <p className="text-3xl font-bold text-purple-600">
            {summary.completion_rate}%
          </p>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="w-full">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>全国制覇まで</span>
          <span>
            あと {47 - summary.total_prefectures} 都道府県
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${summary.completion_rate}%` }}
          />
        </div>
      </div>

      {/* 達成メッセージ */}
      {summary.completion_rate === 100 && (
        <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 text-center">
          <p className="text-lg font-bold">
            🎉 おめでとうございます！全国制覇達成！🎉
          </p>
        </div>
      )}
    </div>
  );
}

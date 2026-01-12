import Image from "next/image";
import type { PrefectureStampStatus } from "@/types/stamp";

interface StampCardProps {
  stamp: PrefectureStampStatus;
  onClick?: () => void;
}

export function StampCard({ stamp, onClick }: StampCardProps) {
  const handleClick = () => {
    if (stamp.is_visited && onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative rounded-lg overflow-hidden border-2 transition-all duration-200
        ${
          stamp.is_visited
            ? "border-green-400 cursor-pointer hover:shadow-xl hover:scale-105 hover:border-green-500"
            : "border-gray-300"
        }
      `}
    >
      {/* Prefecture Image */}
      <div className="relative aspect-square w-full">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${stamp.image_url}`}
          alt={stamp.name}
          className={`
            w-full h-full object-cover
            mix-blend-multiply
            ${!stamp.is_visited ? "filter grayscale" : ""}
          `}
        />

        {/* 未訪問オーバーレイ */}
        {!stamp.is_visited && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full">
              <span className="text-gray-700 font-bold text-sm">未訪問</span>
            </div>
          </div>
        )}

        {/* 訪問回数バッジ */}
        {stamp.is_visited && stamp.visit_count > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            {stamp.visit_count}回
          </div>
        )}
      </div>

      {/* Prefecture Name */}
      <div
        className={`
        p-2 text-center
        ${stamp.is_visited ? "bg-green-50" : "bg-gray-100"}
      `}
      >
        <p
          className={`
          font-bold text-sm
          ${stamp.is_visited ? "text-green-900" : "text-gray-500"}
        `}
        >
          {stamp.name}
        </p>

        {/* 訪問日 */}
        {stamp.is_visited && stamp.last_visit_date && (
          <p className="text-xs text-gray-600 mt-1">
            {new Date(stamp.last_visit_date).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* ホバー時の詳細表示アイコン */}
      {stamp.is_visited && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center pointer-events-none">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

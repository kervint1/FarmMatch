"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  disabled = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`text-3xl transition ${
            star <= (hoverRating || rating)
              ? "text-yellow-400"
              : "text-gray-300"
          } ${
            disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-gray-900 self-center font-medium">
        {rating > 0 ? `${rating} / 5` : "評価を選択"}
      </span>
    </div>
  );
}

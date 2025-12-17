interface StarRatingDisplayProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export function StarRatingDisplay({
  rating,
  size = "md",
  showNumber = true,
}: StarRatingDisplayProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const numberSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
      {showNumber && (
        <span className={`font-semibold text-gray-900 ${numberSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

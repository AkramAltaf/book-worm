import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, count, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-muted fill-current'
            }`}
          />
        ))}
      </div>
      <span className={`text-yellow-400 font-medium ${textSize}`}>{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className={`text-muted ${textSize}`}>({count.toLocaleString()})</span>
      )}
    </div>
  );
}

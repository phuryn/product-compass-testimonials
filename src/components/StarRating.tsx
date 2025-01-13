import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

export const StarRating = ({ rating, onChange, readonly = false }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer"}`}
          type="button"
        >
          <Star
            className={`h-6 w-6 ${
              star <= rating ? "fill-star text-star" : "fill-none text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};
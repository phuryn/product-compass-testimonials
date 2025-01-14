import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

export const StarRating = ({ rating, onChange, readonly = false }: StarRatingProps) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer"}`}
          type="button"
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating ? "fill-star text-star stroke-[1.5]" : "fill-none text-gray-300 stroke-[1.5]"
            }`}
          />
        </button>
      ))}
    </div>
  );
};
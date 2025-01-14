import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Heart } from "lucide-react";

export interface Testimonial {
  id: string;
  author: {
    name: string;
    email: string;
    social?: string;
    photo?: string;
  };
  rating: number;
  text: string;
  date: string;
  tags: string[];
  approved: boolean;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const TestimonialCard = ({
  testimonial,
  isAdmin,
  onApprove,
  onEdit,
}: TestimonialCardProps) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  const formattedDate = new Date(testimonial.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getInitials = (name: string) => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const renderAuthorName = () => {
    if (testimonial.author.social) {
      return (
        <a
          href={testimonial.author.social}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline text-[#292929]"
        >
          {testimonial.author.name}
        </a>
      );
    }
    return <div className="font-semibold text-[#292929]">{testimonial.author.name}</div>;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {testimonial.author.photo && !imageLoadError ? (
                <AvatarImage
                  src={testimonial.author.photo}
                  alt={testimonial.author.name}
                  className="object-cover"
                  onError={() => setImageLoadError(true)}
                />
              ) : (
                <AvatarFallback>
                  {getInitials(testimonial.author.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              {renderAuthorName()}
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onApprove?.(testimonial.id)}
              >
                <Heart 
                  className={`h-5 w-5 ${
                    testimonial.approved 
                      ? "text-red-500 fill-current" 
                      : "text-gray-300"
                  }`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(testimonial.id)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <StarRating rating={testimonial.rating} readonly />
        </div>

        <p className="mt-4 text-[#292929]">{testimonial.text}</p>

        <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
          <div className="flex flex-wrap gap-2">
            {testimonial.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-[#292929]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-[#292929]">{formattedDate}</div>
        </div>
      </CardContent>
    </Card>
  );
};
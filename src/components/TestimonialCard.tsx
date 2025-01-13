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
    image?: string;
  };
  author_photo?: string | null;
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
  const formattedDate = new Date(testimonial.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle all possible photo cases
  const getPhotoUrl = () => {
    console.log('Raw author_photo:', testimonial.author_photo); // Debug log
    
    if (testimonial.author_photo && typeof testimonial.author_photo === 'string') {
      // If we have a base64 photo from the database, make sure it's properly formatted
      if (!testimonial.author_photo.startsWith('data:image')) {
        return `data:image/jpeg;base64,${testimonial.author_photo}`;
      }
      return testimonial.author_photo;
    } else if (testimonial.author.image) {
      // If we have a URL from the author profile
      return testimonial.author.image;
    }
    return ''; // Return empty string if no photo available
  };

  const photoUrl = getPhotoUrl();
  console.log('Final photo URL:', photoUrl); // Debug log

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={photoUrl}
                alt={testimonial.author.name}
              />
              <AvatarFallback>
                {testimonial.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{testimonial.author.name}</div>
              {testimonial.author.social && (
                <a
                  href={testimonial.author.social}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Social Profile
                </a>
              )}
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

        <p className="mt-4 text-gray-600">{testimonial.text}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {testimonial.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500">{formattedDate}</div>
      </CardContent>
    </Card>
  );
};
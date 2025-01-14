import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Heart } from "lucide-react";

function analyzeBase64Image(base64String: string | undefined | null) {
  if (!base64String) {
    console.error("Base64 string is empty or undefined!");
    return false;
  }
  
  // Log the raw value for debugging
  console.log("Raw base64 string:", base64String);
  
  const [header, content] = base64String.split(",");
  console.log("Base64 header:", header);
  console.log("Base64 content length:", content?.length || 0);
  
  if (!header.startsWith("data:image")) {
    console.error("Base64 string is not a valid image:", header);
    return false;
  }
  return true;
}

export interface Testimonial {
  id: string;
  author: {
    name: string;
    email: string;
    social?: string;
    image?: string;
  };
  author_photo?: string;
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
    month: "long",
    day: "numeric",
  });

  // Log the raw author_photo value
  console.log(`Raw author_photo for ${testimonial.author.name}:`, testimonial.author_photo);

  // Improved base64 image validation with detailed type checking
  const isValidBase64Photo = testimonial.author_photo?.match(/^data:image\/(png|jpeg|jpg|gif);base64,/);

  // Advanced debugging with type information
  if (testimonial.author_photo) {
    console.log(`Analyzing photo for ${testimonial.author.name}:`);
    console.log("Type:", typeof testimonial.author_photo);
    console.log("Length:", testimonial.author_photo.length);
    analyzeBase64Image(testimonial.author_photo);
  } else {
    console.warn(`No photo data for ${testimonial.author.name}`);
  }

  if (!isValidBase64Photo) {
    console.warn(`Rendering fallback for ${testimonial.author.name} due to invalid photo format`);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {isValidBase64Photo && !imageLoadError ? (
                <AvatarImage
                  src={testimonial.author_photo}
                  alt={testimonial.author.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.error("Error loading image for", testimonial.author.name, ":", e);
                    setImageLoadError(true);
                  }}
                />
              ) : (
                <AvatarFallback>
                  {testimonial.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
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
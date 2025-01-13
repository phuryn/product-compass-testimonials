import { useState } from "react";
import { StarRating } from "./StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatDate } from "@/utils/dateUtils";

export interface Testimonial {
  id: string;
  author: {
    name: string;
    image?: string;
    email: string;
    social?: string;
  };
  rating: number;
  text: string;
  date: string;
  tags: string[];
  approved?: boolean;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const TestimonialCard = ({
  testimonial,
  isAdmin = false,
  onApprove,
  onEdit,
}: TestimonialCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const needsExpansion = testimonial.text.length > maxLength;

  const displayText = needsExpansion && !isExpanded
    ? `${testimonial.text.slice(0, maxLength)}...`
    : testimonial.text;

  const AuthorName = () => {
    if (testimonial.author.social) {
      return (
        <a
          href={testimonial.author.social}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {testimonial.author.name}
        </a>
      );
    }
    return <span>{testimonial.author.name}</span>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage 
            src={testimonial.author.image} 
            alt={testimonial.author.name}
            className="object-cover"
          />
          <AvatarFallback>
            {testimonial.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold">
            <AuthorName />
          </h3>
          <StarRating rating={testimonial.rating} readonly />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          {displayText}
          {needsExpansion && !isExpanded && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="px-1 text-primary"
                  onClick={() => setIsExpanded(true)}
                >
                  Show more
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={testimonial.author.image} 
                        alt={testimonial.author.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {testimonial.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        <AuthorName />
                      </h3>
                      <StarRating rating={testimonial.rating} readonly />
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.text}</p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {testimonial.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{formatDate(testimonial.date)}</span>
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onApprove?.(testimonial.id)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    testimonial.approved ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(testimonial.id)}
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
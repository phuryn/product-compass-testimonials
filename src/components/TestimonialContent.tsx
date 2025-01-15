import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_TAGS } from "@/constants/testimonials";

interface TestimonialContentProps {
  rating: number;
  text: string;
  tag: string;
  onRatingChange: (rating: number) => void;
  onTextChange: (text: string) => void;
  onTagChange: (tag: string) => void;
}

const MAX_CHARS = 1200;

export const TestimonialContent = ({
  rating,
  text,
  tag,
  onRatingChange,
  onTextChange,
  onTagChange,
}: TestimonialContentProps) => {
  const handleTextChange = (value: string) => {
    if (value.length <= MAX_CHARS) {
      onTextChange(value);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Rating</Label>
        <StarRating rating={rating} onChange={onRatingChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag" className="after:content-['*'] after:ml-0.5 after:text-red-500">
          What product did you use?
        </Label>
        <Select value={tag} onValueChange={onTagChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select what you used" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_TAGS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="testimonial" className="after:content-['*'] after:ml-0.5 after:text-red-500">
          Your testimonial
        </Label>
        <div className="text-sm text-muted-foreground mb-2">
          What's your situation? Are you a PM? How has my offer helped you? What was the best thing about my offer?
        </div>
        <Textarea
          id="testimonial"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Share your experience..."
          className="min-h-[150px]"
          required
          maxLength={MAX_CHARS}
        />
        <div className="text-sm text-muted-foreground text-right">
          {text.length}/{MAX_CHARS} characters
        </div>
      </div>
    </>
  );
};
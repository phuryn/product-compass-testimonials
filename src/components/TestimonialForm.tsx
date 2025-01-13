import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestimonialFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const AVAILABLE_TAGS = [
  "Continuous Product Discovery",
  "From Strategy to Objectives",
  "Product Innovation",
  "Other",
] as const;

export const TestimonialForm = ({
  onSubmit,
  onCancel,
  initialData,
}: TestimonialFormProps) => {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 5,
    text: initialData?.text || "",
    name: initialData?.author?.name || "",
    email: initialData?.author?.email || "",
    social: initialData?.author?.social || "",
    permission: initialData?.permission || false,
    tag: initialData?.tags?.[0] || AVAILABLE_TAGS[0],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.author?.image || ""
  );
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = initialData?.author?.image || "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("author-photos")
        .upload(fileName, imageFile);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("author-photos").getPublicUrl(fileName);
      imageUrl = publicUrl;
    }

    const submissionData = {
      ...formData,
      author: {
        name: formData.name,
        email: formData.email,
        social: formData.social,
        image: imageUrl,
      },
      tags: [formData.tag],
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Rating</Label>
          <StarRating
            rating={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimonial">Your Testimonial</Label>
          <Textarea
            id="testimonial"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Share your experience..."
            className="min-h-[150px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag">Category</Label>
          <Select
            value={formData.tag}
            onValueChange={(value) => setFormData({ ...formData, tag: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
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
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Your Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social">Your Social Link (e.g. LinkedIn)</Label>
          <Input
            id="social"
            value={formData.social}
            onChange={(e) => setFormData({ ...formData, social: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Your Photo</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={imagePreview} alt={formData.name} />
              <AvatarFallback>
                {formData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="max-w-[300px]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="permission"
            checked={formData.permission}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, permission: checked })
            }
          />
          <Label htmlFor="permission" className="text-sm">
            I give permission to use this testimonial across social channels and
            other marketing efforts
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};
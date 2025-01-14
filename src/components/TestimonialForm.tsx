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
    initialData?.author_photo || ""
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

  const uploadImage = async (file: File): Promise<string | null> => {
    console.log('Starting image upload...'); // Debug log
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    // Create a new File object with a sanitized name
    const sanitizedFile = new File([file], fileName, { type: file.type });
    
    console.log('Uploading file:', fileName); // Debug log
    const { data, error } = await supabase.storage
      .from('author-photos')
      .upload(fileName, sanitizedFile);

    if (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('author-photos')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl); // Debug log
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let photoUrl = initialData?.author_photo || null;

    if (imageFile) {
      try {
        photoUrl = await uploadImage(imageFile);
        if (!photoUrl) return;
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive",
        });
        return;
      }
    }

    const submissionData = {
      ...formData,
      author: {
        name: formData.name,
        email: formData.email,
        social: formData.social,
      },
      author_photo: photoUrl,
      tags: [formData.tag],
    };

    console.log('Submitting testimonial with data:', submissionData); // Debug log
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
          <Label htmlFor="tag" className="after:content-['*'] after:ml-0.5 after:text-red-500">
            What Do You Recommend?
          </Label>
          <Select
            value={formData.tag}
            onValueChange={(value) => setFormData({ ...formData, tag: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select what you recommend" />
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
            Your Testimonial
          </Label>
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
          <Label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-red-500">
            Your Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-500">
            Your Email
          </Label>
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
              <AvatarImage 
                src={imagePreview} 
                alt={formData.name} 
                className="object-cover"
              />
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
              setFormData({ ...formData, permission: checked as boolean })
            }
            required
          />
          <Label htmlFor="permission" className="text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
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
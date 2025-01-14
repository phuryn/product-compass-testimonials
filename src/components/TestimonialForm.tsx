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
import { AVAILABLE_TAGS } from "@/constants/testimonials";

interface TestimonialFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isAdmin?: boolean;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 800; // Maximum width or height in pixels

export const TestimonialForm = ({
  onSubmit,
  onCancel,
  initialData,
  isAdmin = false,
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
    initialData?.author?.photo || ""
  );
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height && width > MAX_IMAGE_DIMENSION) {
          height = (height * MAX_IMAGE_DIMENSION) / width;
          width = MAX_IMAGE_DIMENSION;
        } else if (height > MAX_IMAGE_DIMENSION) {
          width = (width * MAX_IMAGE_DIMENSION) / height;
          height = MAX_IMAGE_DIMENSION;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.8
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      try {
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, {
          type: 'image/jpeg',
        });
        setImageFile(compressedFile);
        const preview = URL.createObjectURL(compressedBlob);
        setImagePreview(preview);
      } catch (error) {
        console.error('Error compressing image:', error);
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive",
        });
      }
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = 'jpg'; // Always jpg after compression
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const sanitizedFile = new File([file], fileName, { type: 'image/jpeg' });
    
    const { error: uploadError } = await supabase.storage
      .from('author-photos')
      .upload(fileName, sanitizedFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }

    // Get the public URL after successful upload
    const { data } = supabase.storage
      .from('author-photos')
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully. URL:', data.publicUrl);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let photoUrl = initialData?.author?.photo || null;

    if (imageFile) {
      photoUrl = await uploadImage(imageFile);
      if (!photoUrl) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        return;
      }
      console.log('Photo URL to be saved:', photoUrl);
    }

    const submissionData = {
      ...formData,
      author: {
        name: formData.name,
        email: formData.email,
        social: formData.social,
        photo: photoUrl,
      },
      tags: [formData.tag],
    };

    console.log('Submitting testimonial with data:', submissionData);
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
            What product did you use?
          </Label>
          <Select
            value={formData.tag}
            onValueChange={(value) => setFormData({ ...formData, tag: value })}
            required
          >
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
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Share your experience..."
            className="min-h-[150px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-red-500">
            Your full name
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
            Your email (only for me)
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
          <Label htmlFor="social">Your social link (e.g. LinkedIn)</Label>
          <Input
            id="social"
            value={formData.social}
            onChange={(e) => setFormData({ ...formData, social: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Your profile picture</Label>
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
              className="max-w-[300px] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        </div>

        {!isAdmin && (
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
        )}
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
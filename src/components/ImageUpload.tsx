import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (url: string | null) => void;
  userName: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const TARGET_SIZE = 48; // Changed from 128 to 48 pixels

export const ImageUpload = ({ initialImage, onImageChange, userName }: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string>(initialImage || "");
  const { toast } = useToast();

  const compressAndCropImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = TARGET_SIZE;
        canvas.height = TARGET_SIZE;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate dimensions for center cropping
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        
        // Draw the image with center cropping
        ctx.drawImage(
          img,
          startX, startY, size, size, // Source rectangle
          0, 0, TARGET_SIZE, TARGET_SIZE // Destination rectangle
        );
        
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

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const sanitizedFile = new File([file], fileName, { type: 'image/jpeg' });
    
    const { error: uploadError, data } = await supabase.storage
      .from('author-photos')
      .upload(fileName, sanitizedFile);

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('author-photos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
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
        const compressedBlob = await compressAndCropImage(file);
        const compressedFile = new File([compressedBlob], file.name, {
          type: 'image/jpeg',
        });
        
        const preview = URL.createObjectURL(compressedBlob);
        setImagePreview(preview);
        
        const photoUrl = await uploadImage(compressedFile);
        onImageChange(photoUrl);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="photo">Your profile picture</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage 
            src={imagePreview} 
            alt={userName} 
            className="object-cover"
          />
          <AvatarFallback>
            {userName.charAt(0).toUpperCase()}
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
  );
};
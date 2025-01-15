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
const TARGET_SIZE = 96; // Changed from 48 to 96 pixels

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
    try {
      const fileExt = 'jpg';
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const sanitizedFile = new File([file], fileName, { type: 'image/jpeg' });
      
      console.log('Attempting to upload file:', fileName);
      
      const { error: uploadError, data } = await supabase.storage
        .from('author-photos')
        .upload(fileName, sanitizedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Error",
          description: "Failed to upload image: " + uploadError.message,
          variant: "destructive",
        });
        return null;
      }

      console.log('Upload successful, getting public URL');
      const { data: urlData } = supabase.storage
        .from('author-photos')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Unexpected error during upload:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      });
      return null;
    }
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
        console.log('Processing image...');
        const compressedBlob = await compressAndCropImage(file);
        const compressedFile = new File([compressedBlob], file.name, {
          type: 'image/jpeg',
        });
        
        const preview = URL.createObjectURL(compressedBlob);
        setImagePreview(preview);
        
        console.log('Uploading processed image...');
        const photoUrl = await uploadImage(compressedFile);
        if (photoUrl) {
          console.log('Upload successful, URL:', photoUrl);
          onImageChange(photoUrl);
        }
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="photo" className="text-base font-medium">Your profile picture</Label>
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border-2 border-gray-100">
          <AvatarImage 
            src={imagePreview} 
            alt={userName} 
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-semibold">
            {userName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:bg-gray-200 file:text-gray-700 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-gray-300 file:transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
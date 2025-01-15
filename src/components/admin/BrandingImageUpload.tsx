import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBranding } from "@/hooks/useBranding";
import { useQueryClient } from "@tanstack/react-query";

interface BrandingImageUploadProps {
  imageKey: string;
  label: string;
  description: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const BrandingImageUpload = ({ imageKey, label, description }: BrandingImageUploadProps) => {
  const { data: branding } = useBranding();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError, data } = await supabase.storage
        .from('branding-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('branding-assets')
        .getPublicUrl(fileName);

      // Update branding record
      const { error: updateError } = await supabase
        .from('branding')
        .update({ value: urlData.publicUrl })
        .eq('key', imageKey);

      if (updateError) throw updateError;

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadImage(file);
      queryClient.invalidateQueries({ queryKey: ['branding'] });
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={imageKey}>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center gap-6 mt-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={branding?.[imageKey]} alt={label} />
          <AvatarFallback>IMG</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <input
            id={imageKey}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
            className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:rounded-md file:bg-zinc-600 file:text-white hover:file:bg-zinc-700 file:transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
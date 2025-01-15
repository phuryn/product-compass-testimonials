import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBranding } from "@/hooks/useBranding";

interface ImageUploadProps {
  initialImage?: string | null;
  onImageChange: (url: string | null) => void;
  userName: string;
}

export const ImageUpload = ({
  initialImage,
  onImageChange,
  userName,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { data: branding } = useBranding();
  const primaryColor = branding?.primary_color || '#2e75a9'; // Fallback color

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const randomId = crypto.randomUUID();
      const filePath = `${randomId}.${fileExt}`;

      console.log("Uploading file:", filePath);

      const { error: uploadError, data } = await supabase.storage
        .from("author-photos")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      console.log("Upload successful:", data);

      const {
        data: { publicUrl },
      } = supabase.storage.from("author-photos").getPublicUrl(filePath);

      console.log("Public URL:", publicUrl);

      onImageChange(publicUrl);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={initialImage || undefined}
            alt={userName}
            className="object-cover"
          />
          <AvatarFallback 
            style={{ backgroundColor: primaryColor }} 
            className="text-primary-foreground text-lg font-semibold"
          >
            {userName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer file:transition-colors file:text-primary-foreground`}
            style={{
              ['--tw-file-bg' as string]: primaryColor,
              ['--tw-file-hover-bg' as string]: `${primaryColor}dd`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
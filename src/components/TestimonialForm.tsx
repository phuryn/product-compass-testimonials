import { Button } from "@/components/ui/button";
import { AuthorFields } from "@/components/AuthorFields";
import { PermissionCheckbox } from "@/components/testimonials/PermissionCheckbox";
import { useTestimonialForm } from "@/hooks/useTestimonialForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormActions } from "@/components/admin/FormActions";
import { TestimonialContent } from "@/components/TestimonialContent";
import { ImageUpload } from "@/components/ImageUpload";

interface TestimonialFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export const TestimonialForm = ({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  isAdmin = false,
}: TestimonialFormProps) => {
  console.log("Initializing TestimonialForm with data:", initialData);
  
  const { formData, handleInputChange } = useTestimonialForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <TestimonialContent
          rating={formData.rating}
          text={formData.text}
          tag={formData.tag}
          onRatingChange={(rating) => handleInputChange("rating", rating)}
          onTextChange={(text) => handleInputChange("text", text)}
          onTagChange={(tag) => handleInputChange("tag", tag)}
        />

        <AuthorFields
          name={formData.name}
          email={formData.email}
          social={formData.social}
          onChange={(field, value) => handleInputChange(field, value)}
        />

        <ImageUpload
          initialImage={formData.photo}
          onImageChange={(url) => handleInputChange("photo", url)}
          userName={formData.name}
        />

        {!isAdmin && (
          <PermissionCheckbox
            checked={formData.permission}
            onCheckedChange={(checked) => handleInputChange("permission", checked)}
          />
        )}
      </div>

      <FormActions onCancel={onCancel} onDelete={onDelete} isAdmin={isAdmin} />
    </form>
  );
};
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { AuthorFields } from "@/components/AuthorFields";
import { PermissionCheckbox } from "@/components/testimonials/PermissionCheckbox";
import { useTestimonialForm } from "@/hooks/useTestimonialForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormActions } from "@/components/admin/FormActions";

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
  
  const { formData, handleInputChange, getSubmissionData } =
    useTestimonialForm(initialData);

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      console.log("Fetching tags");
      const { data, error } = await supabase.from("tags").select("name");
      if (error) throw error;
      console.log("Fetched tags:", data);
      return data || [];
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = getSubmissionData();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <StarRating
          rating={formData.rating}
          onRatingChange={(rating) => handleInputChange("rating", rating)}
        />

        <Textarea
          placeholder="Share your experience..."
          value={formData.text}
          onChange={(e) => handleInputChange("text", e.target.value)}
          required
        />

        <Select
          value={formData.tag}
          onValueChange={(value) => handleInputChange("tag", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a tag" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag.name} value={tag.name}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AuthorFields
          name={formData.name}
          email={formData.email}
          social={formData.social}
          photo={formData.photo}
          onNameChange={(value) => handleInputChange("name", value)}
          onEmailChange={(value) => handleInputChange("email", value)}
          onSocialChange={(value) => handleInputChange("social", value)}
          onPhotoChange={(value) => handleInputChange("photo", value)}
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
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { AuthorFields } from "./AuthorFields";
import { TestimonialContent } from "./TestimonialContent";
import { triggerConfetti } from "@/utils/confetti";
import { FormActions } from "./admin/FormActions";
import { PermissionCheckbox } from "./testimonials/PermissionCheckbox";
import { useTestimonialForm } from "@/hooks/useTestimonialForm";

interface TestimonialFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
  initialData?: any;
  isAdmin?: boolean;
}

export const TestimonialForm = ({
  onSubmit,
  onCancel,
  onDelete,
  initialData,
  isAdmin = false,
}: TestimonialFormProps) => {
  const { formData, handleAuthorFieldChange, handleChange, getSubmissionData } = useTestimonialForm(initialData);
  
  console.log("Initializing TestimonialForm with data:", initialData);
  console.log("Initial form data state:", formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = getSubmissionData();
    console.log('Complete testimonial data being submitted:', submissionData);
    await onSubmit(submissionData);
    triggerConfetti();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <TestimonialContent
          rating={formData.rating}
          text={formData.text}
          tag={formData.tag}
          onRatingChange={(rating) => handleChange('rating', rating)}
          onTextChange={(text) => handleChange('text', text)}
          onTagChange={(tag) => handleChange('tag', tag)}
        />

        <AuthorFields
          name={formData.name}
          email={formData.email}
          social={formData.social}
          onChange={handleAuthorFieldChange}
        />

        <ImageUpload
          initialImage={formData.photo}
          onImageChange={(url) => handleChange('photo', url)}
          userName={formData.name}
        />

        {!isAdmin && (
          <PermissionCheckbox
            checked={formData.permission}
            onCheckedChange={(checked) => handleChange('permission', checked)}
          />
        )}
      </div>

      <FormActions
        isAdmin={isAdmin}
        onDelete={onDelete}
        onCancel={onCancel}
      />
    </form>
  );
};
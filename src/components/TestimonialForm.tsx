import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { AuthorFields } from "./AuthorFields";
import { TestimonialContent } from "./TestimonialContent";
import { AVAILABLE_TAGS } from "@/constants/testimonials";
import { triggerConfetti } from "@/utils/confetti";
import { useBranding } from "@/hooks/useBranding";

interface TestimonialFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isAdmin?: boolean;
}

export const TestimonialForm = ({
  onSubmit,
  onCancel,
  initialData,
  isAdmin = false,
}: TestimonialFormProps) => {
  const { data: branding } = useBranding();
  const primaryColor = branding?.primary_color || '#2e75a9'; // Fallback color
  
  console.log("Initializing TestimonialForm with data:", initialData);
  
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 5,
    text: initialData?.text || "",
    name: initialData?.author?.name || "",
    email: initialData?.author?.email || "",
    social: initialData?.author?.social || "",
    permission: initialData?.permission || false,
    tag: initialData?.tags?.[0] || AVAILABLE_TAGS[0],
    photo: initialData?.author?.photo || null,
  });

  console.log("Initial form data state:", formData);

  const handleAuthorFieldChange = (field: string, value: string) => {
    console.log("Author field change:", { field, value });
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const authorData = {
      name: formData.name,
      email: formData.email,
      social: formData.social,
      photo: formData.photo,
    };

    console.log('Author data to be submitted:', authorData);
    console.log('Photo URL in submission:', formData.photo);

    const submissionData = {
      rating: formData.rating,
      text: formData.text,
      author: authorData,
      tags: [formData.tag],
      permission: formData.permission,
    };

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
          onRatingChange={(rating) => {
            console.log("Rating changed to:", rating);
            setFormData((prev) => ({ ...prev, rating }));
          }}
          onTextChange={(text) => {
            console.log("Text changed, length:", text.length);
            setFormData((prev) => ({ ...prev, text }));
          }}
          onTagChange={(tag) => {
            console.log("Tag changed to:", tag);
            setFormData((prev) => ({ ...prev, tag }));
          }}
        />

        <AuthorFields
          name={formData.name}
          email={formData.email}
          social={formData.social}
          onChange={handleAuthorFieldChange}
        />

        <ImageUpload
          initialImage={formData.photo}
          onImageChange={(url) => {
            console.log("Image URL updated:", url);
            setFormData((prev) => ({ ...prev, photo: url }));
          }}
          userName={formData.name}
        />

        {!isAdmin && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permission"
              checked={formData.permission}
              onCheckedChange={(checked) => {
                console.log("Permission changed to:", checked);
                setFormData((prev) => ({ ...prev, permission: checked as boolean }));
              }}
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
        <Button 
          type="submit"
          style={{ backgroundColor: primaryColor }}
          className="text-primary-foreground hover:opacity-90"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

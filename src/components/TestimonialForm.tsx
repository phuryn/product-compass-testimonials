import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { AuthorFields } from "./AuthorFields";
import { TestimonialContent } from "./TestimonialContent";
import { AVAILABLE_TAGS } from "@/constants/testimonials";

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

  const handleAuthorFieldChange = (field: string, value: string) => {
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

    const submissionData = {
      rating: formData.rating,
      text: formData.text,
      author: authorData,
      tags: [formData.tag],
      permission: formData.permission,
    };

    console.log('Complete testimonial data being submitted:', submissionData);
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <TestimonialContent
          rating={formData.rating}
          text={formData.text}
          tag={formData.tag}
          onRatingChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
          onTextChange={(text) => setFormData((prev) => ({ ...prev, text }))}
          onTagChange={(tag) => setFormData((prev) => ({ ...prev, tag }))}
        />

        <AuthorFields
          name={formData.name}
          email={formData.email}
          social={formData.social}
          onChange={handleAuthorFieldChange}
        />

        <ImageUpload
          initialImage={formData.photo}
          onImageChange={(url) => setFormData((prev) => ({ ...prev, photo: url }))}
          userName={formData.name}
        />

        {!isAdmin && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permission"
              checked={formData.permission}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, permission: checked as boolean }))
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  rating: number;
  text: string;
  name: string;
  email: string;
  social: string;
  permission: boolean;
  tag: string;
  photo: string | null;
}

export const useTestimonialForm = (initialData?: any) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    rating: initialData?.rating || 5,
    text: initialData?.text || "",
    name: initialData?.author?.name || "",
    email: initialData?.author?.email || "",
    social: initialData?.author?.social || "",
    permission: initialData?.permission || false,
    tag: initialData?.tags?.[0] || "",
    photo: initialData?.author?.photo || null,
  });

  console.log("Initial form data state:", formData);

  const validateForm = () => {
    const requiredFields = {
      text: "Testimonial text",
      name: "Full name",
      email: "Email",
      tag: "Product used",
      permission: "Permission to use testimonial"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof FormData]) {
        toast({
          variant: "destructive",
          title: "Required Field Missing",
          description: `Please fill in the ${label} field.`
        });
        return false;
      }
    }

    if (!formData.permission) {
      toast({
        variant: "destructive",
        title: "Permission Required",
        description: "Please give permission to use your testimonial."
      });
      return false;
    }

    return true;
  };

  const getSubmissionData = () => {
    console.log("Getting submission data from form:", formData);
    
    if (!validateForm()) {
      return null;
    }
    
    const authorData = {
      name: formData.name,
      email: formData.email,
      social: formData.social || null,
      photo: formData.photo || null,
    };

    return {
      rating: formData.rating,
      text: formData.text,
      author: authorData,
      tags: [formData.tag],
      permission: formData.permission,
    };
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean | null
  ) => {
    console.log(`Updating form field ${field} with value:`, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    formData,
    handleInputChange,
    getSubmissionData,
  };
};
import { useState } from "react";

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

  const getSubmissionData = () => {
    console.log("Getting submission data from form:", formData);
    
    if (!formData.text || !formData.name || !formData.email || !formData.tag || !formData.permission) {
      throw new Error("Please fill in all required fields");
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
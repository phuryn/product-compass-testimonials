import { useState } from "react";
import { AVAILABLE_TAGS } from "@/constants/testimonials";

export const useTestimonialForm = (initialData?: any) => {
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
    console.log("Author field change:", { field, value });
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (field: string, value: any) => {
    console.log(`${field} changed to:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getSubmissionData = () => {
    console.log("Getting submission data from form:", formData);
    
    const authorData = {
      name: formData.name,
      email: formData.email,
      social: formData.social || null,
      photo: formData.photo || null,
    };

    // Ensure tag is a string, not a tag object
    const tag = typeof formData.tag === 'string' ? formData.tag : formData.tag.name;

    return {
      rating: formData.rating,
      text: formData.text,
      author: authorData,
      tags: [tag], // Ensure tags is always an array of strings
      permission: formData.permission,
    };
  };

  return {
    formData,
    handleAuthorFieldChange,
    handleChange,
    getSubmissionData,
  };
};
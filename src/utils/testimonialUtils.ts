import { Database } from "@/integrations/supabase/types";
import { Testimonial } from "@/components/TestimonialCard";

type DbTestimonial = Database['public']['Tables']['testimonials']['Row'];

export const convertDbTestimonialToTestimonial = (dbTestimonial: DbTestimonial): Testimonial => {
  const author = dbTestimonial.author as any;
  return {
    id: dbTestimonial.id,
    author: {
      name: author.name || '',
      email: author.email || '',
      social: author.social || '',
      image: author.image || undefined,
    },
    rating: dbTestimonial.rating,
    text: dbTestimonial.text,
    date: dbTestimonial.date || new Date().toISOString(),
    tags: dbTestimonial.tags || [],
    approved: dbTestimonial.approved || false,
  };
};
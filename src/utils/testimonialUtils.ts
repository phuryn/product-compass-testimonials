import { Database } from "@/integrations/supabase/types";
import { Testimonial } from "@/components/TestimonialCard";

type DbTestimonial = Database['public']['Tables']['testimonials']['Row'];

export const convertDbTestimonialToTestimonial = (dbTestimonial: DbTestimonial): Testimonial => {
  return {
    id: dbTestimonial.id,
    author: dbTestimonial.author as Testimonial['author'],
    rating: dbTestimonial.rating,
    text: dbTestimonial.text,
    date: dbTestimonial.date || new Date().toISOString(),
    tags: dbTestimonial.tags || [],
    approved: dbTestimonial.approved || false,
  };
};
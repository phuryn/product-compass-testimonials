import { TestimonialCard, type Testimonial } from "@/components/TestimonialCard";

interface TestimonialListProps {
  testimonials: Testimonial[];
}

export const TestimonialList = ({ testimonials }: TestimonialListProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {testimonials
        .filter((t: Testimonial) => t.approved)
        .map((testimonial: Testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
          />
        ))}
    </div>
  );
};
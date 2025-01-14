import Masonry from 'react-masonry-css';
import { TestimonialCard, type Testimonial } from "@/components/TestimonialCard";

interface TestimonialListProps {
  testimonials: Testimonial[];
}

export const TestimonialList = ({ testimonials }: TestimonialListProps) => {
  const breakpointColumns = {
    default: 2,
    1100: 2,
    700: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-6 w-auto"
      columnClassName="pl-6 bg-clip-padding"
    >
      {testimonials
        .filter((t: Testimonial) => t.approved)
        .map((testimonial: Testimonial) => (
          <div key={testimonial.id} className="mb-6">
            <TestimonialCard
              testimonial={testimonial}
            />
          </div>
        ))}
    </Masonry>
  );
};
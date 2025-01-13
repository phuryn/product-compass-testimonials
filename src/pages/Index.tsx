import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TestimonialCard, type Testimonial } from "@/components/TestimonialCard";
import { TestimonialForm } from "@/components/TestimonialForm";
import { useToast } from "@/components/ui/use-toast";

// Temporary mock data
const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    author: {
      name: "Illia",
      email: "iliadyga98@gmail.com",
      social: "www.linkedin.com/in/illia-ladyha?trk=contact-info",
    },
    rating: 5,
    text: "Amazing course, a great addition to Pawel's Substack",
    date: "Dec 31, 2024",
    tags: ["FS2O"],
    approved: true,
  },
  // Add more mock testimonials as needed
];

const Index = () => {
  const [testimonials] = useState<Testimonial[]>(mockTestimonials);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitTestimonial = (data: any) => {
    // Here you would typically send the data to your backend
    console.log("Submitted testimonial:", data);
    setIsFormOpen(false);
    toast({
      title: "Thank you for your testimonial!",
      description: "We'll review it and publish it soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full">
            <img
              src="/lovable-uploads/b3f29f81-e76c-4a95-8ef7-e90a5987df1d.png"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold">
            Would you like to recommend my content?
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Hi there! I would be thrilled if you could take a moment to leave me a
            testimonial.
          </p>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="mr-4">
                Send in text
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <TestimonialForm
                onSubmit={handleSubmitTestimonial}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {testimonials
            .filter((t) => t.approved)
            .map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TestimonialCard, type Testimonial } from "@/components/TestimonialCard";
import { TestimonialForm } from "@/components/TestimonialForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convertDbTestimonialToTestimonial } from "@/utils/testimonialUtils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order('date', { ascending: false });

      if (error) throw error;
      return data?.map(convertDbTestimonialToTestimonial) || [];
    },
  });

  const submitTestimonialMutation = useMutation({
    mutationFn: async (formData: any) => {
      const testimonialData = {
        author: {
          name: formData.author.name,
          email: formData.author.email,
          social: formData.author.social,
          photo: formData.author.photo,
        },
        rating: formData.rating || 5,
        text: formData.text,
        tags: formData.tags,
      };

      const { data, error } = await supabase
        .from("testimonials")
        .insert([testimonialData])
        .select()
        .single();

      if (error) throw error;
      return convertDbTestimonialToTestimonial(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setIsFormOpen(false);
      toast({
        title: "Thank you for your testimonial!",
        description: "We'll review it and publish it soon.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
      });
    },
  });

  if (isLoading) {
    return <div>Loading testimonials...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container py-8 flex-grow">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage
                src="/lovable-uploads/38757e69-417d-4b2f-8d5a-6ff4a1d96c6b.png"
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
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
            <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
              <TestimonialForm
                onSubmit={(data) => submitTestimonialMutation.mutate(data)}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

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
      </div>

      <footer className="bg-gray-50 py-12 mt-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.productcompass.pm/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    The Product Compass Newsletter
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/pawel-huryn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Courses</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.productcompass.pm/p/cpdm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Continuous Product Discovery Masterclass
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.productcompass.pm/p/product-vision-strategy-objectives-course" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    From Strategy to Objectives Masterclass
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.productcompass.pm/p/product-innovation-masterclass" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Product Innovation Masterclass
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
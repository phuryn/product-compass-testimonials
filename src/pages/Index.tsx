import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TestimonialCard, type Testimonial } from "@/components/TestimonialCard";
import { TestimonialForm } from "@/components/TestimonialForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", "public"],
    queryFn: async () => {
      console.log("Fetching public testimonials...");
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched testimonials:", data);
      return data || [];
    },
  });

  const submitTestimonialMutation = useMutation({
    mutationFn: async (formData: any) => {
      const testimonialData = {
        author: {
          name: formData.name,
          email: formData.email,
          social: formData.social,
        },
        rating: formData.rating,
        text: formData.text,
        tags: ["FS2O"], // Default tag, could be made dynamic
      };

      const { data, error } = await supabase
        .from("testimonials")
        .insert([testimonialData])
        .select()
        .single();

      if (error) throw error;
      return data;
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
      console.error("Error submitting testimonial:", error);
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
                onSubmit={(data) => submitTestimonialMutation.mutate(data)}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
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
    </div>
  );
};

export default Index;
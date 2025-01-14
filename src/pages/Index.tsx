import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convertDbTestimonialToTestimonial } from "@/utils/testimonialUtils";
import { PageHeader } from "@/components/layout/PageHeader";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", "public"],
    queryFn: async () => {
      console.log("Fetching approved testimonials");
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq('approved', true);

      if (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
      }
      
      console.log("Fetched testimonials:", data);
      return data?.map(convertDbTestimonialToTestimonial) || [];
    },
  });

  const submitTestimonialMutation = useMutation({
    mutationFn: async (formData: any) => {
      console.log("Submitting testimonial:", formData);
      const testimonialData = {
        author: {
          name: formData.author.name,
          email: formData.author.email,
          social: formData.author.social || null,
          photo: formData.author.photo || null,
        },
        rating: formData.rating,
        text: formData.text,
        tags: formData.tags,
        approved: false,
        date: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("testimonials")
        .insert([testimonialData])
        .select()
        .single();

      if (error) {
        console.error("Error submitting testimonial:", error);
        throw error;
      }

      console.log("Testimonial submitted successfully:", data);
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
      console.error("Mutation error:", error);
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
      <Navigation />
      <div className="container max-w-5xl px-4 sm:px-6 py-8 flex-grow">
        <PageHeader 
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          onSubmitTestimonial={(data) => submitTestimonialMutation.mutate(data)}
        />
        <TestimonialList testimonials={testimonials} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
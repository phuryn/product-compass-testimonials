import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convertDbTestimonialToTestimonial } from "@/utils/testimonialUtils";
import { PageHeader } from "@/components/layout/PageHeader";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { Footer } from "@/components/layout/Footer";

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
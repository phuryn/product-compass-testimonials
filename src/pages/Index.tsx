import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { convertDbTestimonialToTestimonial } from "@/utils/testimonialUtils";
import { PageHeader } from "@/components/layout/PageHeader";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

const TESTIMONIALS_PER_PAGE = 10;

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log("Rendering Index component"); // Debug log

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error // Add error to check for any issues
  } = useInfiniteQuery({
    queryKey: ["testimonials", "public"],
    queryFn: async ({ pageParam }) => {
      console.log("Fetching testimonials page:", pageParam);
      const from = Number(pageParam) * TESTIMONIALS_PER_PAGE;
      const to = from + TESTIMONIALS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq('approved', true)
        .range(from, to)
        .order('date', { ascending: false });

      if (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
      }
      
      console.log("Fetched testimonials:", data);
      return {
        testimonials: data?.map(convertDbTestimonialToTestimonial) || [],
        nextPage: data?.length === TESTIMONIALS_PER_PAGE ? Number(pageParam) + 1 : undefined
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
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

  // Add error handling
  if (error) {
    console.error("Query error:", error);
    return <div className="text-center p-4">Error loading testimonials. Please try again later.</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading testimonials...</div>;
  }

  const allTestimonials = data?.pages.flatMap(page => page.testimonials) || [];
  console.log("All testimonials:", allTestimonials); // Debug log

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container max-w-5xl px-4 sm:px-6 py-8 flex-grow">
        <PageHeader 
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          onSubmitTestimonial={(data) => submitTestimonialMutation.mutate(data)}
        />
        <TestimonialList 
          testimonials={allTestimonials}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
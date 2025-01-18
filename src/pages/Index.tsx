import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { convertDbTestimonialToTestimonial } from "@/utils/testimonialUtils";
import { PageHeader } from "@/components/layout/PageHeader";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { triggerConfetti } from "@/utils/confetti";
import { Toaster } from "@/components/ui/toaster";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TestimonialForm } from "@/components/TestimonialForm";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useBranding } from "@/hooks/useBranding";

const TESTIMONIALS_PER_PAGE = 10;

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: branding } = useBranding();
  const showTagsOnIndex = branding?.show_tags_on_index === "true";

  console.log("Rendering Index component");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ["testimonials", "public", selectedTag],
    queryFn: async ({ pageParam }) => {
      console.log("Fetching testimonials page:", pageParam);
      const from = Number(pageParam) * TESTIMONIALS_PER_PAGE;
      const to = from + TESTIMONIALS_PER_PAGE - 1;

      let query = supabase
        .from("testimonials")
        .select("*")
        .eq('approved', true)
        .range(from, to)
        .order('date', { ascending: false });

      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }

      const { data: testimonials, error } = await query;

      if (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
      }
      
      console.log("Fetched testimonials:", testimonials);
      return {
        testimonials: testimonials?.map(convertDbTestimonialToTestimonial) || [],
        nextPage: testimonials?.length === TESTIMONIALS_PER_PAGE ? Number(pageParam) + 1 : undefined
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const submitTestimonialMutation = useMutation({
    mutationFn: async (formData: any) => {
      console.log("Submitting testimonial with data:", formData);
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
      triggerConfetti();
      toast({
        title: "Thank you for your testimonial! 🎉",
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

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  if (error) {
    console.error("Query error:", error);
    return <div className="text-center p-4">Error loading testimonials. Please try again later.</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading testimonials...</div>;
  }

  const allTestimonials = data?.pages.flatMap(page => page.testimonials) || [];
  console.log("All testimonials:", allTestimonials);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container max-w-5xl px-4 sm:px-6 py-8 flex-grow">
        <PageHeader 
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          onSubmitTestimonial={(data) => submitTestimonialMutation.mutate(data)}
        />
        {showTagsOnIndex && selectedTag && (
          <div className="mb-6">
            <Badge 
              variant="secondary" 
              className="cursor-pointer flex items-center gap-1"
              onClick={() => setSelectedTag(null)}
            >
              {selectedTag}
              <X className="h-3 w-3" />
            </Badge>
          </div>
        )}
        <TestimonialList 
          testimonials={allTestimonials}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          onTagClick={showTagsOnIndex ? handleTagClick : undefined}
          selectedTag={selectedTag}
        />
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <TestimonialForm
            onSubmit={(data) => submitTestimonialMutation.mutate(data)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
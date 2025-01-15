import { useSearchParams } from "react-router-dom";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { convertDbTestimonialToTestimonial } from "@/utils/testimonialUtils";

const EmbedPage = () => {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag");

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", "embed", tag],
    queryFn: async () => {
      console.log("Fetching testimonials for embed, tag:", tag);
      let query = supabase
        .from("testimonials")
        .select("*")
        .eq("approved", true)
        .order("date", { ascending: false });

      if (tag) {
        query = query.contains("tags", [tag]);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
      }

      return data?.map(convertDbTestimonialToTestimonial) || [];
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading testimonials...</div>;
  }

  return (
    <div className="p-4 bg-background min-h-screen">
      <TestimonialList testimonials={testimonials} />
    </div>
  );
};

export default EmbedPage;
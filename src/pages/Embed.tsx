import { useSearchParams } from "react-router-dom";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { convertDbTestimonialToTestimonial } from "@/utils/testimonialUtils";
import { useEffect, useRef } from "react";

const EmbedPage = () => {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag");
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Send height updates to parent
  useEffect(() => {
    const sendHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        window.parent.postMessage({ type: 'resize', height }, '*');
      }
    };

    // Listen for resize requests from parent
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'requestResize') {
        sendHeight();
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Send initial height
    sendHeight();

    // Set up observer for content changes
    const observer = new MutationObserver(sendHeight);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage);
      observer.disconnect();
    };
  }, [testimonials]);

  if (isLoading) {
    return <div className="p-4">Loading testimonials...</div>;
  }

  return (
    <div ref={containerRef} className="p-4 bg-background">
      <TestimonialList testimonials={testimonials} />
    </div>
  );
};

export default EmbedPage;
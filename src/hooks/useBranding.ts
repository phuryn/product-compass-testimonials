import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBranding = () => {
  return useQuery({
    queryKey: ["branding"],
    queryFn: async () => {
      // Always fetch fresh data from Supabase
      const { data, error } = await supabase
        .from("branding")
        .select("*");

      if (error) {
        console.error("Error fetching branding:", error);
        throw error;
      }

      // Convert array of key-value pairs to an object
      const brandingObject = data.reduce((acc: Record<string, string>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      // Update localStorage with fresh data
      localStorage.setItem('branding', JSON.stringify(brandingObject));

      return brandingObject;
    },
    // Refetch data every 30 seconds to ensure updates are reflected
    refetchInterval: 30000,
    // Also refetch when window regains focus
    refetchOnWindowFocus: true,
    // Initialize with data from localStorage if available
    initialData: () => {
      const cachedBranding = localStorage.getItem('branding');
      if (cachedBranding) {
        return JSON.parse(cachedBranding);
      }
      return undefined;
    },
  });
};
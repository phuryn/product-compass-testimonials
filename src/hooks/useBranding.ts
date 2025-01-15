import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBranding = () => {
  return useQuery({
    queryKey: ["branding"],
    queryFn: async () => {
      // Try to get branding from localStorage first
      const cachedBranding = localStorage.getItem('branding');
      if (cachedBranding) {
        return JSON.parse(cachedBranding);
      }

      // If not in localStorage, fetch from Supabase
      const { data, error } = await supabase
        .from("branding")
        .select("*");

      if (error) throw error;

      // Convert array of key-value pairs to an object
      const brandingObject = data.reduce((acc: Record<string, string>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      // Cache the result
      localStorage.setItem('branding', JSON.stringify(brandingObject));

      return brandingObject;
    },
  });
};
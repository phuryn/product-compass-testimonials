import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      return data?.role;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else if (userRole !== "admin") {
        navigate("/");
      }
    }
  }, [user, userRole, isLoading, navigate]);

  if (isLoading || !user || userRole !== "admin") {
    return null;
  }

  return <>{children}</>;
};
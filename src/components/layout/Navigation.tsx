import { Link, useLocation } from "react-router-dom";
import { Home, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const { data: userRole } = useQuery({
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

  // Hide navigation for new users (login page)
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-background border-b mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                location.pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>
            {userRole === "admin" && (
              <Link 
                to="/admin" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  location.pathname === "/admin" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Admin</span>
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
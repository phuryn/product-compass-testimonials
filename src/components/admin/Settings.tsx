import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { TagManagement } from "./TagManagement";
import { ColorEditor } from "./ColorEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Settings = () => {
  const { user } = useAuth();

  const { data: adminUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          users:user_id(
            email
          )
        `)
        .eq('role', 'admin');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Admin Settings</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Admin Users</h3>
            <div className="space-y-2">
              {adminUsers?.map((admin) => (
                <p key={admin.user_id} className="text-sm text-muted-foreground">
                  {admin.users?.email}
                  {admin.user_id === user?.id && " (you)"}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Branding</h2>
        <ColorEditor />
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Tag Management</h2>
        <TagManagement />
      </Card>
    </div>
  );
};
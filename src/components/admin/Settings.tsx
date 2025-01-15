import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Admin Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Admin User</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
import { Card } from "@/components/ui/card";
import { TagManagement } from "./TagManagement";
import { ColorEditor } from "./ColorEditor";

export const Settings = () => {
  return (
    <div className="space-y-6">
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
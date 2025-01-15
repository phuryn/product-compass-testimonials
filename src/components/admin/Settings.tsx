import { Card } from "@/components/ui/card";
import { TagManagement } from "./TagManagement";
import { ColorEditor } from "./ColorEditor";
import { BrandingImageUpload } from "./BrandingImageUpload";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Branding</h2>
        <div className="space-y-8">
          <ColorEditor />
          <BrandingImageUpload
            imageKey="profile_picture"
            label="Profile Picture"
            description="This image appears at the top of your testimonials page."
          />
          <BrandingImageUpload
            imageKey="favicon"
            label="Favicon"
            description="This icon appears in browser tabs and bookmarks."
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Tag Management</h2>
        <TagManagement />
      </Card>
    </div>
  );
};
import { Card } from "@/components/ui/card";
import { TagManagement } from "./TagManagement";
import { ColorEditor } from "./ColorEditor";
import { BrandingImageUpload } from "./BrandingImageUpload";
import { TextEditor } from "./TextEditor";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Branding</h2>
        <div className="space-y-8">
          <ColorEditor />
          <TextEditor
            textKey="header_title"
            label="Header Title"
            description="The main title displayed at the top of your testimonials page."
          />
          <TextEditor
            textKey="header_subtitle"
            label="Header Subtitle"
            description="The subtitle text displayed below the main title."
          />
          <TextEditor
            textKey="footer_text"
            label="Footer Text"
            description="The text displayed in the footer of your site."
          />
          <TextEditor
            textKey="footer_url"
            label="Footer URL"
            description="The URL that the footer text links to."
          />
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
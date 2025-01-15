import { Card } from "@/components/ui/card";
import { ColorEditor } from "./ColorEditor";
import { BrandingImageUpload } from "./BrandingImageUpload";
import { TextEditor } from "./TextEditor";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Colors</h3>
        <Card className="p-6">
          <ColorEditor />
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Page Content</h3>
        <Card className="p-6">
          <div className="space-y-6">
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
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Images</h3>
        <Card className="p-6">
          <div className="space-y-6">
            <BrandingImageUpload
              imageKey="profile_picture"
              label="Profile Picture"
              description="This image appears at the top of your testimonials page and as a preview when sharing on social media."
            />
            <BrandingImageUpload
              imageKey="favicon"
              label="Favicon"
              description="This icon appears in browser tabs and bookmarks."
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestimonialManagement } from "@/components/admin/TestimonialManagement";
import { Settings } from "@/components/admin/Settings";
import { TagManagement } from "@/components/admin/TagManagement";
import { EmbedCodeGenerator } from "@/components/EmbedCodeGenerator";
import { Navigation } from "@/components/layout/Navigation";

const Admin = () => {
  return (
    <>
      <Navigation />
      <div className="container max-w-5xl px-4 sm:px-6 py-8">
        <Tabs defaultValue="testimonials">
          <TabsList>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>
          <TabsContent value="testimonials" className="mt-6">
            <TestimonialManagement />
          </TabsContent>
          <TabsContent value="tags" className="mt-6">
            <TagManagement />
          </TabsContent>
          <TabsContent value="branding" className="mt-6">
            <Settings />
          </TabsContent>
          <TabsContent value="embed" className="mt-6">
            <EmbedCodeGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Admin;
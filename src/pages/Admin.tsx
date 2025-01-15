import { Navigation } from "@/components/layout/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestimonialManagement } from "@/components/admin/TestimonialManagement";
import { Settings } from "@/components/admin/Settings";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container py-8">
        <Tabs defaultValue="testimonials" className="space-y-6">
          <TabsList>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="testimonials">
            <TestimonialManagement />
          </TabsContent>
          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
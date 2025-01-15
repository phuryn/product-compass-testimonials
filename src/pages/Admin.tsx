import { Navigation } from "@/components/layout/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestimonialManagement } from "@/components/admin/TestimonialManagement";
import { Settings } from "@/components/admin/Settings";
import { useBranding } from "@/hooks/useBranding";
import { Skeleton } from "@/components/ui/skeleton";

const Admin = () => {
  const { isLoading } = useBranding();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

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
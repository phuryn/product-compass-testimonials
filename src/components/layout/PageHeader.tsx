import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TestimonialForm } from "@/components/TestimonialForm";
import { useBranding } from "@/hooks/useBranding";
import { Skeleton } from "@/components/ui/skeleton";

interface PageHeaderProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  onSubmitTestimonial: (data: any) => void;
}

export const PageHeader = ({ isFormOpen, setIsFormOpen, onSubmitTestimonial }: PageHeaderProps) => {
  const { data: branding, isLoading } = useBranding();

  if (isLoading) {
    return (
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        </div>
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    );
  }

  return (
    <div className="mb-12 text-center">
      <div className="mx-auto mb-6">
        <Avatar className="h-24 w-24 mx-auto">
          <AvatarImage
            src={branding?.profile_picture}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback>{""}</AvatarFallback>
        </Avatar>
      </div>
      <h1 className="mb-4 text-4xl font-bold">
        {branding?.header_title || "Would you like to recommend my content?"}
      </h1>
      <p className="mb-8 text-xl text-gray-600">
        {branding?.header_subtitle || "Hi there! I would be thrilled if you could take a moment to leave me a testimonial."}
      </p>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="mr-4"
            style={{ backgroundColor: branding?.primary_color }}
          >
            Send in text
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
          <TestimonialForm
            onSubmit={onSubmitTestimonial}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
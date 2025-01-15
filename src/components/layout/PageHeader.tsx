import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TestimonialForm } from "@/components/TestimonialForm";
import { useBranding } from "@/hooks/useBranding";

interface PageHeaderProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  onSubmitTestimonial: (data: any) => void;
}

export const PageHeader = ({ isFormOpen, setIsFormOpen, onSubmitTestimonial }: PageHeaderProps) => {
  const { data: branding } = useBranding();

  return (
    <div className="mb-12 text-center">
      <div className="mx-auto mb-6">
        <Avatar className="h-24 w-24 mx-auto">
          <AvatarImage
            src={branding?.profile_picture}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback>PH</AvatarFallback>
        </Avatar>
      </div>
      <h1 className="mb-4 text-4xl font-bold">
        Would you like to recommend my content?
      </h1>
      <p className="mb-8 text-xl text-gray-600">
        Hi there! I would be thrilled if you could take a moment to leave me a
        testimonial.
      </p>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="mr-4"
            variant="default"
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
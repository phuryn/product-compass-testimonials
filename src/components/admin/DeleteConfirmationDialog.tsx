import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/hooks/useBranding";

interface DeleteConfirmationDialogProps {
  onDelete: () => void;
}

export const DeleteConfirmationDialog = ({ onDelete }: DeleteConfirmationDialogProps) => {
  const { data: branding } = useBranding();
  const primaryColor = branding?.primary_color || '#2e75a9';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" type="button">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the testimonial.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground"
          >
            Delete
          </AlertDialogAction>
          <AlertDialogCancel 
            style={{ backgroundColor: primaryColor }}
            className="text-primary-foreground hover:opacity-90"
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
import { Button } from "@/components/ui/button";
import { useBranding } from "@/hooks/useBranding";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface FormActionsProps {
  isAdmin: boolean;
  onDelete?: () => void;
  onCancel: () => void;
}

export const FormActions = ({ isAdmin, onDelete, onCancel }: FormActionsProps) => {
  const { data: branding } = useBranding();
  const primaryColor = branding?.primary_color || '#2e75a9';

  return (
    <div className="flex justify-between gap-2">
      {isAdmin && onDelete && (
        <DeleteConfirmationDialog onDelete={onDelete} />
      )}
      <div className="flex gap-2 ml-auto">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          style={{ backgroundColor: primaryColor }}
          className="text-primary-foreground hover:opacity-90"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
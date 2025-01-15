import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PermissionCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const PermissionCheckbox = ({ checked, onCheckedChange }: PermissionCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="permission"
        checked={checked}
        onCheckedChange={(checked) => {
          console.log("Permission changed to:", checked);
          onCheckedChange(checked as boolean);
        }}
        required
      />
      <Label 
        htmlFor="permission" 
        className="text-sm after:content-['*'] after:ml-0.5 after:text-red-500"
      >
        I give permission to use this testimonial across social channels and
        other marketing efforts
      </Label>
    </div>
  );
};
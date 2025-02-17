import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBranding } from "@/hooks/useBranding";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

const predefinedColors = [
  "#2e75a9", // Current primary
  "#1EAEDB", // Bright Blue
  "#33C3F0", // Sky Blue
  "#0FA0CE", // Ocean Blue
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
];

export const ColorEditor = () => {
  const { data: branding } = useBranding();
  const [selectedColor, setSelectedColor] = useState(branding?.primary_color || "#2e75a9");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateColorMutation = useMutation({
    mutationFn: async (color: string) => {
      const { error } = await supabase
        .from("branding")
        .upsert({ key: "primary_color", value: color });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding"] });
      toast({
        title: "Color updated",
        description: "The primary color has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update color. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating color:", error);
    },
  });

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    updateColorMutation.mutate(color);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="primary-color">Primary Color</Label>
        <p className="text-sm text-muted-foreground">Choose the main color for your brand's buttons and accents.</p>
        <div className="flex items-center gap-4">
          <Input
            id="primary-color"
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-20 h-10"
          />
          <Input
            type="text"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-32"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preset Colors</Label>
        <p className="text-sm text-muted-foreground">Quick access to predefined brand colors.</p>
        <div className="flex flex-wrap gap-2">
          {predefinedColors.map((color) => (
            <Button
              key={color}
              className="w-10 h-10 p-0 rounded-full"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              variant="outline"
            >
              <span className="sr-only">Select color {color}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preview</Label>
        <p className="text-sm text-muted-foreground">See how your selected color looks on a button.</p>
        <div className="space-y-2">
          <Button style={{ backgroundColor: selectedColor }}>
            Primary Button
          </Button>
        </div>
      </div>
    </div>
  );
};
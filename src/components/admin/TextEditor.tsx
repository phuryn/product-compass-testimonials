import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useBranding } from "@/hooks/useBranding";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface TextEditorProps {
  textKey: string;
  label: string;
  description: string;
}

export const TextEditor = ({ textKey, label, description }: TextEditorProps) => {
  const { data: branding } = useBranding();
  const [text, setText] = useState(branding?.[textKey] || "");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateTextMutation = useMutation({
    mutationFn: async (newText: string) => {
      const { error } = await supabase
        .from("branding")
        .upsert({ key: textKey, value: newText });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding"] });
      toast({
        title: "Text updated",
        description: "The text has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update text. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating text:", error);
    },
  });

  const handleTextChange = (newText: string) => {
    setText(newText);
    updateTextMutation.mutate(newText);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={textKey}>{label}</Label>
      <Input
        id={textKey}
        type="text"
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
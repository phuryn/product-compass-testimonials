import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy } from "lucide-react";

export const EmbedCodeGenerator = () => {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("name")
        .order("name");

      if (error) throw error;
      return data.map((tag) => tag.name);
    },
  });

  const currentUrl = window.location.origin;
  const embedUrl = selectedTag === "all" 
    ? `${currentUrl}/embed`
    : `${currentUrl}/embed?tag=${encodeURIComponent(selectedTag)}`;

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border: none;"></iframe>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy code to clipboard",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Embed Testimonials</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Tag</label>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Embed Code</label>
        <div className="flex gap-2">
          <Input
            value={embedCode}
            readOnly
            className="font-mono text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="flex-shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Copy and paste this code into your website where you want the testimonials to appear.
      </div>
    </div>
  );
};
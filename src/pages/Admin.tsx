import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestimonialCard, type Testimonial } from "@/components/TestimonialCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TestimonialForm } from "@/components/TestimonialForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convertDbTestimonialToTestimonial } from "@/utils/testimonialUtils";
import { AVAILABLE_TAGS } from "@/constants/testimonials";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      return data?.map(convertDbTestimonialToTestimonial) || [];
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Testimonial>;
    }) => {
      const { error } = await supabase
        .from("testimonials")
        .update({
          text: data.text,
          rating: data.rating,
          author: data.author,
          tags: data.tags,
          approved: data.approved,
        })
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
      setEditingTestimonial(null);
    },
    onError: (error) => {
      console.error("Error updating testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update testimonial",
      });
    },
  });

  const handleApprove = (id: string) => {
    const testimonial = testimonials.find((t) => t.id === id);
    if (testimonial) {
      updateTestimonialMutation.mutate({
        id,
        data: { approved: !testimonial.approved },
      });
    }
  };

  const handleUpdateTestimonial = (data: any) => {
    if (editingTestimonial) {
      updateTestimonialMutation.mutate({
        id: editingTestimonial.id,
        data: {
          text: data.text,
          rating: data.rating,
          author: data.author,
          tags: data.tags,
        },
      });
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial: Testimonial) => {
    const matchesSearch =
      testimonial.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.author.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag =
      selectedTag === "all" || testimonial.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center gap-4">
        <Input
          placeholder="Search by name, email, or testimonial keywords"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {AVAILABLE_TAGS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredTestimonials.map((testimonial: Testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            isAdmin
            onApprove={handleApprove}
            onEdit={(id) => {
              const testimonial = testimonials.find((t) => t.id === id);
              if (testimonial) {
                setEditingTestimonial(testimonial);
              }
            }}
          />
        ))}
      </div>

      <Dialog
        open={!!editingTestimonial}
        onOpenChange={() => setEditingTestimonial(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogTitle>Edit Testimonial</DialogTitle>
          {editingTestimonial && (
            <TestimonialForm
              initialData={editingTestimonial}
              onSubmit={handleUpdateTestimonial}
              onCancel={() => setEditingTestimonial(null)}
              isAdmin
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
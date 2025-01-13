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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TestimonialForm } from "@/components/TestimonialForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ["testimonials", "admin"],
    queryFn: async () => {
      console.log("Fetching testimonials...");
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched testimonials:", data);
      return data || [];
    },
    retry: 1,
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async (testimonial: Partial<Testimonial>) => {
      const { data, error } = await supabase
        .from("testimonials")
        .update(testimonial)
        .eq("id", testimonial.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update testimonial",
      });
      console.error("Error updating testimonial:", error);
    },
  });

  const handleApprove = (id: string) => {
    const testimonial = testimonials.find((t) => t.id === id);
    if (testimonial) {
      updateTestimonialMutation.mutate({
        id,
        approved: !testimonial.approved,
      });
    }
  };

  const handleUpdateTestimonial = (data: any) => {
    if (editingTestimonial) {
      updateTestimonialMutation.mutate({
        id: editingTestimonial.id,
        text: data.text,
        rating: data.rating,
        author: {
          name: data.name,
          email: data.email,
          social: data.social,
        },
      });
      setEditingTestimonial(null);
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
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

  if (error) {
    return <div>Error loading testimonials: {error.message}</div>;
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
            <SelectItem value="FS2O">FS2O</SelectItem>
            <SelectItem value="CPDM">CPDM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {Array.isArray(testimonials) && testimonials.map((testimonial) => (
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
        <DialogContent className="sm:max-w-[600px]">
          {editingTestimonial && (
            <TestimonialForm
              initialData={editingTestimonial}
              onSubmit={handleUpdateTestimonial}
              onCancel={() => setEditingTestimonial(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

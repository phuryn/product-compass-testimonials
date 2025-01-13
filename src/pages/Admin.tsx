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

// Temporary mock data - same as in Index.tsx
const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    author: {
      name: "Illia",
      email: "iliadyga98@gmail.com",
      social: "www.linkedin.com/in/illia-ladyha?trk=contact-info",
    },
    rating: 5,
    text: "Amazing course, a great addition to Pawel's Substack",
    date: "Dec 31, 2024",
    tags: ["FS2O"],
    approved: true,
  },
  // Add more mock testimonials as needed
];

const Admin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(
    null
  );
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, approved: !t.approved } : t
      )
    );
    toast({
      title: "Testimonial updated",
      description: "The testimonial approval status has been updated.",
    });
  };

  const handleEdit = (id: string) => {
    const testimonial = testimonials.find((t) => t.id === id);
    if (testimonial) {
      setEditingTestimonial(testimonial);
    }
  };

  const handleUpdateTestimonial = (data: any) => {
    if (editingTestimonial) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editingTestimonial.id
            ? {
                ...t,
                text: data.text,
                rating: data.rating,
                author: {
                  ...t.author,
                  name: data.name,
                  email: data.email,
                  social: data.social,
                },
              }
            : t
        )
      );
      setEditingTestimonial(null);
      toast({
        title: "Testimonial updated",
        description: "The testimonial has been successfully updated.",
      });
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
        {filteredTestimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            isAdmin
            onApprove={handleApprove}
            onEdit={handleEdit}
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
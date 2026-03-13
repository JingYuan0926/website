import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Testimonial } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "author_name", label: "Author Name", type: "text", required: true },
  { key: "author_title", label: "Author Title", type: "text", placeholder: "Solana Developer" },
  { key: "author_avatar_url", label: "Author Avatar", type: "image", bucket: "avatars" },
  { key: "content", label: "Testimonial", type: "markdown", required: true },
  { key: "twitter_url", label: "Tweet URL", type: "text", placeholder: "https://x.com/..." },
  { key: "is_tweet_embed", label: "Embed as Tweet", type: "toggle" },
  { key: "display_order", label: "Display Order", type: "number" },
];

const COLUMNS: Column<Testimonial>[] = [
  { key: "author_name", label: "Author" },
  { key: "author_title", label: "Title" },
  {
    key: "content",
    label: "Content",
    render: (t) => (
      <span className="text-xs line-clamp-2 max-w-xs">{t.content}</span>
    ),
  },
];

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    if (!supabase) return;
    const channel = supabase
      .channel("testimonials-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, () => {
        fetchTestimonials();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchTestimonials() {
    if (!supabase) return;
    const { data } = await supabase.from("testimonials").select("*").order("display_order");
    if (data) setTestimonials(data as Testimonial[]);
  }

  async function handleSubmit(data: Record<string, unknown>) {
    if (!supabase) return;
    if (editing) {
      const { error } = await supabase.from("testimonials").update(data).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Testimonial updated");
    } else {
      const { error } = await supabase.from("testimonials").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Testimonial created");
    }
    setEditing(null);
    fetchTestimonials();
  }

  async function handleDelete(testimonial: Testimonial) {
    if (!confirm(`Delete testimonial by "${testimonial.author_name}"?`)) return;
    if (!supabase) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", testimonial.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Testimonial deleted");
    fetchTestimonials();
  }

  return (
    <AdminLayout title="Testimonials">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">{testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>

      <DataTable columns={COLUMNS} data={testimonials} onEdit={(t) => { setEditing(t); setIsModalOpen(true); }} onDelete={handleDelete} />

      <FormModal
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        fields={FIELDS}
        initialData={editing ? (editing as unknown as Record<string, unknown>) : undefined}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { FAQItem } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "question", label: "Question", type: "text", required: true },
  { key: "answer", label: "Answer", type: "textarea", required: true },
  { key: "display_order", label: "Display Order", type: "number" },
];

const COLUMNS: Column<FAQItem>[] = [
  { key: "question", label: "Question" },
  {
    key: "answer",
    label: "Answer",
    render: (f) => (
      <span className="text-xs line-clamp-2 max-w-md">{f.answer}</span>
    ),
  },
  { key: "display_order", label: "Order" },
];

export default function AdminFAQ() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    if (!supabase) return;
    const { data } = await supabase.from("faq_items").select("*").order("display_order");
    if (data) setItems(data as FAQItem[]);
  }

  async function handleSubmit(data: Record<string, unknown>) {
    if (!supabase) return;
    if (editing) {
      const { error } = await supabase.from("faq_items").update(data).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("FAQ updated");
    } else {
      const { error } = await supabase.from("faq_items").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("FAQ created");
    }
    setEditing(null);
    fetchItems();
  }

  async function handleDelete(item: FAQItem) {
    if (!confirm(`Delete this FAQ?`)) return;
    if (!supabase) return;
    const { error } = await supabase.from("faq_items").delete().eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("FAQ deleted");
    fetchItems();
  }

  return (
    <AdminLayout title="FAQ">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      <DataTable columns={COLUMNS} data={items} onEdit={(f) => { setEditing(f); setIsModalOpen(true); }} onDelete={handleDelete} />

      <FormModal
        title={editing ? "Edit FAQ" : "Add FAQ"}
        fields={FIELDS}
        initialData={editing ? (editing as unknown as Record<string, unknown>) : undefined}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}

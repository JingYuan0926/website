import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Partner } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "logo_url", label: "Logo URL", type: "text", placeholder: "https://..." },
  { key: "website_url", label: "Website URL", type: "text" },
  {
    key: "tier",
    label: "Tier",
    type: "select",
    options: [
      { value: "gold", label: "Gold" },
      { value: "silver", label: "Silver" },
      { value: "partner", label: "Partner" },
    ],
  },
  { key: "display_order", label: "Display Order", type: "number" },
];

const COLUMNS: Column<Partner>[] = [
  { key: "name", label: "Name" },
  { key: "website_url", label: "Website" },
  {
    key: "tier",
    label: "Tier",
    render: (p) => (
      <span className={`text-xs font-medium ${
        p.tier === "gold" ? "text-accent-gold" :
        p.tier === "silver" ? "text-text-secondary" :
        "text-text-muted"
      }`}>
        {p.tier}
      </span>
    ),
  },
];

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchPartners(); }, []);

  async function fetchPartners() {
    if (!supabase) return;
    const { data } = await supabase.from("partners").select("*").order("display_order");
    if (data) setPartners(data as Partner[]);
  }

  async function handleSubmit(data: Record<string, unknown>) {
    if (!supabase) return;
    if (editing) {
      const { error } = await supabase.from("partners").update(data).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Partner updated");
    } else {
      const { error } = await supabase.from("partners").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Partner created");
    }
    setEditing(null);
    fetchPartners();
  }

  async function handleDelete(partner: Partner) {
    if (!confirm(`Delete "${partner.name}"?`)) return;
    if (!supabase) return;
    const { error } = await supabase.from("partners").delete().eq("id", partner.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Partner deleted");
    fetchPartners();
  }

  return (
    <AdminLayout title="Partners">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">{partners.length} partner{partners.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
        >
          <Plus size={16} />
          Add Partner
        </button>
      </div>

      <DataTable columns={COLUMNS} data={partners} onEdit={(p) => { setEditing(p); setIsModalOpen(true); }} onDelete={handleDelete} />

      <FormModal
        title={editing ? "Edit Partner" : "Add Partner"}
        fields={FIELDS}
        initialData={editing ? (editing as unknown as Record<string, unknown>) : undefined}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}

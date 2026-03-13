import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Partner } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "logo_url", label: "Logo", type: "image", bucket: "logos", required: true, noCrop: true, scaleKey: "logo_scale" },
  { key: "website_url", label: "Link URL", type: "text", placeholder: "https://..." },
];

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPartners();
    if (!supabase) return;
    const channel = supabase
      .channel("partners-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "partners" }, () => {
        fetchPartners();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchPartners() {
    if (!supabase) return;
    const { data } = await supabase.from("partners").select("*").order("display_order");
    if (data) setPartners(data as Partner[]);
  }

  const COLUMNS: Column<Partner>[] = [
    {
      key: "logo_url",
      label: "Logo",
      render: (p) => p.logo_url ? (
        <img src={p.logo_url} alt={p.name || "Partner"} className="h-8 max-w-[120px] object-contain" />
      ) : (
        <span className="text-xs text-text-muted">No logo</span>
      ),
    },
    {
      key: "website_url",
      label: "Link",
      render: (p) => p.website_url ? (
        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-purple-light hover:underline truncate max-w-[200px] block">
          {p.website_url}
        </a>
      ) : (
        <span className="text-xs text-text-muted">—</span>
      ),
    },
  ];

  async function handleSubmit(raw: Record<string, unknown>) {
    if (!supabase) return;

    // Only send known fields + scale
    const data: Record<string, unknown> = {};
    for (const f of FIELDS) {
      if (f.key in raw) data[f.key] = raw[f.key];
      if (f.scaleKey && f.scaleKey in raw) data[f.scaleKey] = raw[f.scaleKey];
    }

    if (editing) {
      const { data: updated, error } = await supabase
        .from("partners")
        .update(data)
        .eq("id", editing.id)
        .select();
      if (error) { toast.error(error.message); return; }
      if (!updated || updated.length === 0) {
        toast.error("Save failed — check RLS policies");
        return;
      }
      toast.success("Partner updated");
    } else {
      data.display_order = partners.length > 0
        ? Math.max(...partners.map((p) => p.display_order ?? 0)) + 1
        : 0;
      data.name = "Partner";
      data.logo_scale = 1.0;
      const { data: inserted, error } = await supabase
        .from("partners")
        .insert(data)
        .select();
      if (error) { toast.error(error.message); return; }
      if (!inserted || inserted.length === 0) {
        toast.error("Create failed — check RLS policies");
        return;
      }
      toast.success("Partner created");
    }
    setEditing(null);
    fetchPartners();
  }

  async function handleMove(partner: Partner, direction: "up" | "down") {
    if (!supabase) return;
    const idx = partners.findIndex((p) => p.id === partner.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= partners.length) return;
    const other = partners[swapIdx];
    const myOrder = (partner as unknown as Record<string, number>).display_order ?? idx;
    const otherOrder = (other as unknown as Record<string, number>).display_order ?? swapIdx;
    await Promise.all([
      supabase.from("partners").update({ display_order: otherOrder }).eq("id", partner.id),
      supabase.from("partners").update({ display_order: myOrder }).eq("id", other.id),
    ]);
    fetchPartners();
  }

  async function handleDelete(partner: Partner) {
    if (!confirm("Delete this partner?")) return;
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

      <DataTable columns={COLUMNS} data={partners} onEdit={(p) => { setEditing(p); setIsModalOpen(true); }} onDelete={handleDelete} onMove={handleMove} />

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

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { MissionPillar } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "title", label: "Title (sidebar label)", type: "text", required: true, placeholder: "e.g. Builder Support" },
  { key: "heading", label: "Heading", type: "text", required: true, placeholder: "e.g. Hands-on mentorship for builders" },
  { key: "description", label: "Description", type: "textarea", required: true, placeholder: "Paragraph describing this pillar..." },
  { key: "bullets", label: "Bullet Points", type: "bulletlist" },
  { key: "image_url", label: "Image (upload or paste URL)", type: "image", bucket: "general" },
  { key: "cta_text", label: "Button Text", type: "text", placeholder: "e.g. Find a Mentor" },
  { key: "cta_url", label: "Button URL", type: "text", placeholder: "e.g. /members" },
];

const SAVE_KEYS = [...FIELDS.map((f) => f.key), "icon", "display_order"];

const COLUMNS: Column<MissionPillar>[] = [
  { key: "title", label: "Title" },
  {
    key: "heading",
    label: "Heading",
    render: (p) => (
      <span className="text-xs line-clamp-1 max-w-xs">{p.heading}</span>
    ),
  },
  {
    key: "bullets",
    label: "Bullets",
    render: (p) => (
      <span className="text-xs text-text-muted">{p.bullets?.length || 0} items</span>
    ),
  },
];

export default function AdminMission() {
  const [pillars, setPillars] = useState<MissionPillar[]>([]);
  const [editing, setEditing] = useState<MissionPillar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPillars();
    if (!supabase) return;
    const channel = supabase
      .channel("mission-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "mission_pillars" }, () => {
        fetchPillars();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchPillars() {
    if (!supabase) return;
    const { data } = await supabase.from("mission_pillars").select("*").order("display_order");
    if (data) setPillars(data as MissionPillar[]);
  }

  async function handleSubmit(raw: Record<string, unknown>) {
    if (!supabase) return;

    const data: Record<string, unknown> = {};
    for (const key of SAVE_KEYS) {
      if (key in raw) data[key] = raw[key];
    }

    if (editing) {
      const { data: updated, error } = await supabase
        .from("mission_pillars")
        .update(data)
        .eq("id", editing.id)
        .select();
      if (error) { toast.error(error.message); return; }
      if (!updated || updated.length === 0) {
        toast.error("Save failed — run the RLS policy fix in Supabase SQL editor");
        return;
      }
      toast.success("Pillar updated");
    } else {
      data.display_order = pillars.length > 0
        ? Math.max(...pillars.map((p) => p.display_order)) + 1
        : 0;
      const { data: inserted, error } = await supabase
        .from("mission_pillars")
        .insert(data)
        .select();
      if (error) { toast.error(error.message); return; }
      if (!inserted || inserted.length === 0) {
        toast.error("Create failed — run the RLS policy fix in Supabase SQL editor");
        return;
      }
      toast.success("Pillar created");
    }
    setEditing(null);
    fetchPillars();
  }

  async function handleMove(pillar: MissionPillar, direction: "up" | "down") {
    if (!supabase) return;
    const idx = pillars.findIndex((p) => p.id === pillar.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= pillars.length) return;

    const other = pillars[swapIdx];
    await Promise.all([
      supabase.from("mission_pillars").update({ display_order: other.display_order }).eq("id", pillar.id),
      supabase.from("mission_pillars").update({ display_order: pillar.display_order }).eq("id", other.id),
    ]);
    fetchPillars();
  }

  async function handleDelete(pillar: MissionPillar) {
    if (!confirm(`Delete "${pillar.title}"?`)) return;
    if (!supabase) return;
    const { error } = await supabase.from("mission_pillars").delete().eq("id", pillar.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Pillar deleted");
    fetchPillars();
  }

  return (
    <AdminLayout title="Mission Pillars">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          {pillars.length} pillar{pillars.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
        >
          <Plus size={16} />
          Add Pillar
        </button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={pillars}
        onEdit={(p) => { setEditing(p); setIsModalOpen(true); }}
        onDelete={handleDelete}
        onMove={handleMove}
      />

      <FormModal
        title={editing ? "Edit Pillar" : "Add Pillar"}
        fields={FIELDS}
        initialData={editing ? (editing as unknown as Record<string, unknown>) : undefined}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}

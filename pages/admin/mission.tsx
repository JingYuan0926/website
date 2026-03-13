import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { MissionPillar } from "@/lib/types";

const ICON_OPTIONS = [
  { value: "code", label: "Code" },
  { value: "calendar", label: "Calendar" },
  { value: "coins", label: "Coins" },
  { value: "briefcase", label: "Briefcase" },
  { value: "graduation-cap", label: "Graduation Cap" },
  { value: "globe", label: "Globe" },
  { value: "rocket", label: "Rocket" },
  { value: "shield", label: "Shield" },
  { value: "heart", label: "Heart" },
  { value: "zap", label: "Zap" },
];

const FIELDS: FieldDef[] = [
  { key: "title", label: "Title (sidebar label)", type: "text", required: true, placeholder: "e.g. Builder Support" },
  { key: "heading", label: "Heading", type: "text", required: true, placeholder: "e.g. Hands-on mentorship for builders" },
  { key: "description", label: "Description", type: "textarea", required: true, placeholder: "Paragraph describing this pillar..." },
  { key: "bullets", label: "Bullet Points", type: "bulletlist" },
  { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  { key: "image_url", label: "Image", type: "image", bucket: "general" },
  { key: "cta_text", label: "Button Text", type: "text", placeholder: "e.g. Find a Mentor" },
  { key: "cta_url", label: "Button URL", type: "text", placeholder: "e.g. /members" },
  { key: "display_order", label: "Display Order", type: "number" },
];

// Only send these keys to Supabase (exclude id, created_at, etc.)
const SAVE_KEYS = FIELDS.map((f) => f.key);

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
  { key: "icon", label: "Icon" },
  { key: "display_order", label: "Order" },
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

    // Only send known fields to Supabase
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

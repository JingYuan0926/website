import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Announcement } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "title", label: "Banner Text", type: "text", required: true, placeholder: "e.g. AI agents need structure. Build the foundation now" },
  { key: "link_url", label: "Link URL", type: "text", placeholder: "https://..." },
  { key: "is_published", label: "Published", type: "toggle" },
];

const COLUMNS: Column<Announcement>[] = [
  { key: "title", label: "Banner Text" },
  {
    key: "link_url",
    label: "URL",
    render: (a) => (
      <span className="text-xs text-text-muted line-clamp-1 max-w-xs">{a.link_url || "—"}</span>
    ),
  },
  {
    key: "is_published",
    label: "Status",
    render: (a) => (
      <span
        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
          a.is_published
            ? "bg-brand-green/10 text-brand-green-dark"
            : "bg-bg-card-hover text-text-muted"
        }`}
      >
        {a.is_published ? "Published" : "Draft"}
      </span>
    ),
  },
];

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    if (!supabase) return;
    const channel = supabase
      .channel("announcements-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, () => {
        fetchAnnouncements();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchAnnouncements() {
    if (!supabase) return;
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnnouncements(data as Announcement[]);
  }

  async function handleSubmit(data: Record<string, unknown>) {
    if (!supabase) return;

    // Set published_at when publishing
    if (data.is_published && !editing?.is_published) {
      data.published_at = new Date().toISOString();
    }

    if (editing) {
      const { error } = await supabase
        .from("announcements")
        .update(data)
        .eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Announcement updated");
    } else {
      const { error } = await supabase.from("announcements").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Announcement created");
    }

    setEditing(null);
    fetchAnnouncements();
  }

  async function handleDelete(announcement: Announcement) {
    if (!confirm(`Delete "${announcement.title}"?`)) return;
    if (!supabase) return;
    const { error } = await supabase.from("announcements").delete().eq("id", announcement.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Announcement deleted");
    fetchAnnouncements();
  }

  return (
    <AdminLayout title="Announcements">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          {announcements.length} announcement{announcements.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
        >
          <Plus size={16} />
          Add Announcement
        </button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={announcements}
        onEdit={(a) => { setEditing(a); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <FormModal
        title={editing ? "Edit Announcement" : "Add Announcement"}
        fields={FIELDS}
        initialData={editing ? (editing as unknown as Record<string, unknown>) : undefined}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}

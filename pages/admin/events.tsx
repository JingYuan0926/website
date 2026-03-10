import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Event } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "date", label: "Date & Time", type: "date", required: true },
  { key: "location", label: "Location", type: "text", placeholder: "Kuala Lumpur, Malaysia" },
  { key: "image_url", label: "Image URL", type: "text" },
  { key: "luma_url", label: "Luma URL", type: "text", placeholder: "https://lu.ma/..." },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "upcoming", label: "Upcoming" },
      { value: "past", label: "Past" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  { key: "is_featured", label: "Featured", type: "toggle" },
];

const COLUMNS: Column<Event>[] = [
  { key: "title", label: "Title" },
  {
    key: "date",
    label: "Date",
    render: (e) => <span className="text-xs">{formatDate(e.date)}</span>,
  },
  { key: "location", label: "Location" },
  {
    key: "status",
    label: "Status",
    render: (e) => (
      <span
        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
          e.status === "upcoming"
            ? "bg-brand-green/10 text-brand-green-dark"
            : e.status === "past"
            ? "bg-bg-card-hover text-text-muted"
            : "bg-error/10 text-error"
        }`}
      >
        {e.status}
      </span>
    ),
  },
];

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    if (!supabase) return;
    const { data } = await supabase.from("events").select("*").order("date", { ascending: false });
    if (data) setEvents(data as Event[]);
  }

  async function handleSubmit(data: Record<string, unknown>) {
    if (!supabase) return;

    if (editing) {
      const { error } = await supabase.from("events").update(data).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Event updated");
    } else {
      const { error } = await supabase.from("events").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Event created");
    }

    setEditing(null);
    fetchEvents();
  }

  async function handleDelete(event: Event) {
    if (!confirm(`Delete "${event.title}"?`)) return;
    if (!supabase) return;
    const { error } = await supabase.from("events").delete().eq("id", event.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Event deleted");
    fetchEvents();
  }

  return (
    <AdminLayout title="Events">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={events}
        onEdit={(e) => { setEditing(e); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <FormModal
        title={editing ? "Edit Event" : "Add Event"}
        fields={FIELDS}
        initialData={editing ? (editing as unknown as Record<string, unknown>) : undefined}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}

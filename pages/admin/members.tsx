import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Member } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "title", label: "Title / Role", type: "text", required: true },
  { key: "bio", label: "Bio", type: "markdown", placeholder: "Short bio..." },
  { key: "avatar_url", label: "Avatar", type: "image", bucket: "avatars" },
  { key: "skills", label: "Skills", type: "tags" },
  { key: "twitter_handle", label: "Twitter Handle", type: "text", placeholder: "username" },
  { key: "github_url", label: "GitHub URL", type: "text" },
  { key: "linkedin_url", label: "LinkedIn URL", type: "text" },
  { key: "wallet_address", label: "Solana Wallet", type: "text" },
  { key: "is_spotlight", label: "Featured on Homepage", type: "toggle" },
  { key: "display_order", label: "Display Order", type: "number" },
];

const COLUMNS: Column<Member>[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  {
    key: "skills",
    label: "Skills",
    render: (m) => (
      <div className="flex flex-wrap gap-1">
        {m.skills.slice(0, 3).map((s) => (
          <SkillBadge key={s} skill={s} size="sm" />
        ))}
      </div>
    ),
  },
  {
    key: "is_spotlight",
    label: "Featured",
    render: (m) => (
      <span className={m.is_spotlight ? "text-brand-green" : "text-text-muted"}>
        {m.is_spotlight ? "Yes" : "No"}
      </span>
    ),
  },
];

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
    if (!supabase) return;
    const channel = supabase
      .channel("members-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "members" }, () => {
        fetchMembers();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchMembers() {
    if (!supabase) return;
    const { data } = await supabase.from("members").select("*").order("display_order");
    if (data) setMembers(data as Member[]);
  }

  async function handleSubmit(data: Record<string, unknown>) {
    if (!supabase) return;

    if (editing) {
      const { error } = await supabase
        .from("members")
        .update(data)
        .eq("id", editing.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Member updated");
    } else {
      const { error } = await supabase.from("members").insert(data);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Member created");
    }

    setEditing(null);
    fetchMembers();
  }

  async function handleDelete(member: Member) {
    if (!confirm(`Delete ${member.name}?`)) return;
    if (!supabase) return;

    const { error } = await supabase.from("members").delete().eq("id", member.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Member deleted");
    fetchMembers();
  }

  return (
    <AdminLayout title="Members">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={members}
        onEdit={(m) => {
          setEditing(m);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <FormModal
        title={editing ? "Edit Member" : "Add Member"}
        fields={FIELDS}
        initialData={editing ? (editing as unknown as Record<string, unknown>) : undefined}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}

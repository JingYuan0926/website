import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionContent } from "@/components/admin/SectionContent";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { supabase } from "@/lib/supabase";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Member } from "@/lib/types";

interface CommunityProject { id: string; name: string; logo_url: string; website_url: string; display_order: number }

const PROJECT_FIELDS: FieldDef[] = [
  { key: "logo_url", label: "Logo", type: "image", bucket: "general", required: true, noCrop: true },
  { key: "name", label: "Name", type: "text", required: true },
  { key: "website_url", label: "Link URL", type: "text", placeholder: "https://..." },
];

const PROJECT_COLUMNS: Column<CommunityProject>[] = [
  {
    key: "logo_url",
    label: "Logo",
    render: (p) => p.logo_url ? (
      <img src={p.logo_url} alt={p.name} className="h-8 w-8 rounded object-cover" />
    ) : <span className="text-xs text-text-muted">—</span>,
  },
  { key: "name", label: "Name" },
  {
    key: "website_url",
    label: "Link",
    render: (p) => p.website_url ? (
      <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-purple-light hover:underline truncate max-w-[200px] block">{p.website_url}</a>
    ) : <span className="text-xs text-text-muted">—</span>,
  },
];

const SKILL_OPTIONS = SKILL_CATEGORIES
  .filter((s) => s !== "All")
  .map((s) => ({ value: s, label: s }));

const FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "title", label: "Title / Role", type: "text", required: true },
  { key: "bio", label: "Bio", type: "markdown", placeholder: "Short bio..." },
  { key: "avatar_url", label: "Avatar", type: "image", bucket: "avatars" },
  { key: "skills", label: "Skills", type: "checkboxes", options: SKILL_OPTIONS },
  { key: "twitter_handle", label: "Twitter Handle", type: "text", placeholder: "username" },
  { key: "github_url", label: "GitHub URL", type: "text" },
  { key: "linkedin_url", label: "LinkedIn URL", type: "text" },
  { key: "wallet_address", label: "Solana Wallet", type: "text" },
  { key: "is_spotlight", label: "Featured on Homepage", type: "toggle" },
];

const COLUMNS: Column<Member>[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  {
    key: "skills",
    label: "Skills",
    render: (m) => (
      <div className="flex flex-wrap gap-1">
        {m.skills.map((s) => (
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

  // Projects state
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [editingProject, setEditingProject] = useState<CommunityProject | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchProjects();
    if (!supabase) return;
    const ch1 = supabase.channel("members-changes").on("postgres_changes", { event: "*", schema: "public", table: "members" }, () => fetchMembers()).subscribe();
    const ch2 = supabase.channel("projects-changes").on("postgres_changes", { event: "*", schema: "public", table: "community_projects" }, () => fetchProjects()).subscribe();
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2); };
  }, []);

  async function fetchMembers() {
    if (!supabase) return;
    const { data } = await supabase.from("members").select("*").order("display_order");
    if (data) setMembers(data as Member[]);
  }

  async function fetchProjects() {
    if (!supabase) return;
    const { data } = await supabase.from("community_projects").select("*").order("display_order");
    if (data) setProjects(data as CommunityProject[]);
  }

  async function handleProjectSubmit(raw: Record<string, unknown>) {
    if (!supabase) return;
    const data: Record<string, unknown> = {};
    for (const f of PROJECT_FIELDS) { if (f.key in raw) data[f.key] = raw[f.key]; }
    if (editingProject) {
      const { error } = await supabase.from("community_projects").update(data).eq("id", editingProject.id).select();
      if (error) { toast.error(error.message); return; }
      toast.success("Project updated");
    } else {
      data.display_order = projects.length > 0 ? Math.max(...projects.map((p) => p.display_order ?? 0)) + 1 : 0;
      const { error } = await supabase.from("community_projects").insert(data).select();
      if (error) { toast.error(error.message); return; }
      toast.success("Project created");
    }
    setEditingProject(null);
    fetchProjects();
  }

  async function handleProjectDelete(project: CommunityProject) {
    if (!confirm(`Delete "${project.name}"?`)) return;
    if (!supabase) return;
    await supabase.from("community_projects").delete().eq("id", project.id);
    toast.success("Project deleted");
    fetchProjects();
  }

  async function handleProjectMove(project: CommunityProject, direction: "up" | "down") {
    if (!supabase) return;
    const idx = projects.findIndex((p) => p.id === project.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= projects.length) return;
    const other = projects[swapIdx];
    await Promise.all([
      supabase.from("community_projects").update({ display_order: other.display_order }).eq("id", project.id),
      supabase.from("community_projects").update({ display_order: project.display_order }).eq("id", other.id),
    ]);
    fetchProjects();
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
      data.display_order = members.length > 0
        ? Math.max(...members.map((m) => (m as unknown as Record<string, number>).display_order ?? 0)) + 1
        : 0;
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

  async function handleMove(member: Member, direction: "up" | "down") {
    if (!supabase) return;
    const idx = members.findIndex((m) => m.id === member.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= members.length) return;
    const other = members[swapIdx];
    const myOrder = (member as unknown as Record<string, number>).display_order ?? idx;
    const otherOrder = (other as unknown as Record<string, number>).display_order ?? swapIdx;
    await Promise.all([
      supabase.from("members").update({ display_order: otherOrder }).eq("id", member.id),
      supabase.from("members").update({ display_order: myOrder }).eq("id", other.id),
    ]);
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
      <SectionContent
        section="community"
        keyOrder={["title", "description"]}
        labels={{ title: "Section Title", description: "Section Description" }}
      />
      {/* Community Projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Community Projects</h3>
          <button
            onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
          >
            <Plus size={14} />
            Add Project
          </button>
        </div>
        <DataTable columns={PROJECT_COLUMNS} data={projects} onEdit={(p) => { setEditingProject(p); setIsProjectModalOpen(true); }} onDelete={handleProjectDelete} onMove={handleProjectMove} />
      </div>

      <FormModal
        title={editingProject ? "Edit Project" : "Add Project"}
        fields={PROJECT_FIELDS}
        initialData={editingProject ? (editingProject as unknown as Record<string, unknown>) : undefined}
        isOpen={isProjectModalOpen}
        onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
        onSubmit={handleProjectSubmit}
      />

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
        onMove={handleMove}
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

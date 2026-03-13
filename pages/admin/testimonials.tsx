import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal, type FieldDef } from "@/components/admin/FormModal";
import { supabase } from "@/lib/supabase";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import type { Testimonial } from "@/lib/types";

const FIELDS: FieldDef[] = [
  { key: "author_name", label: "Author Name", type: "text", required: true },
  { key: "author_handle", label: "Handle", type: "text", placeholder: "@username" },
  { key: "author_title", label: "Author Title", type: "text", placeholder: "Solana Developer" },
  { key: "author_avatar_url", label: "Author Avatar", type: "image", bucket: "avatars" },
  { key: "content", label: "Testimonial", type: "markdown", required: true },
  { key: "image_url", label: "Card Image", type: "image", bucket: "general" },
  { key: "twitter_url", label: "Tweet URL", type: "text", placeholder: "https://x.com/..." },
  { key: "display_order", label: "Display Order", type: "number" },
];

const COLUMNS: Column<Testimonial>[] = [
  {
    key: "author_name",
    label: "Author",
    render: (t) => (
      <div className="flex items-center gap-2">
        {t.is_tweet_embed && (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#1d9bf0] flex-shrink-0" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        )}
        <span>{t.author_name || (t.is_tweet_embed ? "Tweet embed" : "—")}</span>
      </div>
    ),
  },
  {
    key: "content",
    label: "Content",
    render: (t) => (
      <span className="text-xs line-clamp-2 max-w-xs">
        {t.is_tweet_embed ? t.twitter_url : t.content}
      </span>
    ),
  },
];

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTweetInput, setShowTweetInput] = useState(false);
  const [tweetUrl, setTweetUrl] = useState("");

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

  async function handleAddTweet() {
    if (!tweetUrl.trim() || !supabase) return;
    const match = tweetUrl.trim().match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
    if (!match) {
      toast.error("Paste a valid tweet URL (x.com/user/status/...)");
      return;
    }
    const { error } = await supabase.from("testimonials").insert({
      author_name: "",
      content: "",
      twitter_url: tweetUrl.trim(),
      is_tweet_embed: true,
      display_order: testimonials.length + 1,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Tweet added");
    setTweetUrl("");
    setShowTweetInput(false);
    fetchTestimonials();
  }

  async function handleDelete(testimonial: Testimonial) {
    if (!confirm(`Delete "${testimonial.is_tweet_embed ? "tweet embed" : testimonial.author_name}"?`)) return;
    if (!supabase) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", testimonial.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    fetchTestimonials();
  }

  return (
    <AdminLayout title="Testimonials">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">{testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowTweetInput(!showTweetInput); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#1d9bf0] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Add Tweet
          </button>
          <button
            onClick={() => { setEditing(null); setIsModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
          >
            <Plus size={16} />
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Tweet URL input panel */}
      {showTweetInput && (
        <div className="mb-6 p-4 rounded-xl bg-bg-card border border-border-subtle flex items-center gap-3">
          <input
            type="text"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            placeholder="Paste tweet URL (https://x.com/user/status/...)"
            className="flex-1 px-3 py-2 text-sm bg-bg-elevated border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-[#1d9bf0]"
            onKeyDown={(e) => e.key === "Enter" && handleAddTweet()}
            autoFocus
          />
          <button
            onClick={handleAddTweet}
            className="px-4 py-2 text-sm font-medium bg-[#1d9bf0] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors whitespace-nowrap"
          >
            Embed
          </button>
          <button
            onClick={() => { setShowTweetInput(false); setTweetUrl(""); }}
            className="p-2 text-text-muted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

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

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Markdown } from "@/components/shared/Markdown";
import { supabase } from "@/lib/supabase";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import type { SiteContent } from "@/lib/types";

interface ContentGroup {
  section: string;
  label: string;
  items: SiteContent[];
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  mission: "Mission Section",
  join_cta: "Join CTA Section",
};

const SECTION_ORDER = ["hero", "mission", "join_cta"];

export default function AdminContent() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
    if (!supabase) return;
    const channel = supabase
      .channel("content-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, () => {
        fetchContent();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchContent() {
    if (!supabase) return;
    const { data } = await supabase.from("site_content").select("*").order("section").order("key");
    if (data) setContent(data as SiteContent[]);
  }

  function updateValue(id: string, value: string) {
    setContent((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
  }

  async function saveItem(item: SiteContent) {
    if (!supabase) return;
    setSaving(item.id);
    const { error } = await supabase
      .from("site_content")
      .update({ value: item.value, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    setSaving(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Saved "${item.key}"`);
  }

  const groups: ContentGroup[] = SECTION_ORDER
    .map((section) => ({
      section,
      label: SECTION_LABELS[section] || section,
      items: content.filter((c) => c.section === section),
    }))
    .filter((g) => g.items.length > 0);

  // Include any sections not in SECTION_ORDER
  const knownSections = new Set(SECTION_ORDER);
  const extraSections = [...new Set(content.map((c) => c.section))].filter(
    (s) => !knownSections.has(s)
  );
  extraSections.forEach((section) => {
    groups.push({
      section,
      label: SECTION_LABELS[section] || section.replace(/_/g, " "),
      items: content.filter((c) => c.section === section),
    });
  });

  return (
    <AdminLayout title="Content">
      <p className="text-sm text-text-secondary mb-8">
        Edit landing page content. Changes take effect on next site build.
      </p>

      <div className="space-y-10 max-w-3xl">
        {groups.map((group) => (
          <div key={group.section}>
            <h2 className="text-sm font-semibold text-text-primary mb-4 capitalize">
              {group.label}
            </h2>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-bg-card border border-border-subtle rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-text-secondary">
                      {item.key.replace(/_/g, " ")}
                      <span className="ml-2 text-text-muted">({item.type})</span>
                    </label>
                    <button
                      onClick={() => saveItem(item)}
                      disabled={saving === item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light disabled:opacity-50 transition-colors"
                    >
                      <Save size={12} />
                      {saving === item.id ? "Saving..." : "Save"}
                    </button>
                  </div>

                  {item.type === "image" ? (
                    <ImageUpload
                      value={item.value}
                      onChange={(url) => updateValue(item.id, url)}
                      bucket="general"
                    />
                  ) : item.type === "markdown" ? (
                    <div className="grid grid-cols-2 gap-3">
                      <textarea
                        value={item.value}
                        onChange={(e) => updateValue(item.id, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50 resize-y font-mono"
                      />
                      <div className="px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg overflow-y-auto text-text-secondary">
                        <Markdown content={item.value} />
                      </div>
                    </div>
                  ) : item.type === "url" ? (
                    <input
                      type="url"
                      value={item.value}
                      onChange={(e) => updateValue(item.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50"
                    />
                  ) : item.value.length > 80 ? (
                    <textarea
                      value={item.value}
                      onChange={(e) => updateValue(item.id, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50 resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateValue(item.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="text-center py-12 text-sm text-text-muted">
            No content entries found. Run the SQL migration to seed initial content.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

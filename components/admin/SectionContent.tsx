import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "./ImageUpload";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import type { SiteContent } from "@/lib/types";

interface SectionContentProps {
  section: string;
  /** Order of keys to display */
  keyOrder: string[];
  /** Friendly labels for keys */
  labels?: Record<string, string>;
}

export function SectionContent({ section, keyOrder, labels = {} }: SectionContentProps) {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [section]);

  async function fetchItems() {
    if (!supabase) return;
    const { data } = await supabase.from("site_content").select("*").eq("section", section);
    if (data) setItems(data as SiteContent[]);
  }

  function updateValue(id: string, value: string) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
  }

  async function saveItem(item: SiteContent) {
    if (!supabase) return;
    setSaving(item.id);
    const { error } = await supabase
      .from("site_content")
      .update({ value: item.value, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    setSaving(null);
    if (error) { toast.error(error.message); return; }
    toast.success(`Saved "${labels[item.key] || item.key}"`);
  }

  const sorted = keyOrder
    .map((key) => items.find((i) => i.key === key))
    .filter(Boolean) as SiteContent[];

  // Include any items not in keyOrder
  const extra = items.filter((i) => !keyOrder.includes(i.key));
  const all = [...sorted, ...extra];

  if (all.length === 0) return null;

  return (
    <div className="space-y-3 mb-8">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Page Content</h3>
      {all.map((item) => (
        <div key={item.id} className="bg-bg-card border border-border-subtle rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-text-secondary capitalize">
              {labels[item.key] || item.key.replace(/_/g, " ")}
            </label>
            <button
              onClick={() => saveItem(item)}
              disabled={saving === item.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light disabled:opacity-50 transition-colors"
            >
              <Save size={10} />
              {saving === item.id ? "..." : "Save"}
            </button>
          </div>
          {item.type === "image" ? (
            <ImageUpload value={item.value} onChange={(url) => updateValue(item.id, url)} bucket="general" />
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
              rows={2}
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
  );
}

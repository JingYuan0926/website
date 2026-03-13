import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionContent } from "@/components/admin/SectionContent";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface StatItem {
  value: string;
  label: string;
  desc: string;
}

const DEFAULT_STATS: StatItem[] = [
  { value: "150+", label: "Community Members", desc: "Active builders across Malaysia contributing to the Solana ecosystem." },
  { value: "24", label: "Events Hosted", desc: "Meetups, hackathons, and workshops bringing the community together." },
  { value: "12", label: "Projects Funded", desc: "Startups and projects supported through grants and mentorship." },
  { value: "85", label: "Bounties Completed", desc: "Tasks shipped by community members on Superteam Earn." },
  { value: "5,000+", label: "Community Reach", desc: "People reached across social media and event attendance." },
];

export default function AdminSettings() {
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    if (!supabase) return;
    const { data } = await supabase.from("site_stats").select("*").limit(1).single();
    if (data) {
      setRowId(data.id);
      if (data.stats_json) {
        try {
          setStats(JSON.parse(data.stats_json));
        } catch {
          // fallback to defaults
        }
      }
    }
  }

  async function handleSave() {
    if (!supabase) return;
    setLoading(true);

    const payload = {
      stats_json: JSON.stringify(stats),
      updated_at: new Date().toISOString(),
    };

    let error;
    if (rowId) {
      ({ error } = await supabase.from("site_stats").update(payload).eq("id", rowId));
    } else {
      ({ error } = await supabase.from("site_stats").insert(payload));
    }

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Results updated");
    fetchStats();
  }

  function updateStat(idx: number, field: keyof StatItem, val: string) {
    setStats((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  }

  function addStat() {
    setStats((prev) => [...prev, { value: "0", label: "New Stat", desc: "" }]);
  }

  function removeStat(idx: number) {
    setStats((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <AdminLayout title="Results">
      <div className="max-w-2xl">
        <SectionContent
          section="results"
          keyOrder={["title", "description"]}
          labels={{ title: "Section Title", description: "Section Description" }}
        />
        <p className="text-xs text-text-secondary mb-6">
          These stats are displayed on the landing page. Edit the number, label, and description for each.
        </p>

        <div className="space-y-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border-subtle bg-bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Stat {idx + 1}</span>
                <button
                  onClick={() => removeStat(idx)}
                  className="text-xs text-text-muted hover:text-error transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(idx, "value", e.target.value)}
                    placeholder="e.g. 150+"
                    className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(idx, "label", e.target.value)}
                    placeholder="e.g. Community Members"
                    className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
                <input
                  type="text"
                  value={stat.desc}
                  onChange={(e) => updateStat(idx, "desc", e.target.value)}
                  placeholder="Short description..."
                  className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={addStat}
            className="px-4 py-2 text-sm font-medium text-brand-purple-light bg-brand-purple/10 rounded-lg hover:bg-brand-purple/15 transition-colors"
          >
            + Add Stat
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

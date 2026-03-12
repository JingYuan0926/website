import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import type { SiteStats } from "@/lib/types";

export default function AdminSettings() {
  const [stats, setStats] = useState<Partial<SiteStats>>({
    members_count: 0,
    events_hosted: 0,
    projects_funded: 0,
    bounties_completed: 0,
    community_reach: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    if (!supabase) return;
    const channel = supabase
      .channel("stats-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_stats" }, () => {
        fetchStats();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchStats() {
    if (!supabase) return;
    const { data } = await supabase.from("site_stats").select("*").limit(1).single();
    if (data) setStats(data as SiteStats);
  }

  async function handleSave() {
    if (!supabase) return;
    setLoading(true);

    // Upsert: update existing or insert new
    const { error } = await supabase.from("site_stats").upsert({
      id: stats.id || undefined,
      members_count: stats.members_count,
      events_hosted: stats.events_hosted,
      projects_funded: stats.projects_funded,
      bounties_completed: stats.bounties_completed,
      community_reach: stats.community_reach,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Stats updated");
    fetchStats();
  }

  function updateStat(key: keyof SiteStats, value: number) {
    setStats((prev) => ({ ...prev, [key]: value }));
  }

  const statFields = [
    { key: "members_count" as const, label: "Community Members" },
    { key: "events_hosted" as const, label: "Events Hosted" },
    { key: "projects_funded" as const, label: "Projects Funded" },
    { key: "bounties_completed" as const, label: "Bounties Completed" },
    { key: "community_reach" as const, label: "Community Reach" },
  ];

  return (
    <AdminLayout title="Settings">
      <div className="max-w-xl">
        <h2 className="text-sm font-semibold text-text-primary mb-1">
          Site Statistics
        </h2>
        <p className="text-xs text-text-secondary mb-6">
          These numbers are displayed on the landing page in the stats section.
        </p>

        <div className="space-y-4">
          {statFields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                {label}
              </label>
              <input
                type="number"
                value={Number(stats[key] || 0)}
                onChange={(e) => updateStat(key, Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-bg-card border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 px-5 py-2.5 text-sm font-semibold bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </AdminLayout>
  );
}

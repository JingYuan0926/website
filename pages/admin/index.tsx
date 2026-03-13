import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionContent } from "@/components/admin/SectionContent";
import { supabase } from "@/lib/supabase";
import { Users, Calendar, Handshake, MessageCircle } from "lucide-react";

interface DashboardStats {
  members: number;
  events: number;
  partners: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    members: 0,
    events: 0,
    partners: 0,
    testimonials: 0,
  });

  useEffect(() => {
    if (!supabase) return;
    Promise.all([
      supabase.from("members").select("id", { count: "exact", head: true }),
      supabase.from("luma_events").select("id", { count: "exact", head: true }).gte("start_at", new Date().toISOString()),
      supabase.from("partners").select("id", { count: "exact", head: true }),
      supabase.from("testimonials").select("id", { count: "exact", head: true }),
    ]).then(([m, e, p, t]) => {
      setStats({
        members: m.count || 0,
        events: e.count || 0,
        partners: p.count || 0,
        testimonials: t.count || 0,
      });
    });
  }, []);

  const cards = [
    { label: "Members", value: stats.members, icon: Users, color: "text-brand-purple-light" },
    { label: "Events", value: stats.events, icon: Calendar, color: "text-brand-green" },
    { label: "Partners", value: stats.partners, icon: Handshake, color: "text-accent-gold" },
    { label: "Wall of Love", value: stats.testimonials, icon: MessageCircle, color: "text-brand-purple-light" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-5 rounded-xl border border-border-subtle bg-bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                {label}
              </span>
              <Icon size={16} className={color} />
            </div>
            <div className="text-2xl font-bold text-text-primary tabular-nums">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-4">Hero Section</h2>
          <SectionContent section="hero" keyOrder={["headline", "description"]} labels={{ headline: "Headline", description: "Description" }} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-4">Join CTA / Footer</h2>
          <SectionContent section="join_cta" keyOrder={["headline", "description", "telegram_url", "twitter_url"]} labels={{ headline: "Headline", description: "Description", telegram_url: "Telegram URL", twitter_url: "Twitter / X URL" }} />
        </div>
      </div>
    </AdminLayout>
  );
}

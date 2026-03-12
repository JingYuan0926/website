import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
      supabase.from("events").select("id", { count: "exact", head: true }),
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
    { label: "Testimonials", value: stats.testimonials, icon: MessageCircle, color: "text-brand-purple-light" },
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

      <div className="mt-8 p-6 rounded-xl border border-border-subtle bg-bg-card">
        <h2 className="text-sm font-semibold text-text-primary mb-2">
          Welcome to the Admin Dashboard
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Use the sidebar to manage members, events, partners, testimonials, FAQ
          items, and site settings. All changes will be reflected on the public
          website.
        </p>
      </div>
    </AdminLayout>
  );
}

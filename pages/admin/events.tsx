import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionContent } from "@/components/admin/SectionContent";

export default function AdminEvents() {
  return (
    <AdminLayout title="Events">
      <SectionContent
        section="events"
        keyOrder={["title", "description", "submit_label", "submit_url", "luma_label", "luma_url"]}
        labels={{ title: "Section Title", description: "Description", submit_label: "Submit Button Text", submit_url: "Submit Button URL", luma_label: "Luma Button Text", luma_url: "Luma Calendar URL" }}
      />
      <div className="mt-6 p-4 rounded-lg bg-bg-card border border-border-subtle">
        <p className="text-sm text-text-muted">
          Events are automatically synced from your <a href="https://luma.com/mysuperteam" target="_blank" rel="noopener noreferrer" className="text-brand-purple-light hover:underline">Luma calendar</a>. No manual event management needed.
        </p>
      </div>
    </AdminLayout>
  );
}

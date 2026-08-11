import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/Stat";
import { BarChart3, FileText, Lightbulb, Settings, Trash2, Wallet } from "lucide-react";

export const Route = createFileRoute("/_authenticated/more")({
  head: () => ({
    meta: [
      { title: "More Tools — Brothers Chicken Adda" },
      { name: "description", content: "Reports, insights, bills, wastage, cash closing and settings for Brothers Chicken Adda." },
      { property: "og:title", content: "More Tools — Brothers Chicken Adda" },
      { property: "og:description", content: "All shop tools in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const links = [
  { to: "/wastage", label: "Wastage", icon: Trash2, hint: "Spoilage and mortality" },
  { to: "/cash", label: "Cash closing", icon: Wallet, hint: "Reconcile cash and UPI" },
  { to: "/reports", label: "Reports", icon: BarChart3, hint: "Profit & loss, CSV export" },
  { to: "/insights", label: "Insights", icon: Lightbulb, hint: "Margins and AI advice" },
  { to: "/documents", label: "Bills", icon: FileText, hint: "Upload and AI scan" },
  { to: "/settings", label: "Settings", icon: Settings, hint: "Shop setup and audit" },
] as const;

function Page() {
  return (
    <div>
      <PageHeader title="More" description="Everything else in the shop" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] transition hover:bg-muted/50"
          >
            <l.icon className="size-5 text-primary" />
            <p className="mt-2 font-semibold">{l.label}</p>
            <p className="text-xs text-muted-foreground">{l.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


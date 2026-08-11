import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  useSettings,
  useSaveSettings,
  useProfile,
  useMyRoles,
  useSuppliers,
  useAddSupplier,
  useCategories,
  useAddCategory,
  useChickenTypes,
  useAuditLogs,
} from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { prettyTime } from "@/lib/format";
import { PageHeader } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Audit Trail — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Configure shop details, stock tolerance and margin targets, manage suppliers and expense categories, and review the audit trail.",
      },
      { property: "og:title", content: "Settings & Audit Trail — Brothers Chicken Adda" },
      { property: "og:description", content: "Shop configuration and audit trail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const settings = useSettings();
  const save = useSaveSettings();
  const profile = useProfile();
  const roles = useMyRoles();
  const suppliers = useSuppliers();
  const addSupplier = useAddSupplier();
  const categories = useCategories();
  const addCategory = useAddCategory();
  const types = useChickenTypes();
  const logs = useAuditLogs(40);

  const [form, setForm] = useState({
    business_name: "",
    phone: "",
    address: "",
    stock_tolerance_kg: "",
    target_margin_per_kg: "",
    variable_cost_per_kg: "",
  });
  const [newSupplier, setNewSupplier] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryKind, setNewCategoryKind] = useState("operating");

  useEffect(() => {
    const s = settings.data;
    if (!s) return;
    setForm({
      business_name: s.business_name ?? "",
      phone: s.phone ?? "",
      address: s.address ?? "",
      stock_tolerance_kg: String(s.stock_tolerance_kg ?? 0),
      target_margin_per_kg: String(s.target_margin_per_kg ?? 0),
      variable_cost_per_kg: String(s.variable_cost_per_kg ?? 0),
    });
  }, [settings.data]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description={profile.data?.full_name ? `Signed in as ${profile.data.full_name}` : "Shop configuration"}
        action={
          <Button variant="outline" className="h-11" onClick={signOut}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Shop details</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Business name" value={form.business_name} onChange={(v) => setForm({ ...form, business_name: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <div className="sm:col-span-2">
              <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            </div>
            <Field
              label="Stock tolerance (kg)"
              value={form.stock_tolerance_kg}
              onChange={(v) => setForm({ ...form, stock_tolerance_kg: v })}
              numeric
            />
            <Field
              label="Target margin (₹/kg)"
              value={form.target_margin_per_kg}
              onChange={(v) => setForm({ ...form, target_margin_per_kg: v })}
              numeric
            />
            <Field
              label="Variable cost (₹/kg)"
              value={form.variable_cost_per_kg}
              onChange={(v) => setForm({ ...form, variable_cost_per_kg: v })}
              numeric
            />
          </div>
          <Button
            className="mt-4 h-11 w-full"
            disabled={save.isPending}
            onClick={() =>
              save.mutate(
                {
                  business_name: form.business_name || "Brothers Chicken Adda",
                  phone: form.phone || null,
                  address: form.address || null,
                  stock_tolerance_kg: Number(form.stock_tolerance_kg || 0),
                  target_margin_per_kg: Number(form.target_margin_per_kg || 0),
                  variable_cost_per_kg: Number(form.variable_cost_per_kg || 0),
                },
                {
                  onSuccess: () => toast.success("Settings saved"),
                  onError: (e: Error) => toast.error(e.message || "Could not save"),
                },
              )
            }
          >
            Save settings
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Access is private: {roles.data?.length ? roles.data.join(", ") : "member"} · every change is
            written to the audit trail and the database is backed up automatically.
          </p>
        </section>

        <section className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Suppliers</h2>
          <div className="mt-3 flex gap-2">
            <Input
              className="h-11"
              placeholder="New supplier name"
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
            />
            <Button
              className="h-11"
              disabled={!newSupplier.trim() || addSupplier.isPending}
              onClick={() =>
                addSupplier.mutate(
                  { name: newSupplier.trim() },
                  {
                    onSuccess: () => {
                      setNewSupplier("");
                      toast.success("Supplier added");
                    },
                    onError: (e: Error) => toast.error(e.message),
                  },
                )
              }
            >
              Add
            </Button>
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {(suppliers.data ?? []).map((s) => (
              <li key={s.id} className="rounded-lg bg-muted/50 px-3 py-2">
                {s.name}
              </li>
            ))}
            {(suppliers.data ?? []).length === 0 ? (
              <li className="text-sm text-muted-foreground">No suppliers yet.</li>
            ) : null}
          </ul>

          <h2 className="mt-6 text-sm font-semibold">Expense categories</h2>
          <div className="mt-3 flex gap-2">
            <Input
              className="h-11"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <select
              className="h-11 rounded-md border bg-background px-2 text-sm"
              value={newCategoryKind}
              onChange={(e) => setNewCategoryKind(e.target.value)}
            >
              <option value="operating">Operating</option>
              <option value="direct">Direct</option>
            </select>
            <Button
              className="h-11"
              disabled={!newCategory.trim() || addCategory.isPending}
              onClick={() =>
                addCategory.mutate(
                  { name: newCategory.trim(), kind: newCategoryKind },
                  {
                    onSuccess: () => {
                      setNewCategory("");
                      toast.success("Category added");
                    },
                    onError: (e: Error) => toast.error(e.message),
                  },
                )
              }
            >
              Add
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {(categories.data ?? []).map((c) => (
              <span key={c.id} className="rounded-full bg-muted px-3 py-1">
                {c.name}
              </span>
            ))}
          </div>

          <h2 className="mt-6 text-sm font-semibold">Chicken types</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {(types.data ?? []).map((t) => (
              <span key={t.id} className="rounded-full bg-muted px-3 py-1">
                {t.name}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
        <h2 className="border-b px-4 py-3 text-sm font-semibold">Audit trail</h2>
        {(logs.data ?? []).length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing recorded yet.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {(logs.data ?? []).map((l) => (
              <div key={l.id} className="flex justify-between gap-3 border-b px-4 py-2 text-sm last:border-0">
                <span className="font-medium">{l.action}</span>
                <span className="text-xs text-muted-foreground">{prettyTime(l.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  numeric,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase">{label}</Label>
      <Input
        className="h-11"
        inputMode={numeric ? "decimal" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { usePeriod, useAddWastage, useChickenTypes } from "@/lib/data";
import { businessToday, inr, kg, prettyDate, addDays } from "@/lib/format";
import { PageHeader, Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const REASONS = ["Spoilage", "Mortality", "Trimming loss", "Weight loss", "Customer return", "Other"];

export const Route = createFileRoute("/_authenticated/wastage")({
  head: () => ({
    meta: [
      { title: "Wastage & Losses — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Record spoilage, mortality and trimming losses in kilograms with estimated cost so real profit stays accurate.",
      },
      { property: "og:title", content: "Wastage & Losses — Brothers Chicken Adda" },
      { property: "og:description", content: "Track every kilogram lost and what it cost." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WastagePage,
});

function WastagePage() {
  const today = businessToday();
  const [from, setFrom] = useState(addDays(today, -30));
  const [to, setTo] = useState(today);
  const [open, setOpen] = useState(false);
  const period = usePeriod(from, to);
  const types = useChickenTypes();
  const add = useAddWastage();

  const rows = period.data?.wastage ?? [];
  const totalKg = rows.reduce((s, r) => s + Number(r.weight_kg), 0);
  const totalCost = rows.reduce((s, r) => s + Number(r.estimated_cost ?? 0), 0);
  const purchased = (period.data?.purchases ?? []).reduce(
    (s, r) => s + Number(r.net_weight_kg ?? 0),
    0,
  );

  const [form, setForm] = useState({
    business_date: today,
    chicken_type_id: "",
    weight_kg: "",
    estimated_cost: "",
    reason: "Spoilage",
    notes: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (Number(form.weight_kg) <= 0) {
      toast.error("Enter the weight lost");
      return;
    }
    add.mutate(
      {
        business_date: form.business_date,
        chicken_type_id: form.chicken_type_id || null,
        weight_kg: Number(form.weight_kg),
        estimated_cost: Number(form.estimated_cost || 0),
        reason: form.reason,
        notes: form.notes || null,
      },
      {
        onSuccess: () => {
          toast.success("Wastage recorded");
          setForm((f) => ({ ...f, weight_kg: "", estimated_cost: "", notes: "" }));
          setOpen(false);
        },
        onError: () => toast.error("Could not save wastage"),
      },
    );
  }

  const byReason = new Map<string, number>();
  for (const r of rows) byReason.set(r.reason, (byReason.get(r.reason) ?? 0) + Number(r.weight_kg));

  return (
    <div>
      <PageHeader
        title="Wastage"
        description="Spoilage, mortality and trimming losses"
        action={
          <Button className="h-11" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Record wastage
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="h-11 rounded-lg border bg-card px-3 text-sm"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="h-11 rounded-lg border bg-card px-3 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Weight lost" value={kg(totalKg, 2)} tone="negative" />
        <Stat label="Estimated cost" value={inr(totalCost)} tone="negative" />
        <Stat label="Entries" value={rows.length} />
        <Stat
          label="Loss rate"
          value={purchased > 0 ? `${((totalKg / purchased) * 100).toFixed(2)}%` : "—"}
          sub="Of chicken purchased"
          tone="caution"
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">By reason</h2>
          <div className="mt-3 space-y-2 text-sm">
            {[...byReason.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([name, weight]) => (
                <div key={name} className="flex justify-between">
                  <span>{name}</span>
                  <span className="num font-semibold">{kg(weight, 2)}</span>
                </div>
              ))}
            {byReason.size === 0 ? (
              <p className="text-muted-foreground">No wastage recorded. Good going.</p>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] lg:col-span-2">
          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing recorded in this period.
            </p>
          ) : (
            rows.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between border-b px-4 py-3 text-sm last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {r.reason}
                    {r.chicken_types?.name ? ` · ${r.chicken_types.name}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {prettyDate(r.business_date)}
                    {r.notes ? ` · ${r.notes}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="num font-semibold text-negative">{kg(r.weight_kg, 2)}</p>
                  <p className="num text-xs text-muted-foreground">{inr(r.estimated_cost)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Record wastage</SheetTitle>
          </SheetHeader>
          <form onSubmit={submit} className="space-y-4 px-4 pb-8">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Date</Label>
              <Input
                type="date"
                className="h-11"
                value={form.business_date}
                onChange={(e) => setForm({ ...form, business_date: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Chicken type</Label>
              <Select
                value={form.chicken_type_id}
                onValueChange={(v) => setForm({ ...form, chicken_type_id: v })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  {(types.data ?? []).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Weight lost (kg)</Label>
              <Input
                inputMode="decimal"
                className="h-12 text-lg"
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Estimated cost (₹)</Label>
              <Input
                inputMode="decimal"
                className="h-11"
                value={form.estimated_cost}
                onChange={(e) => setForm({ ...form, estimated_cost: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Reason</Label>
              <Select value={form.reason} onValueChange={(v) => setForm({ ...form, reason: v })}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Note</Label>
              <Input
                className="h-11"
                maxLength={200}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <Button type="submit" className="h-12 w-full" disabled={add.isPending}>
              Save wastage
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

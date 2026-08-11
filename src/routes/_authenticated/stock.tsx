import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  usePeriod,
  useChickenTypes,
  useStockCounts,
  useSaveStockCount,
  useSettings,
} from "@/lib/data";
import { businessToday, inr, kg, prettyDate } from "@/lib/format";
import { stockByType } from "@/lib/finance";
import { PageHeader, Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/stock")({
  head: () => ({
    meta: [
      { title: "Chicken Stock & Variance — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Daily chicken stock reconciliation: opening, purchased, sold, wastage, expected closing versus the physical count with variance alerts.",
      },
      { property: "og:title", content: "Chicken Stock & Variance — Brothers Chicken Adda" },
      { property: "og:description", content: "Expected versus actual closing stock every day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StockPage,
});

function StockPage() {
  const [date, setDate] = useState(businessToday());
  const period = usePeriod(date, date);
  const types = useChickenTypes();
  const counts = useStockCounts(date, date);
  const save = useSaveStockCount();
  const settings = useSettings();
  const tolerance = Number(settings.data?.stock_tolerance_kg ?? 0.5);
  const rate = (() => {
    const p = period.data?.purchases ?? [];
    const w = p.reduce((s, r) => s + Number(r.net_weight_kg ?? 0), 0);
    const c = p.reduce((s, r) => s + Number(r.total_cost ?? 0), 0);
    return w > 0 ? c / w : 0;
  })();

  const rows = stockByType(period.data);
  const [actuals, setActuals] = useState<Record<string, string>>({});

  const countByType = new Map(
    (counts.data ?? []).map((c) => [c.chicken_types?.name ?? "", Number(c.actual_closing_kg)]),
  );

  const totalExpected = rows.reduce((s, r) => s + r.expected, 0);
  const totalActual = rows.reduce((s, r) => s + (countByType.get(r.name) ?? 0), 0);
  const variance = totalActual - totalExpected;

  function submit(name: string, typeId: string, expected: number) {
    const raw = actuals[name];
    if (raw === undefined || raw === "") return;
    save.mutate(
      {
        business_date: date,
        chicken_type_id: typeId,
        actual_closing_kg: Number(raw),
        expected_closing_kg: Number(expected.toFixed(3)),
      },
      {
        onSuccess: () => toast.success(`${name} count saved`),
        onError: () => toast.error("Could not save count"),
      },
    );
  }

  return (
    <div>
      <PageHeader
        title="Chicken Stock"
        description="Expected closing stock versus your physical count"
        action={
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 rounded-lg border bg-card px-3 text-sm font-medium"
          />
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Expected closing" value={kg(totalExpected, 2)} />
        <Stat label="Counted" value={kg(totalActual, 2)} />
        <Stat
          label="Variance"
          value={kg(variance, 2)}
          tone={Math.abs(variance) <= tolerance ? "positive" : "negative"}
          sub={`Tolerance ±${tolerance} kg`}
        />
        <Stat label="Variance value" value={inr(Math.abs(variance) * rate)} tone="caution" />
      </div>

      <div className="mt-5 space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-card)]">
            No purchases recorded for {prettyDate(date)}, so there is nothing to reconcile yet.
          </div>
        ) : null}

        {rows.map((r) => {
          const typeId = (types.data ?? []).find((t) => t.name === r.name)?.id;
          const saved = countByType.get(r.name);
          const diff = saved === undefined ? null : saved - r.expected;
          return (
            <div
              key={r.name}
              className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">{r.name}</h2>
                {diff === null ? (
                  <span className="text-xs text-muted-foreground">Not counted</span>
                ) : (
                  <span
                    className={
                      Math.abs(diff) <= tolerance
                        ? "text-xs font-semibold text-positive"
                        : "text-xs font-semibold text-negative"
                    }
                  >
                    {diff >= 0 ? "+" : ""}
                    {diff.toFixed(3)} kg
                  </span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
                <Cell label="Opening" value={kg(r.opening, 2)} />
                <Cell label="Purchased" value={kg(r.purchased, 2)} />
                <Cell label="Sold" value={kg(r.sold, 2)} />
                <Cell label="Wastage" value={kg(r.wasted, 2)} />
                <Cell label="Expected" value={kg(r.expected, 2)} />
              </div>
              {typeId ? (
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase">Physical count (kg)</Label>
                    <Input
                      inputMode="decimal"
                      className="h-11 w-40"
                      placeholder={saved !== undefined ? String(saved) : "0.000"}
                      value={actuals[r.name] ?? ""}
                      onChange={(e) => setActuals({ ...actuals, [r.name]: e.target.value })}
                    />
                  </div>
                  <Button
                    className="h-11"
                    onClick={() => submit(r.name, typeId, r.expected)}
                    disabled={save.isPending}
                  >
                    Save count
                  </Button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="num font-semibold">{value}</p>
    </div>
  );
}

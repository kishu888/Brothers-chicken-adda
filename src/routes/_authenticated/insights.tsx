import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { usePeriod, useSettings } from "@/lib/data";
import { summarize } from "@/lib/finance";
import { getInsights } from "@/lib/ai.functions";
import { businessToday, inr, kg, addDays, shortDate } from "@/lib/format";
import { PageHeader, Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({
    meta: [
      { title: "Business Insights — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Margin per kilogram, best and worst days, wastage trend and AI advice tailored to the Brothers Chicken Adda shop.",
      },
      { property: "og:title", content: "Business Insights — Brothers Chicken Adda" },
      { property: "og:description", content: "Margin trends and AI advice for the shop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const today = businessToday();
  const from = addDays(today, -29);
  const period = usePeriod(from, today);
  const settings = useSettings();
  const s = summarize(period.data);
  const target = Number(settings.data?.target_margin_per_kg ?? 0);

  const daily = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; weight: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = addDays(today, -i);
      map.set(d, { date: d, revenue: 0, weight: 0 });
    }
    for (const r of period.data?.sales ?? []) {
      const row = map.get(r.business_date);
      if (row && (r.status ?? "active") === "active") {
        row.revenue += Number(r.amount);
        row.weight += Number(r.weight_kg);
      }
    }
    return [...map.values()].map((r) => ({
      ...r,
      label: shortDate(r.date),
      rate: r.weight > 0 ? r.revenue / r.weight : 0,
    }));
  }, [period.data, today]);

  const withSales = daily.filter((d) => d.revenue > 0);
  const best = withSales.reduce<(typeof daily)[number] | null>(
    (b, d) => (!b || d.revenue > b.revenue ? d : b),
    null,
  );
  const worst = withSales.reduce<(typeof daily)[number] | null>(
    (b, d) => (!b || d.revenue < b.revenue ? d : b),
    null,
  );
  const avgDaily = withSales.length
    ? withSales.reduce((a, d) => a + d.revenue, 0) / withSales.length
    : 0;

  const run = useServerFn(getInsights);
  const ai = useMutation({
    mutationFn: () =>
      run({
        data: {
          from,
          to: today,
          summary: {
            revenue: Math.round(s.revenue),
            chicken_sold_kg: Number(s.weightSold.toFixed(1)),
            avg_sell_rate_per_kg: Math.round(s.avgSellRate),
            avg_buy_rate_per_kg: Math.round(s.avgPurchaseRate),
            expenses: Math.round(s.expensesTotal),
            wastage_kg: Number(s.wastageKg.toFixed(2)),
            wastage_cost: Math.round(s.wastageCost),
            gross_profit: Math.round(s.grossProfit),
            net_profit: Math.round(s.netProfit),
            net_profit_per_kg: Math.round(s.netProfitPerKg),
            cash_share_pct: s.revenue > 0 ? Math.round((s.cash / s.revenue) * 100) : 0,
          },
          categories: s.categoryTotals.slice(0, 12).map((c) => ({
            name: c.name,
            amount: Math.round(c.amount),
          })),
        },
      }),
    onError: (e: Error) => toast.error(e.message || "Could not generate advice"),
  });

  const margin = s.avgSellRate - s.avgPurchaseRate;

  return (
    <div>
      <PageHeader title="Insights" description="Last 30 days of trading" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Margin per kg"
          value={inr(margin)}
          tone={margin >= target ? "positive" : "caution"}
          sub={target > 0 ? `Target ${inr(target)}/kg` : "Sell rate − buy rate"}
        />
        <Stat label="Average day" value={inr(avgDaily)} sub={`${withSales.length} trading days`} />
        <Stat
          label="Best day"
          value={best ? inr(best.revenue) : "—"}
          sub={best ? shortDate(best.date) : undefined}
          tone="positive"
        />
        <Stat
          label="Slowest day"
          value={worst ? inr(worst.revenue) : "—"}
          sub={worst ? shortDate(worst.date) : undefined}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] lg:col-span-2">
          <h2 className="text-sm font-semibold">Selling rate per kg</h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily} margin={{ left: -12, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} width={60} />
                <Tooltip
                  formatter={(v: number) => `${inr(v)}/kg`}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <MiniStat label="Sold" value={kg(s.weightSold, 1)} />
            <MiniStat label="Bought" value={kg(s.purchaseWeight, 1)} />
            <MiniStat label="Wasted" value={kg(s.wastageKg, 2)} />
            <MiniStat label="Cash share" value={s.revenue > 0 ? `${Math.round((s.cash / s.revenue) * 100)}%` : "—"} />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">AI advisor</h2>
            <Button
              size="sm"
              className="h-9"
              onClick={() => ai.mutate()}
              disabled={ai.isPending || s.revenue === 0}
            >
              <Sparkles className="size-4" />
              {ai.isPending ? "Thinking…" : "Get advice"}
            </Button>
          </div>
          {s.revenue === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Record some sales first and the advisor will read your numbers.
            </p>
          ) : ai.data?.text ? (
            <div className="mt-3 space-y-2 text-sm leading-relaxed">
              {ai.data.text
                .split("\n")
                .filter((l) => l.trim())
                .map((line, i) => (
                  <p key={i} className="rounded-lg bg-muted/50 px-3 py-2">
                    {line.replace(/^[-*]\s*/, "")}
                  </p>
                ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Ask the advisor to review the last 30 days of buying, selling, expenses and wastage.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="num font-semibold">{value}</p>
    </div>
  );
}

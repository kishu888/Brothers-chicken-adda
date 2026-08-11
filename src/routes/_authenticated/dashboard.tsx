import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { usePeriod, useSettings } from "@/lib/data";
import { summarize, stockByType, change } from "@/lib/finance";
import { inr, kg, businessToday, prettyDate, addDays, shortDate, pct } from "@/lib/format";
import { Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { DateBar } from "@/components/Stat";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Daily revenue, chicken sold, gross and net profit, cash vs online and live stock for Brothers Chicken Adda.",
      },
      { property: "og:title", content: "Dashboard — Brothers Chicken Adda" },
      {
        property: "og:description",
        content: "Live business performance for Brothers Chicken Adda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [date, setDate] = useState(businessToday());
  const day = usePeriod(date, date);
  const prevDay = usePeriod(addDays(date, -1), addDays(date, -1));
  const month = usePeriod(addDays(date, -29), date);
  const { data: settings } = useSettings();

  const s = summarize(day.data);
  const p = summarize(prevDay.data);
  const m = summarize(month.data);
  const stock = stockByType(month.data);

  const trend = useMemo(() => {
    const byDate = new Map<string, { revenue: number; weight: number }>();
    for (let i = 29; i >= 0; i--) {
      byDate.set(addDays(date, -i), { revenue: 0, weight: 0 });
    }
    for (const sale of month.data?.sales ?? []) {
      if (sale.status !== "active") continue;
      const row = byDate.get(sale.business_date);
      if (!row) continue;
      row.revenue += Number(sale.amount);
      row.weight += Number(sale.weight_kg);
    }
    return [...byDate.entries()].map(([d, v]) => ({ day: shortDate(d), ...v }));
  }, [month.data, date]);

  const tolerance = Number(settings?.stock_tolerance_kg ?? 1);
  const alerts: { tone: "warn" | "ok"; text: string }[] = [];
  if (s.wastageKg > 0 && s.weightSold > 0 && (s.wastageKg / s.weightSold) * 100 > 2) {
    alerts.push({
      tone: "warn",
      text: `Wastage is ${pct((s.wastageKg / s.weightSold) * 100)} of chicken sold today.`,
    });
  }
  if (s.avgPurchaseRate > 0 && s.avgSellRate > 0 && s.avgSellRate - s.avgPurchaseRate < 15) {
    alerts.push({ tone: "warn", text: "Selling rate is close to purchase cost — low margin." });
  }
  for (const row of stock) {
    if (Math.abs(row.expected) > 0 && row.expected < tolerance) {
      alerts.push({ tone: "warn", text: `${row.name}: expected stock is low (${kg(row.expected, 1)}).` });
    }
  }
  if (alerts.length === 0 && s.saleCount > 0) {
    alerts.push({ tone: "ok", text: "No issues detected for the selected day." });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brothers Chicken Adda</h1>
          <p className="mt-1 text-sm text-muted-foreground">{prettyDate(date)}</p>
        </div>
        <div className="flex gap-2">
          <DateBar date={date} onChange={setDate} />
          <Button asChild className="h-11">
            <Link to="/sales">
              <Plus className="size-4" /> Add sale
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Revenue"
          value={inr(s.revenue)}
          sub={`${change(s.revenue, p.revenue).toFixed(0)}% vs yesterday`}
        />
        <Stat label="Chicken sold" value={kg(s.weightSold, 2)} sub={`${s.saleCount} sales`} />
        <Stat
          label="Gross profit"
          value={inr(s.grossProfit)}
          tone={s.grossProfit >= 0 ? "positive" : "negative"}
          sub="Revenue − chicken cost − direct costs"
        />
        <Stat
          label="Net profit"
          value={inr(s.netProfit)}
          tone={s.netProfit >= 0 ? "positive" : "negative"}
          sub={`${inr(s.netProfitPerKg, true)}/kg`}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Cash" value={inr(s.cash)} />
        <Stat label="Online" value={inr(s.online)} />
        <Stat label="Expenses" value={inr(s.expensesTotal)} tone="caution" />
        <Stat label="Wastage" value={kg(s.wastageKg, 2)} sub={inr(s.wastageCost)} tone="caution" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] lg:col-span-2">
          <h2 className="text-sm font-semibold">Revenue — last 30 days</h2>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} width={54} />
                <Tooltip
                  formatter={(v: number) => inr(v)}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
            <h2 className="text-sm font-semibold">Current stock (30-day flow)</h2>
            <div className="mt-3 space-y-2">
              {stock.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Record a purchase to start tracking stock.
                </p>
              ) : (
                stock.map((row) => (
                  <div key={row.name} className="flex items-center justify-between text-sm">
                    <span>{row.name}</span>
                    <span className="num font-semibold">{kg(row.expected, 1)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
            <h2 className="text-sm font-semibold">Business alerts</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {alerts.length === 0 ? (
                <li className="text-muted-foreground">No data yet for this day.</li>
              ) : (
                alerts.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {a.tone === "warn" ? (
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-caution" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-positive" />
                    )}
                    <span>{a.text}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold">Last 30 days</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Revenue" value={inr(m.revenue)} />
          <Stat label="Avg selling rate" value={`${inr(m.avgSellRate, true)}/kg`} />
          <Stat label="Avg purchase cost" value={`${inr(m.avgPurchaseRate, true)}/kg`} />
          <Stat
            label="Net profit"
            value={inr(m.netProfit)}
            tone={m.netProfit >= 0 ? "positive" : "negative"}
          />
        </div>
      </div>
    </div>
  );
}

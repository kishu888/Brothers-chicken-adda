import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { usePeriod } from "@/lib/data";
import { summarize } from "@/lib/finance";
import { businessToday, inr, kg, addDays, shortDate } from "@/lib/format";
import { PageHeader, Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Profit & Loss Reports — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Period profit and loss for the chicken shop: revenue, cost of chicken sold, expenses, wastage, gross and net profit, with CSV export.",
      },
      { property: "og:title", content: "Profit & Loss Reports — Brothers Chicken Adda" },
      { property: "og:description", content: "Revenue, COGS, expenses and net profit by period." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportsPage,
});

const RANGES = [
  { label: "7 days", days: 6 },
  { label: "30 days", days: 29 },
  { label: "90 days", days: 89 },
] as const;

function ReportsPage() {
  const today = businessToday();
  const [days, setDays] = useState(29);
  const from = addDays(today, -days);
  const period = usePeriod(from, today);
  const s = summarize(period.data);

  const daily = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; expenses: number }>();
    for (let i = days; i >= 0; i--) {
      const d = addDays(today, -i);
      map.set(d, { date: d, revenue: 0, expenses: 0 });
    }
    for (const r of period.data?.sales ?? []) {
      const row = map.get(r.business_date);
      if (row && (r.status ?? "active") === "active") row.revenue += Number(r.amount);
    }
    for (const r of period.data?.expenses ?? []) {
      const row = map.get(r.business_date);
      if (row && (r.status ?? "active") === "active") row.expenses += Number(r.amount);
    }
    return [...map.values()].map((r) => ({ ...r, label: shortDate(r.date) }));
  }, [period.data, days, today]);

  function exportCsv() {
    const lines = [
      ["Line item", "Amount (INR)"],
      ["Revenue", s.revenue.toFixed(2)],
      ["Cash sales", s.cash.toFixed(2)],
      ["Online sales", s.online.toFixed(2)],
      ["Cost of chicken sold", s.cogs.toFixed(2)],
      ["Direct expenses", s.directExpenses.toFixed(2)],
      ["Gross profit", s.grossProfit.toFixed(2)],
      ["Operating expenses", s.operatingExpenses.toFixed(2)],
      ["Wastage cost", s.wastageCost.toFixed(2)],
      ["Net profit", s.netProfit.toFixed(2)],
      [],
      ["Date", "Revenue", "Expenses"],
      ...daily.map((d) => [d.date, d.revenue.toFixed(2), d.expenses.toFixed(2)]),
    ];
    const csv = lines.map((l) => l.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `brothers-chicken-adda-${from}-to-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description={`${from} to ${today}`}
        action={
          <Button variant="outline" className="h-11" onClick={exportCsv}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />

      <div className="mb-4 flex gap-2">
        {RANGES.map((r) => (
          <Button
            key={r.label}
            variant={days === r.days ? "default" : "outline"}
            className="h-10"
            onClick={() => setDays(r.days)}
          >
            {r.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Revenue" value={inr(s.revenue)} sub={`${s.saleCount} sales`} />
        <Stat label="Chicken sold" value={kg(s.weightSold, 1)} sub={`Avg ${inr(s.avgSellRate)}/kg`} />
        <Stat
          label="Gross profit"
          value={inr(s.grossProfit)}
          tone={s.grossProfit >= 0 ? "positive" : "negative"}
        />
        <Stat
          label="Net profit"
          value={inr(s.netProfit)}
          tone={s.netProfit >= 0 ? "positive" : "negative"}
          sub={`${inr(s.netProfitPerKg)}/kg`}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] lg:col-span-2">
          <h2 className="text-sm font-semibold">Revenue vs expenses</h2>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ left: -12, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} width={64} />
                <Tooltip
                  formatter={(v: number) => inr(v)}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--caution))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Profit & loss</h2>
          <div className="mt-3 text-sm">
            <PL label="Revenue" value={s.revenue} />
            <PL label="Cost of chicken sold" value={-s.cogs} />
            <PL label="Direct expenses" value={-s.directExpenses} />
            <PL label="Gross profit" value={s.grossProfit} bold />
            <PL label="Operating expenses" value={-s.operatingExpenses} />
            <PL label="Wastage" value={-s.wastageCost} />
            <PL label="Net profit" value={s.netProfit} bold />
          </div>
          <div className="mt-4 border-t pt-3 text-sm">
            <PLPlain label="Purchased" value={kg(s.purchaseWeight, 1)} />
            <PLPlain label="Avg buy rate" value={`${inr(s.avgPurchaseRate)}/kg`} />
            <PLPlain label="Avg sell rate" value={`${inr(s.avgSellRate)}/kg`} />
            <PLPlain label="Wastage" value={kg(s.wastageKg, 2)} />
          </div>
        </div>
      </div>

      {s.categoryTotals.length > 0 ? (
        <div className="mt-4 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Expenses by category</h2>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {s.categoryTotals.map((c) => (
              <div key={c.name} className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span>{c.name}</span>
                <span className="num font-semibold">{inr(c.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PL({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${bold ? "border-t mt-1 pt-2" : ""}`}>
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span
        className={`num ${bold ? "font-bold" : "font-medium"} ${
          value < 0 ? "text-negative" : bold ? "text-positive" : ""
        }`}
      >
        {inr(value)}
      </span>
    </div>
  );
}

function PLPlain({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="num font-medium">{value}</span>
    </div>
  );
}

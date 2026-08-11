import type { PeriodData } from "@/lib/data";

export type Summary = {
  revenue: number;
  cash: number;
  online: number;
  weightSold: number;
  saleCount: number;
  avgSellRate: number;
  purchaseWeight: number;
  purchaseCost: number;
  avgPurchaseRate: number;
  cogs: number;
  directExpenses: number;
  operatingExpenses: number;
  expensesTotal: number;
  wastageKg: number;
  wastageCost: number;
  grossProfit: number;
  netProfit: number;
  netProfitPerKg: number;
  grossProfitPerKg: number;
  revenuePerKg: number;
  cashExpenses: number;
  categoryTotals: { name: string; amount: number }[];
};

const active = <T extends { status?: string | null }>(rows: T[]) =>
  rows.filter((r) => (r.status ?? "active") === "active");

export function summarize(data: PeriodData | undefined): Summary {
  const sales = active(data?.sales ?? []);
  const purchases = active(data?.purchases ?? []);
  const expenses = active(data?.expenses ?? []);
  const wastage = active(data?.wastage ?? []);

  const revenue = sales.reduce((s, r) => s + Number(r.amount), 0);
  const cash = sales
    .filter((r) => r.payment_method === "cash")
    .reduce((s, r) => s + Number(r.amount), 0);
  const online = revenue - cash;
  const weightSold = sales.reduce((s, r) => s + Number(r.weight_kg), 0);

  const purchaseWeight = purchases.reduce((s, r) => s + Number(r.net_weight_kg ?? 0), 0);
  const purchaseCost = purchases.reduce((s, r) => s + Number(r.total_cost ?? 0), 0);
  const avgPurchaseRate = purchaseWeight > 0 ? purchaseCost / purchaseWeight : 0;

  // Cost of chicken actually sold, valued at the period's effective purchase rate.
  const cogs = avgPurchaseRate > 0 ? weightSold * avgPurchaseRate : purchaseCost;

  let directExpenses = 0;
  let operatingExpenses = 0;
  let cashExpenses = 0;
  const byCategory = new Map<string, number>();
  for (const e of expenses) {
    const amount = Number(e.amount);
    const kind = e.expense_categories?.kind ?? "operating";
    if (kind === "direct") directExpenses += amount;
    else operatingExpenses += amount;
    if (e.payment_method === "cash") cashExpenses += amount;
    const name = e.expense_categories?.name ?? e.category_name_snapshot ?? "Other";
    byCategory.set(name, (byCategory.get(name) ?? 0) + amount);
  }

  const wastageKg = wastage.reduce((s, r) => s + Number(r.weight_kg), 0);
  const wastageCost = wastage.reduce(
    (s, r) => s + (Number(r.estimated_cost) || Number(r.weight_kg) * avgPurchaseRate),
    0,
  );

  const grossProfit = revenue - cogs - directExpenses;
  const netProfit = grossProfit - operatingExpenses - wastageCost;

  return {
    revenue,
    cash,
    online,
    weightSold,
    saleCount: sales.length,
    avgSellRate: weightSold > 0 ? revenue / weightSold : 0,
    purchaseWeight,
    purchaseCost,
    avgPurchaseRate,
    cogs,
    directExpenses,
    operatingExpenses,
    expensesTotal: directExpenses + operatingExpenses,
    wastageKg,
    wastageCost,
    grossProfit,
    netProfit,
    netProfitPerKg: weightSold > 0 ? netProfit / weightSold : 0,
    grossProfitPerKg: weightSold > 0 ? grossProfit / weightSold : 0,
    revenuePerKg: weightSold > 0 ? revenue / weightSold : 0,
    cashExpenses,
    categoryTotals: [...byCategory.entries()]
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount),
  };
}

export function stockByType(data: PeriodData | undefined, opening: Record<string, number> = {}) {
  const map = new Map<string, { purchased: number; sold: number; wasted: number }>();
  const touch = (name: string) => {
    if (!map.has(name)) map.set(name, { purchased: 0, sold: 0, wasted: 0 });
    return map.get(name)!;
  };
  for (const p of active(data?.purchases ?? [])) {
    touch(p.chicken_types?.name ?? "Unspecified").purchased += Number(p.net_weight_kg ?? 0);
  }
  for (const w of active(data?.wastage ?? [])) {
    touch(w.chicken_types?.name ?? "Unspecified").wasted += Number(w.weight_kg);
  }
  const soldTotal = active(data?.sales ?? []).reduce((s, r) => s + Number(r.weight_kg), 0);
  // Sales are recorded without a type by default; attribute them to the largest stock pool.
  const entries = [...map.entries()];
  const totalPurchased = entries.reduce((s, [, v]) => s + v.purchased, 0);
  for (const [, v] of entries) {
    v.sold = totalPurchased > 0 ? (v.purchased / totalPurchased) * soldTotal : 0;
  }
  return entries.map(([name, v]) => {
    const open = opening[name] ?? 0;
    return {
      name,
      opening: open,
      ...v,
      expected: open + v.purchased - v.sold - v.wasted,
    };
  });
}

export function change(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

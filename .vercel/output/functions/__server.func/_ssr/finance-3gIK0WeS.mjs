//#region node_modules/.nitro/vite/services/ssr/assets/finance-3gIK0WeS.js
var active = (rows) => rows.filter((r) => (r.status ?? "active") === "active");
function summarize(data) {
	const sales = active(data?.sales ?? []);
	const purchases = active(data?.purchases ?? []);
	const expenses = active(data?.expenses ?? []);
	const wastage = active(data?.wastage ?? []);
	const revenue = sales.reduce((s, r) => s + Number(r.amount), 0);
	const cash = sales.filter((r) => r.payment_method === "cash").reduce((s, r) => s + Number(r.amount), 0);
	const online = revenue - cash;
	const weightSold = sales.reduce((s, r) => s + Number(r.weight_kg), 0);
	const purchaseWeight = purchases.reduce((s, r) => s + Number(r.net_weight_kg ?? 0), 0);
	const purchaseCost = purchases.reduce((s, r) => s + Number(r.total_cost ?? 0), 0);
	const avgPurchaseRate = purchaseWeight > 0 ? purchaseCost / purchaseWeight : 0;
	const cogs = avgPurchaseRate > 0 ? weightSold * avgPurchaseRate : purchaseCost;
	let directExpenses = 0;
	let operatingExpenses = 0;
	let cashExpenses = 0;
	const byCategory = /* @__PURE__ */ new Map();
	for (const e of expenses) {
		const amount = Number(e.amount);
		if ((e.expense_categories?.kind ?? "operating") === "direct") directExpenses += amount;
		else operatingExpenses += amount;
		if (e.payment_method === "cash") cashExpenses += amount;
		const name = e.expense_categories?.name ?? e.category_name_snapshot ?? "Other";
		byCategory.set(name, (byCategory.get(name) ?? 0) + amount);
	}
	const wastageKg = wastage.reduce((s, r) => s + Number(r.weight_kg), 0);
	const wastageCost = wastage.reduce((s, r) => s + (Number(r.estimated_cost) || Number(r.weight_kg) * avgPurchaseRate), 0);
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
		categoryTotals: [...byCategory.entries()].map(([name, amount]) => ({
			name,
			amount
		})).sort((a, b) => b.amount - a.amount)
	};
}
function stockByType(data, opening = {}) {
	const map = /* @__PURE__ */ new Map();
	const touch = (name) => {
		if (!map.has(name)) map.set(name, {
			purchased: 0,
			sold: 0,
			wasted: 0
		});
		return map.get(name);
	};
	for (const p of active(data?.purchases ?? [])) touch(p.chicken_types?.name ?? "Unspecified").purchased += Number(p.net_weight_kg ?? 0);
	for (const w of active(data?.wastage ?? [])) touch(w.chicken_types?.name ?? "Unspecified").wasted += Number(w.weight_kg);
	const soldTotal = active(data?.sales ?? []).reduce((s, r) => s + Number(r.weight_kg), 0);
	const entries = [...map.entries()];
	const totalPurchased = entries.reduce((s, [, v]) => s + v.purchased, 0);
	for (const [, v] of entries) v.sold = totalPurchased > 0 ? v.purchased / totalPurchased * soldTotal : 0;
	return entries.map(([name, v]) => {
		const open = opening[name] ?? 0;
		return {
			name,
			opening: open,
			...v,
			expected: open + v.purchased - v.sold - v.wasted
		};
	});
}
function change(current, previous) {
	if (previous === 0) return current === 0 ? 0 : 100;
	return (current - previous) / Math.abs(previous) * 100;
}
//#endregion
export { stockByType as n, summarize as r, change as t };

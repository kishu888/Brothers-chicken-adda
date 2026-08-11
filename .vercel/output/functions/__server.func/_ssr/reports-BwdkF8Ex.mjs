import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { w as Download } from "../_libs/lucide-react.mjs";
import { C as usePeriod, c as shortDate, i as kg, n as businessToday, r as inr, t as addDays } from "./data-BXdCoojx.mjs";
import { n as PageHeader, r as Stat } from "./Stat-C4Ts9jut.mjs";
import { r as summarize } from "./finance-3gIK0WeS.mjs";
import { a as XAxis, c as CartesianGrid, d as Tooltip, f as Legend, i as YAxis, l as Bar, n as BarChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-BwdkF8Ex.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RANGES = [
	{
		label: "7 days",
		days: 6
	},
	{
		label: "30 days",
		days: 29
	},
	{
		label: "90 days",
		days: 89
	}
];
function ReportsPage() {
	const today = businessToday();
	const [days, setDays] = (0, import_react.useState)(29);
	const from = addDays(today, -days);
	const period = usePeriod(from, today);
	const s = summarize(period.data);
	const daily = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (let i = days; i >= 0; i--) {
			const d = addDays(today, -i);
			map.set(d, {
				date: d,
				revenue: 0,
				expenses: 0
			});
		}
		for (const r of period.data?.sales ?? []) {
			const row = map.get(r.business_date);
			if (row && (r.status ?? "active") === "active") row.revenue += Number(r.amount);
		}
		for (const r of period.data?.expenses ?? []) {
			const row = map.get(r.business_date);
			if (row && (r.status ?? "active") === "active") row.expenses += Number(r.amount);
		}
		return [...map.values()].map((r) => ({
			...r,
			label: shortDate(r.date)
		}));
	}, [
		period.data,
		days,
		today
	]);
	function exportCsv() {
		const csv = [
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
			[
				"Date",
				"Revenue",
				"Expenses"
			],
			...daily.map((d) => [
				d.date,
				d.revenue.toFixed(2),
				d.expenses.toFixed(2)
			])
		].map((l) => l.join(",")).join("\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = `brothers-chicken-adda-${from}-to-${today}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reports",
			description: `${from} to ${today}`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "h-11",
				onClick: exportCsv,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Export CSV"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex gap-2",
			children: RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: days === r.days ? "default" : "outline",
				className: "h-10",
				onClick: () => setDays(r.days),
				children: r.label
			}, r.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Revenue",
					value: inr(s.revenue),
					sub: `${s.saleCount} sales`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Chicken sold",
					value: kg(s.weightSold, 1),
					sub: `Avg ${inr(s.avgSellRate)}/kg`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Gross profit",
					value: inr(s.grossProfit),
					tone: s.grossProfit >= 0 ? "positive" : "negative"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Net profit",
					value: inr(s.netProfit),
					tone: s.netProfit >= 0 ? "positive" : "negative",
					sub: `${inr(s.netProfitPerKg)}/kg`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Revenue vs expenses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-72 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: daily,
							margin: {
								left: -12,
								right: 4
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 11 },
									interval: "preserveStartEnd"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 11 },
									width: 64
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v) => inr(v),
									contentStyle: {
										background: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: 12,
										fontSize: 12
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "revenue",
									name: "Revenue",
									fill: "hsl(var(--primary))",
									radius: [
										4,
										4,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "expenses",
									name: "Expenses",
									fill: "hsl(var(--caution))",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Profit & loss"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PL, {
								label: "Revenue",
								value: s.revenue
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PL, {
								label: "Cost of chicken sold",
								value: -s.cogs
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PL, {
								label: "Direct expenses",
								value: -s.directExpenses
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PL, {
								label: "Gross profit",
								value: s.grossProfit,
								bold: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PL, {
								label: "Operating expenses",
								value: -s.operatingExpenses
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PL, {
								label: "Wastage",
								value: -s.wastageCost
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PL, {
								label: "Net profit",
								value: s.netProfit,
								bold: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 border-t pt-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PLPlain, {
								label: "Purchased",
								value: kg(s.purchaseWeight, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PLPlain, {
								label: "Avg buy rate",
								value: `${inr(s.avgPurchaseRate)}/kg`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PLPlain, {
								label: "Avg sell rate",
								value: `${inr(s.avgSellRate)}/kg`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PLPlain, {
								label: "Wastage",
								value: kg(s.wastageKg, 2)
							})
						]
					})
				]
			})]
		}),
		s.categoryTotals.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Expenses by category"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3",
				children: s.categoryTotals.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between rounded-lg bg-muted/50 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num font-semibold",
						children: inr(c.amount)
					})]
				}, c.name))
			})]
		}) : null
	] });
}
function PL({ label, value, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between py-1 ${bold ? "border-t mt-1 pt-2" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: bold ? "font-semibold" : "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `num ${bold ? "font-bold" : "font-medium"} ${value < 0 ? "text-negative" : bold ? "text-positive" : ""}`,
			children: inr(value)
		})]
	});
}
function PLPlain({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "num font-medium",
			children: value
		})]
	});
}
//#endregion
export { ReportsPage as component };

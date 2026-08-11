import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { E as CircleCheck, m as Plus, s as TriangleAlert } from "../_libs/lucide-react.mjs";
import { A as useSettings, C as usePeriod, a as pct, c as shortDate, i as kg, n as businessToday, o as prettyDate, r as inr, t as addDays } from "./data-BXdCoojx.mjs";
import { r as Stat, t as DateBar } from "./Stat-C4Ts9jut.mjs";
import { n as stockByType, r as summarize, t as change } from "./finance-3gIK0WeS.mjs";
import { a as XAxis, c as CartesianGrid, d as Tooltip, i as YAxis, o as Area, t as AreaChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CqUUI2m_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const [date, setDate] = (0, import_react.useState)(businessToday());
	const day = usePeriod(date, date);
	const prevDay = usePeriod(addDays(date, -1), addDays(date, -1));
	const month = usePeriod(addDays(date, -29), date);
	const { data: settings } = useSettings();
	const s = summarize(day.data);
	const p = summarize(prevDay.data);
	const m = summarize(month.data);
	const stock = stockByType(month.data);
	const trend = (0, import_react.useMemo)(() => {
		const byDate = /* @__PURE__ */ new Map();
		for (let i = 29; i >= 0; i--) byDate.set(addDays(date, -i), {
			revenue: 0,
			weight: 0
		});
		for (const sale of month.data?.sales ?? []) {
			if (sale.status !== "active") continue;
			const row = byDate.get(sale.business_date);
			if (!row) continue;
			row.revenue += Number(sale.amount);
			row.weight += Number(sale.weight_kg);
		}
		return [...byDate.entries()].map(([d, v]) => ({
			day: shortDate(d),
			...v
		}));
	}, [month.data, date]);
	const tolerance = Number(settings?.stock_tolerance_kg ?? 1);
	const alerts = [];
	if (s.wastageKg > 0 && s.weightSold > 0 && s.wastageKg / s.weightSold * 100 > 2) alerts.push({
		tone: "warn",
		text: `Wastage is ${pct(s.wastageKg / s.weightSold * 100)} of chicken sold today.`
	});
	if (s.avgPurchaseRate > 0 && s.avgSellRate > 0 && s.avgSellRate - s.avgPurchaseRate < 15) alerts.push({
		tone: "warn",
		text: "Selling rate is close to purchase cost — low margin."
	});
	for (const row of stock) if (Math.abs(row.expected) > 0 && row.expected < tolerance) alerts.push({
		tone: "warn",
		text: `${row.name}: expected stock is low (${kg(row.expected, 1)}).`
	});
	if (alerts.length === 0 && s.saleCount > 0) alerts.push({
		tone: "ok",
		text: "No issues detected for the selected day."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Brothers Chicken Adda"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: prettyDate(date)
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateBar, {
					date,
					onChange: setDate
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "h-11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/sales",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add sale"]
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Revenue",
					value: inr(s.revenue),
					sub: `${change(s.revenue, p.revenue).toFixed(0)}% vs yesterday`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Chicken sold",
					value: kg(s.weightSold, 2),
					sub: `${s.saleCount} sales`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Gross profit",
					value: inr(s.grossProfit),
					tone: s.grossProfit >= 0 ? "positive" : "negative",
					sub: "Revenue − chicken cost − direct costs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Net profit",
					value: inr(s.netProfit),
					tone: s.netProfit >= 0 ? "positive" : "negative",
					sub: `${inr(s.netProfitPerKg, true)}/kg`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Cash",
					value: inr(s.cash)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Online",
					value: inr(s.online)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Expenses",
					value: inr(s.expensesTotal),
					tone: "caution"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Wastage",
					value: kg(s.wastageKg, 2),
					sub: inr(s.wastageCost),
					tone: "caution"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Revenue — last 30 days"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: trend,
							margin: {
								left: -18,
								right: 8,
								top: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "rev",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--color-primary)",
										stopOpacity: .35
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--color-primary)",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--color-border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									tick: { fontSize: 11 },
									interval: 4
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 11 },
									width: 54
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v) => inr(v),
									contentStyle: {
										borderRadius: 10,
										border: "1px solid var(--color-border)",
										background: "var(--color-card)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "revenue",
									stroke: "var(--color-primary)",
									fill: "url(#rev)",
									strokeWidth: 2
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Current stock (30-day flow)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-2",
						children: stock.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Record a purchase to start tracking stock."
						}) : stock.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num font-semibold",
								children: kg(row.expected, 1)
							})]
						}, row.name))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Business alerts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: "No data yet for this day."
						}) : alerts.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [a.tone === "warn" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-caution" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 size-4 shrink-0 text-positive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.text })]
						}, i))
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Last 30 days"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Revenue",
						value: inr(m.revenue)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Avg selling rate",
						value: `${inr(m.avgSellRate, true)}/kg`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Avg purchase cost",
						value: `${inr(m.avgPurchaseRate, true)}/kg`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Net profit",
						value: inr(m.netProfit),
						tone: m.netProfit >= 0 ? "positive" : "negative"
					})
				]
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };

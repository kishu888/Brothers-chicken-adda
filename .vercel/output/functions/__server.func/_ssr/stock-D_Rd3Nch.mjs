import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as useSettings, C as usePeriod, b as useChickenTypes, i as kg, j as useStockCounts, k as useSaveStockCount, n as businessToday, o as prettyDate, r as inr } from "./data-BXdCoojx.mjs";
import { n as PageHeader, r as Stat } from "./Stat-C4Ts9jut.mjs";
import { n as stockByType } from "./finance-3gIK0WeS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock-D_Rd3Nch.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StockPage() {
	const [date, setDate] = (0, import_react.useState)(businessToday());
	const period = usePeriod(date, date);
	const types = useChickenTypes();
	const counts = useStockCounts(date, date);
	const save = useSaveStockCount();
	const settings = useSettings();
	const tolerance = Number(settings.data?.stock_tolerance_kg ?? .5);
	const rate = (() => {
		const p = period.data?.purchases ?? [];
		const w = p.reduce((s, r) => s + Number(r.net_weight_kg ?? 0), 0);
		const c = p.reduce((s, r) => s + Number(r.total_cost ?? 0), 0);
		return w > 0 ? c / w : 0;
	})();
	const rows = stockByType(period.data);
	const [actuals, setActuals] = (0, import_react.useState)({});
	const countByType = new Map((counts.data ?? []).map((c) => [c.chicken_types?.name ?? "", Number(c.actual_closing_kg)]));
	const totalExpected = rows.reduce((s, r) => s + r.expected, 0);
	const totalActual = rows.reduce((s, r) => s + (countByType.get(r.name) ?? 0), 0);
	const variance = totalActual - totalExpected;
	function submit(name, typeId, expected) {
		const raw = actuals[name];
		if (raw === void 0 || raw === "") return;
		save.mutate({
			business_date: date,
			chicken_type_id: typeId,
			actual_closing_kg: Number(raw),
			expected_closing_kg: Number(expected.toFixed(3))
		}, {
			onSuccess: () => toast.success(`${name} count saved`),
			onError: () => toast.error("Could not save count")
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Chicken Stock",
			description: "Expected closing stock versus your physical count",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "date",
				value: date,
				onChange: (e) => setDate(e.target.value),
				className: "h-11 rounded-lg border bg-card px-3 text-sm font-medium"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Expected closing",
					value: kg(totalExpected, 2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Counted",
					value: kg(totalActual, 2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Variance",
					value: kg(variance, 2),
					tone: Math.abs(variance) <= tolerance ? "positive" : "negative",
					sub: `Tolerance ±${tolerance} kg`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Variance value",
					value: inr(Math.abs(variance) * rate),
					tone: "caution"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-3",
			children: [rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-card)]",
				children: [
					"No purchases recorded for ",
					prettyDate(date),
					", so there is nothing to reconcile yet."
				]
			}) : null, rows.map((r) => {
				const typeId = (types.data ?? []).find((t) => t.name === r.name)?.id;
				const saved = countByType.get(r.name);
				const diff = saved === void 0 ? null : saved - r.expected;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								children: r.name
							}), diff === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Not counted"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: Math.abs(diff) <= tolerance ? "text-xs font-semibold text-positive" : "text-xs font-semibold text-negative",
								children: [
									diff >= 0 ? "+" : "",
									diff.toFixed(3),
									" kg"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									label: "Opening",
									value: kg(r.opening, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									label: "Purchased",
									value: kg(r.purchased, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									label: "Sold",
									value: kg(r.sold, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									label: "Wastage",
									value: kg(r.wasted, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									label: "Expected",
									value: kg(r.expected, 2)
								})
							]
						}),
						typeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs uppercase",
									children: "Physical count (kg)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									className: "h-11 w-40",
									placeholder: saved !== void 0 ? String(saved) : "0.000",
									value: actuals[r.name] ?? "",
									onChange: (e) => setActuals({
										...actuals,
										[r.name]: e.target.value
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "h-11",
								onClick: () => submit(r.name, typeId, r.expected),
								disabled: save.isPending,
								children: "Save count"
							})]
						}) : null
					]
				}, r.name);
			})]
		})
	] });
}
function Cell({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] uppercase tracking-wide text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "num font-semibold",
		children: value
	})] });
}
//#endregion
export { StockPage as component };

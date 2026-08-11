import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as usePeriod, D as useSaveCashDay, n as businessToday, o as prettyDate, r as inr, v as useCashDay } from "./data-BXdCoojx.mjs";
import { n as PageHeader, r as Stat } from "./Stat-C4Ts9jut.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cash-Zwynta6t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CashPage() {
	const [date, setDate] = (0, import_react.useState)(businessToday());
	const period = usePeriod(date, date);
	const day = useCashDay(date);
	const save = useSaveCashDay();
	const sales = (period.data?.sales ?? []).filter((s) => (s.status ?? "active") === "active");
	const expenses = (period.data?.expenses ?? []).filter((e) => (e.status ?? "active") === "active");
	const cashSales = sales.filter((s) => s.payment_method === "cash").reduce((s, r) => s + Number(r.amount), 0);
	const onlineSales = sales.filter((s) => s.payment_method === "online").reduce((s, r) => s + Number(r.amount), 0);
	const cashExpenses = expenses.filter((e) => e.payment_method === "cash").reduce((s, r) => s + Number(r.amount), 0);
	const [form, setForm] = (0, import_react.useState)({
		opening_cash: "",
		actual_cash: "",
		verified_online: "",
		note: ""
	});
	(0, import_react.useEffect)(() => {
		setForm({
			opening_cash: day.data?.opening_cash != null ? String(day.data.opening_cash) : "",
			actual_cash: day.data?.actual_cash != null ? String(day.data.actual_cash) : "",
			verified_online: day.data?.verified_online != null ? String(day.data.verified_online) : "",
			note: day.data?.note ?? ""
		});
	}, [day.data, date]);
	const opening = Number(form.opening_cash || 0);
	const expectedCash = opening + cashSales - cashExpenses;
	const actualCash = form.actual_cash === "" ? null : Number(form.actual_cash);
	const cashDiff = actualCash === null ? null : actualCash - expectedCash;
	const verifiedOnline = form.verified_online === "" ? null : Number(form.verified_online);
	const onlineDiff = verifiedOnline === null ? null : verifiedOnline - onlineSales;
	function submit(e) {
		e.preventDefault();
		save.mutate({
			business_date: date,
			opening_cash: opening,
			actual_cash: actualCash,
			verified_online: verifiedOnline,
			note: form.note || null
		}, {
			onSuccess: () => toast.success("Day closed and saved"),
			onError: () => toast.error("Could not save reconciliation")
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Cash & Online",
			description: `Closing for ${prettyDate(date)}`,
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
					label: "Cash sales",
					value: inr(cashSales)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Online sales",
					value: inr(onlineSales)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Cash expenses",
					value: inr(cashExpenses),
					tone: "caution"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Expected in drawer",
					value: inr(expectedCash),
					tone: "positive"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "mt-5 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Cash drawer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Opening cash (₹)",
							value: form.opening_cash,
							onChange: (v) => setForm({
								...form,
								opening_cash: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Counted cash at close (₹)",
							value: form.actual_cash,
							onChange: (v) => setForm({
								...form,
								actual_cash: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-muted/50 p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Opening",
									value: inr(opening)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "+ Cash sales",
									value: inr(cashSales)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "− Cash expenses",
									value: inr(cashExpenses)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "= Expected",
									value: inr(expectedCash),
									bold: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Difference",
									value: cashDiff === null ? "Not counted" : inr(cashDiff),
									tone: cashDiff === null ? void 0 : Math.abs(cashDiff) < 1 ? "positive" : "negative",
									bold: true
								})
							]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Online / UPI"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Verified in bank / UPI app (₹)",
							value: form.verified_online,
							onChange: (v) => setForm({
								...form,
								verified_online: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-muted/50 p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Recorded online sales",
								value: inr(onlineSales)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Difference",
								value: onlineDiff === null ? "Not verified" : inr(onlineDiff),
								tone: onlineDiff === null ? void 0 : Math.abs(onlineDiff) < 1 ? "positive" : "negative",
								bold: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "h-11",
								maxLength: 200,
								value: form.note,
								onChange: (e) => setForm({
									...form,
									note: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "h-12 w-full",
							disabled: save.isPending,
							children: "Save day close"
						})
					]
				})]
			})]
		})
	] });
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			inputMode: "decimal",
			className: "h-12 text-lg",
			value,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
function Row({ label, value, bold, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between py-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: bold ? "font-semibold" : "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: [
				"num",
				bold ? "font-bold" : "font-medium",
				tone === "positive" ? "text-positive" : "",
				tone === "negative" ? "text-negative" : ""
			].join(" "),
			children: value
		})]
	});
}
//#endregion
export { CashPage as component };

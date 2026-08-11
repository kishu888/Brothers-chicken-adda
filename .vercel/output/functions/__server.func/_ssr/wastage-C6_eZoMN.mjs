import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as Plus } from "../_libs/lucide-react.mjs";
import { C as usePeriod, b as useChickenTypes, g as useAddWastage, i as kg, n as businessToday, o as prettyDate, r as inr, t as addDays } from "./data-BXdCoojx.mjs";
import { n as PageHeader, r as Stat } from "./Stat-C4Ts9jut.mjs";
import { a as SelectValue, c as SheetHeader, i as SelectTrigger, l as SheetTitle, n as SelectContent, o as Sheet, r as SelectItem, s as SheetContent, t as Select } from "./sheet-Can5xQ_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wastage-C6_eZoMN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REASONS = [
	"Spoilage",
	"Mortality",
	"Trimming loss",
	"Weight loss",
	"Customer return",
	"Other"
];
function WastagePage() {
	const today = businessToday();
	const [from, setFrom] = (0, import_react.useState)(addDays(today, -30));
	const [to, setTo] = (0, import_react.useState)(today);
	const [open, setOpen] = (0, import_react.useState)(false);
	const period = usePeriod(from, to);
	const types = useChickenTypes();
	const add = useAddWastage();
	const rows = period.data?.wastage ?? [];
	const totalKg = rows.reduce((s, r) => s + Number(r.weight_kg), 0);
	const totalCost = rows.reduce((s, r) => s + Number(r.estimated_cost ?? 0), 0);
	const purchased = (period.data?.purchases ?? []).reduce((s, r) => s + Number(r.net_weight_kg ?? 0), 0);
	const [form, setForm] = (0, import_react.useState)({
		business_date: today,
		chicken_type_id: "",
		weight_kg: "",
		estimated_cost: "",
		reason: "Spoilage",
		notes: ""
	});
	function submit(e) {
		e.preventDefault();
		if (Number(form.weight_kg) <= 0) {
			toast.error("Enter the weight lost");
			return;
		}
		add.mutate({
			business_date: form.business_date,
			chicken_type_id: form.chicken_type_id || null,
			weight_kg: Number(form.weight_kg),
			estimated_cost: Number(form.estimated_cost || 0),
			reason: form.reason,
			notes: form.notes || null
		}, {
			onSuccess: () => {
				toast.success("Wastage recorded");
				setForm((f) => ({
					...f,
					weight_kg: "",
					estimated_cost: "",
					notes: ""
				}));
				setOpen(false);
			},
			onError: () => toast.error("Could not save wastage")
		});
	}
	const byReason = /* @__PURE__ */ new Map();
	for (const r of rows) byReason.set(r.reason, (byReason.get(r.reason) ?? 0) + Number(r.weight_kg));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Wastage",
			description: "Spoilage, mortality and trimming losses",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "h-11",
				onClick: () => setOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Record wastage"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "date",
				value: from,
				onChange: (e) => setFrom(e.target.value),
				className: "h-11 rounded-lg border bg-card px-3 text-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "date",
				value: to,
				onChange: (e) => setTo(e.target.value),
				className: "h-11 rounded-lg border bg-card px-3 text-sm"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Weight lost",
					value: kg(totalKg, 2),
					tone: "negative"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Estimated cost",
					value: inr(totalCost),
					tone: "negative"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Entries",
					value: rows.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Loss rate",
					value: purchased > 0 ? `${(totalKg / purchased * 100).toFixed(2)}%` : "—",
					sub: "Of chicken purchased",
					tone: "caution"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "By reason"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-2 text-sm",
					children: [[...byReason.entries()].sort((a, b) => b[1] - a[1]).map(([name, weight]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num font-semibold",
							children: kg(weight, 2)
						})]
					}, name)), byReason.size === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "No wastage recorded. Good going."
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] lg:col-span-2",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-10 text-center text-sm text-muted-foreground",
					children: "Nothing recorded in this period."
				}) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b px-4 py-3 text-sm last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium",
						children: [r.reason, r.chicken_types?.name ? ` · ${r.chicken_types.name}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [prettyDate(r.business_date), r.notes ? ` · ${r.notes}` : ""]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "num font-semibold text-negative",
							children: kg(r.weight_kg, 2)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "num text-xs text-muted-foreground",
							children: inr(r.estimated_cost)
						})]
					})]
				}, r.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
				side: "right",
				className: "w-full overflow-y-auto sm:max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Record wastage" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-4 px-4 pb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								className: "h-11",
								value: form.business_date,
								onChange: (e) => setForm({
									...form,
									business_date: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Chicken type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.chicken_type_id,
								onValueChange: (v) => setForm({
									...form,
									chicken_type_id: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose type" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (types.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: t.id,
									children: t.name
								}, t.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Weight lost (kg)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								className: "h-12 text-lg",
								value: form.weight_kg,
								onChange: (e) => setForm({
									...form,
									weight_kg: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Estimated cost (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								className: "h-11",
								value: form.estimated_cost,
								onChange: (e) => setForm({
									...form,
									estimated_cost: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Reason"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.reason,
								onValueChange: (v) => setForm({
									...form,
									reason: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: r,
									children: r
								}, r)) })]
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
								value: form.notes,
								onChange: (e) => setForm({
									...form,
									notes: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "h-12 w-full",
							disabled: add.isPending,
							children: "Save wastage"
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { WastagePage as component };

import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as Plus } from "../_libs/lucide-react.mjs";
import { C as usePeriod, f as useAddExpense, n as businessToday, o as prettyDate, r as inr, t as addDays, y as useCategories } from "./data-BXdCoojx.mjs";
import { n as PageHeader, r as Stat } from "./Stat-C4Ts9jut.mjs";
import { a as SelectValue, c as SheetHeader, i as SelectTrigger, l as SheetTitle, n as SelectContent, o as Sheet, r as SelectItem, s as SheetContent, t as Select } from "./sheet-Can5xQ_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-CTmGsNkj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExpensesPage() {
	const today = businessToday();
	const [from, setFrom] = (0, import_react.useState)(addDays(today, -30));
	const [to, setTo] = (0, import_react.useState)(today);
	const [open, setOpen] = (0, import_react.useState)(false);
	const period = usePeriod(from, to);
	const categories = useCategories();
	const addExpense = useAddExpense();
	const rows = period.data?.expenses ?? [];
	const total = rows.reduce((s, r) => s + Number(r.amount), 0);
	const [form, setForm] = (0, import_react.useState)({
		business_date: today,
		category_id: "",
		amount: "",
		payment_method: "cash",
		note: ""
	});
	function submit(e) {
		e.preventDefault();
		if (Number(form.amount) <= 0) return;
		addExpense.mutate({
			business_date: form.business_date,
			category_id: form.category_id || null,
			amount: Number(form.amount),
			payment_method: form.payment_method,
			notes: form.note || null
		}, {
			onSuccess: () => {
				toast.success("Expense saved");
				setForm((f) => ({
					...f,
					amount: "",
					note: ""
				}));
				setOpen(false);
			},
			onError: () => toast.error("Could not save expense")
		});
	}
	const byCategory = /* @__PURE__ */ new Map();
	for (const r of rows) {
		const name = r.expense_categories?.name ?? "Uncategorised";
		byCategory.set(name, (byCategory.get(name) ?? 0) + Number(r.amount));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Expenses",
			description: "Running costs of the shop",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "h-11",
				onClick: () => setOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add expense"]
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
					label: "Total expenses",
					value: inr(total),
					tone: "caution"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Entries",
					value: rows.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Daily average",
					value: inr(total / Math.max(1, byCategory.size ? rows.length : 1))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Categories used",
					value: byCategory.size
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "By category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-2 text-sm",
					children: [[...byCategory.entries()].sort((a, b) => b[1] - a[1]).map(([name, amount]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num font-semibold",
							children: inr(amount)
						})]
					}, name)), byCategory.size === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "No expenses in this period."
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] lg:col-span-2",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-10 text-center text-sm text-muted-foreground",
					children: "Nothing recorded yet."
				}) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b px-4 py-3 text-sm last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: r.expense_categories?.name ?? "Uncategorised"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							prettyDate(r.business_date),
							" · ",
							r.payment_method,
							r.notes ? ` · ${r.notes}` : ""
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "num font-semibold",
						children: inr(r.amount)
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Add expense" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
								value: form.business_date,
								onChange: (e) => setForm({
									...form,
									business_date: e.target.value
								}),
								className: "h-11"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.category_id,
								onValueChange: (v) => setForm({
									...form,
									category_id: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose category" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (categories.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Amount (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: form.amount,
								onChange: (e) => setForm({
									...form,
									amount: e.target.value
								}),
								className: "h-12 text-lg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Paid by"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.payment_method,
								onValueChange: (v) => setForm({
									...form,
									payment_method: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "cash",
									children: "Cash"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "online",
									children: "Online"
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase",
								children: "Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.note,
								onChange: (e) => setForm({
									...form,
									note: e.target.value
								}),
								maxLength: 200,
								className: "h-11"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "h-12 w-full",
							disabled: addExpense.isPending,
							children: "Save expense"
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { ExpensesPage as component };

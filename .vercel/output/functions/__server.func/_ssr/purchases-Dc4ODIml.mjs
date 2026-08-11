import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as Plus } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-x1NRwdI2.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as usePeriod, M as useSuppliers, b as useChickenTypes, i as kg, n as businessToday, o as prettyDate, p as useAddPurchase, r as inr, t as addDays, u as uploadBill } from "./data-BXdCoojx.mjs";
import { n as PageHeader, r as Stat } from "./Stat-C4Ts9jut.mjs";
import { a as SelectValue, c as SheetHeader, i as SelectTrigger, l as SheetTitle, n as SelectContent, o as Sheet, r as SelectItem, s as SheetContent, t as Select } from "./sheet-Can5xQ_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/purchases-Dc4ODIml.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function PurchasesPage() {
	const today = businessToday();
	const [from, setFrom] = (0, import_react.useState)(addDays(today, -30));
	const [to, setTo] = (0, import_react.useState)(today);
	const [open, setOpen] = (0, import_react.useState)(false);
	const rows = usePeriod(from, to).data?.purchases ?? [];
	const totalNet = rows.reduce((s, r) => s + Number(r.net_weight_kg ?? 0), 0);
	const totalCost = rows.reduce((s, r) => s + Number(r.total_cost ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Purchases",
			description: "Chicken received from wholesalers",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "h-11",
				onClick: () => setOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New purchase"]
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
					label: "Net chicken bought",
					value: kg(totalNet, 2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Purchase cost",
					value: inr(totalCost)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Effective rate",
					value: totalNet > 0 ? `${inr(totalCost / totalNet, true)}/kg` : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Loads",
					value: rows.length
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 space-y-3",
			children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
				children: "No purchases in this period."
			}) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-semibold",
						children: [r.suppliers?.name ?? "Supplier not set", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-sm font-normal text-muted-foreground",
							children: r.chicken_types?.name ?? ""
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [prettyDate(r.business_date), r.invoice_number ? ` · Invoice ${r.invoice_number}` : ""]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "num text-lg font-bold",
						children: inr(r.total_cost ?? 0)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "num mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Gross",
							value: kg(r.gross_weight_kg, 2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Crate tare",
							value: kg(r.tare_weight_kg, 2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Net",
							value: kg(r.net_weight_kg ?? 0, 2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Effective rate",
							value: `${inr(r.effective_rate ?? 0, true)}/kg`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Listed rate",
							value: `${inr(r.listed_rate, true)}/kg`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Rebate",
							value: `${inr(r.discount_per_kg, true)}/kg`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Other charges",
							value: inr(r.other_charges)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Paid",
							value: inr(r.amount_paid)
						})
					]
				})]
			}, r.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PurchaseSheet, {
			open,
			onOpenChange: setOpen
		})
	] });
}
function Detail({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] tracking-wide text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-medium",
		children: value
	})] });
}
function PurchaseSheet({ open, onOpenChange }) {
	const qc = useQueryClient();
	const suppliers = useSuppliers();
	const types = useChickenTypes();
	const addPurchase = useAddPurchase();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		business_date: businessToday(),
		supplier_id: "",
		new_supplier: "",
		chicken_type_id: "",
		gross_weight_kg: "",
		tare_weight_kg: "",
		listed_rate: "",
		discount_per_kg: "",
		other_charges: "",
		invoice_number: "",
		gstin: "",
		taxable_amount: "",
		cgst: "",
		sgst: "",
		igst: "",
		payment_method: "cash",
		amount_paid: "",
		notes: ""
	});
	const [file, setFile] = (0, import_react.useState)(null);
	const num = (v) => Number(v || 0);
	const net = num(form.gross_weight_kg) - num(form.tare_weight_kg);
	const effective = num(form.listed_rate) - num(form.discount_per_kg);
	const total = net * effective + num(form.other_charges);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function submit(e) {
		e.preventDefault();
		if (net <= 0) {
			toast.error("Net weight must be greater than zero");
			return;
		}
		setBusy(true);
		try {
			let supplierId = form.supplier_id || null;
			if (!supplierId && form.new_supplier.trim()) {
				const { data, error } = await supabase.from("suppliers").insert({ name: form.new_supplier.trim() }).select().single();
				if (error) throw error;
				supplierId = data.id;
				qc.invalidateQueries({ queryKey: ["suppliers"] });
			}
			let documentId = null;
			if (file) documentId = (await uploadBill(file, {
				doc_date: form.business_date,
				category: "Chicken Purchase",
				supplier_id: supplierId,
				invoice_number: form.invoice_number || null,
				amount: total,
				related_type: "purchase"
			})).id;
			await addPurchase.mutateAsync({
				business_date: form.business_date,
				supplier_id: supplierId,
				chicken_type_id: form.chicken_type_id || null,
				gross_weight_kg: num(form.gross_weight_kg),
				tare_weight_kg: num(form.tare_weight_kg),
				listed_rate: num(form.listed_rate),
				discount_per_kg: num(form.discount_per_kg),
				other_charges: num(form.other_charges),
				invoice_number: form.invoice_number || null,
				gstin: form.gstin || null,
				taxable_amount: form.taxable_amount ? num(form.taxable_amount) : null,
				cgst: form.cgst ? num(form.cgst) : null,
				sgst: form.sgst ? num(form.sgst) : null,
				igst: form.igst ? num(form.igst) : null,
				payment_method: form.payment_method,
				amount_paid: num(form.amount_paid),
				document_id: documentId,
				notes: form.notes || null
			});
			toast.success("Purchase saved");
			onOpenChange(false);
			setForm((f) => ({
				...f,
				gross_weight_kg: "",
				tare_weight_kg: "",
				invoice_number: "",
				amount_paid: "",
				notes: ""
			}));
			setFile(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save purchase");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			className: "w-full overflow-y-auto sm:max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "New chicken purchase" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-4 px-4 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Purchase date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: form.business_date,
							onChange: (e) => set("business_date", e.target.value),
							className: "h-11",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Supplier",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.supplier_id,
							onValueChange: (v) => set("supplier_id", v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-11",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose supplier" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (suppliers.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s.id,
								children: s.name
							}, s.id)) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "…or type a new supplier name",
							value: form.new_supplier,
							onChange: (e) => set("new_supplier", e.target.value),
							className: "mt-2 h-11",
							maxLength: 120
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Chicken type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.chicken_type_id,
							onValueChange: (v) => set("chicken_type_id", v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-11",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose type" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (types.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t.id,
								children: t.name
							}, t.id)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Gross / load weight (kg)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: form.gross_weight_kg,
								onChange: (e) => set("gross_weight_kg", e.target.value),
								className: "h-11"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Empty crate weight (kg)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: form.tare_weight_kg,
								onChange: (e) => set("tare_weight_kg", e.target.value),
								className: "h-11"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Listed rate (₹/kg)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: form.listed_rate,
								onChange: (e) => set("listed_rate", e.target.value),
								className: "h-11"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Supplier rebate (₹/kg)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: form.discount_per_kg,
								onChange: (e) => set("discount_per_kg", e.target.value),
								className: "h-11"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "num rounded-xl border bg-surface p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Net chicken weight"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: kg(net, 3)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Effective purchase rate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: [inr(effective, true), "/kg"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex justify-between border-t pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Total purchase cost"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: inr(total)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Other charges (₹)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: form.other_charges,
								onChange: (e) => set("other_charges", e.target.value),
								className: "h-11"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Amount paid (₹)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: form.amount_paid,
								onChange: (e) => set("amount_paid", e.target.value),
								className: "h-11"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Payment method",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.payment_method,
							onValueChange: (v) => set("payment_method", v),
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
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Invoice number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.invoice_number,
								onChange: (e) => set("invoice_number", e.target.value),
								className: "h-11",
								maxLength: 60
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Supplier GSTIN",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.gstin,
								onChange: (e) => set("gstin", e.target.value),
								className: "h-11",
								maxLength: 20
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Taxable amount (₹)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									value: form.taxable_amount,
									onChange: (e) => set("taxable_amount", e.target.value),
									className: "h-11"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "CGST (₹)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									value: form.cgst,
									onChange: (e) => set("cgst", e.target.value),
									className: "h-11"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "SGST (₹)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									value: form.sgst,
									onChange: (e) => set("sgst", e.target.value),
									className: "h-11"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "IGST (₹)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									value: form.igst,
									onChange: (e) => set("igst", e.target.value),
									className: "h-11"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bill photo or PDF",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "file",
							accept: ".jpg,.jpeg,.png,.webp,.pdf",
							onChange: (e) => setFile(e.target.files?.[0] ?? null),
							className: "h-11"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.notes,
							onChange: (e) => set("notes", e.target.value),
							maxLength: 500
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "h-12 w-full text-base",
						disabled: busy,
						children: busy ? "Saving…" : "Save purchase"
					})
				]
			})]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs tracking-wide text-muted-foreground uppercase",
			children: label
		}), children]
	});
}
//#endregion
export { PurchasesPage as component };

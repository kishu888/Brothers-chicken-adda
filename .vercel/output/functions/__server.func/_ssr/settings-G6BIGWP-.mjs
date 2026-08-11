import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { h as LogOut } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-x1NRwdI2.mjs";
import { A as useSettings, M as useSuppliers, O as useSaveSettings, S as useMyRoles, _ as useAuditLogs, b as useChickenTypes, d as useAddCategory, h as useAddSupplier, s as prettyTime, w as useProfile, y as useCategories } from "./data-BXdCoojx.mjs";
import { n as PageHeader } from "./Stat-C4Ts9jut.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-G6BIGWP-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const navigate = useNavigate();
	const settings = useSettings();
	const save = useSaveSettings();
	const profile = useProfile();
	const roles = useMyRoles();
	const suppliers = useSuppliers();
	const addSupplier = useAddSupplier();
	const categories = useCategories();
	const addCategory = useAddCategory();
	const types = useChickenTypes();
	const logs = useAuditLogs(40);
	const [form, setForm] = (0, import_react.useState)({
		business_name: "",
		phone: "",
		address: "",
		stock_tolerance_kg: "",
		target_margin_per_kg: "",
		variable_cost_per_kg: ""
	});
	const [newSupplier, setNewSupplier] = (0, import_react.useState)("");
	const [newCategory, setNewCategory] = (0, import_react.useState)("");
	const [newCategoryKind, setNewCategoryKind] = (0, import_react.useState)("operating");
	(0, import_react.useEffect)(() => {
		const s = settings.data;
		if (!s) return;
		setForm({
			business_name: s.business_name ?? "",
			phone: s.phone ?? "",
			address: s.address ?? "",
			stock_tolerance_kg: String(s.stock_tolerance_kg ?? 0),
			target_margin_per_kg: String(s.target_margin_per_kg ?? 0),
			variable_cost_per_kg: String(s.variable_cost_per_kg ?? 0)
		});
	}, [settings.data]);
	async function signOut() {
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			description: profile.data?.full_name ? `Signed in as ${profile.data.full_name}` : "Shop configuration",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "h-11",
				onClick: signOut,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign out"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Shop details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Business name",
								value: form.business_name,
								onChange: (v) => setForm({
									...form,
									business_name: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								value: form.phone,
								onChange: (v) => setForm({
									...form,
									phone: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Address",
									value: form.address,
									onChange: (v) => setForm({
										...form,
										address: v
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Stock tolerance (kg)",
								value: form.stock_tolerance_kg,
								onChange: (v) => setForm({
									...form,
									stock_tolerance_kg: v
								}),
								numeric: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Target margin (₹/kg)",
								value: form.target_margin_per_kg,
								onChange: (v) => setForm({
									...form,
									target_margin_per_kg: v
								}),
								numeric: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Variable cost (₹/kg)",
								value: form.variable_cost_per_kg,
								onChange: (v) => setForm({
									...form,
									variable_cost_per_kg: v
								}),
								numeric: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 h-11 w-full",
						disabled: save.isPending,
						onClick: () => save.mutate({
							business_name: form.business_name || "Brothers Chicken Adda",
							phone: form.phone || null,
							address: form.address || null,
							stock_tolerance_kg: Number(form.stock_tolerance_kg || 0),
							target_margin_per_kg: Number(form.target_margin_per_kg || 0),
							variable_cost_per_kg: Number(form.variable_cost_per_kg || 0)
						}, {
							onSuccess: () => toast.success("Settings saved"),
							onError: (e) => toast.error(e.message || "Could not save")
						}),
						children: "Save settings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: [
							"Access is private: ",
							roles.data?.length ? roles.data.join(", ") : "member",
							" · every change is written to the audit trail and the database is backed up automatically."
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Suppliers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "h-11",
							placeholder: "New supplier name",
							value: newSupplier,
							onChange: (e) => setNewSupplier(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "h-11",
							disabled: !newSupplier.trim() || addSupplier.isPending,
							onClick: () => addSupplier.mutate({ name: newSupplier.trim() }, {
								onSuccess: () => {
									setNewSupplier("");
									toast.success("Supplier added");
								},
								onError: (e) => toast.error(e.message)
							}),
							children: "Add"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-1 text-sm",
						children: [(suppliers.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-lg bg-muted/50 px-3 py-2",
							children: s.name
						}, s.id)), (suppliers.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: "No suppliers yet."
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-6 text-sm font-semibold",
						children: "Expense categories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "h-11",
								placeholder: "New category",
								value: newCategory,
								onChange: (e) => setNewCategory(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 rounded-md border bg-background px-2 text-sm",
								value: newCategoryKind,
								onChange: (e) => setNewCategoryKind(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "operating",
									children: "Operating"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "direct",
									children: "Direct"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "h-11",
								disabled: !newCategory.trim() || addCategory.isPending,
								onClick: () => addCategory.mutate({
									name: newCategory.trim(),
									kind: newCategoryKind
								}, {
									onSuccess: () => {
										setNewCategory("");
										toast.success("Category added");
									},
									onError: (e) => toast.error(e.message)
								}),
								children: "Add"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2 text-sm",
						children: (categories.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-muted px-3 py-1",
							children: c.name
						}, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-6 text-sm font-semibold",
						children: "Chicken types"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2 text-sm",
						children: (types.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-muted px-3 py-1",
							children: t.name
						}, t.id))
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "border-b px-4 py-3 text-sm font-semibold",
				children: "Audit trail"
			}), (logs.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-8 text-center text-sm text-muted-foreground",
				children: "Nothing recorded yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-80 overflow-y-auto",
				children: (logs.data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-3 border-b px-4 py-2 text-sm last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: l.action
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: prettyTime(l.created_at)
					})]
				}, l.id))
			})]
		})
	] });
}
function Field({ label, value, onChange, numeric }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "h-11",
			inputMode: numeric ? "decimal" : "text",
			value,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
//#endregion
export { SettingsPage as component };

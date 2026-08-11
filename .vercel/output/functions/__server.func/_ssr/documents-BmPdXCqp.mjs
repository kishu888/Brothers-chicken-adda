import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as ExternalLink, b as FileText, i as Upload, l as Sparkles } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { M as useSuppliers, l as signedUrl, n as businessToday, o as prettyDate, r as inr, u as uploadBill, x as useDocuments } from "./data-BXdCoojx.mjs";
import { n as PageHeader, r as Stat } from "./Stat-C4Ts9jut.mjs";
import { n as scanBill, r as useServerFn } from "./ai.functions-DOGbBQlF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-BmPdXCqp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DocumentsPage() {
	const docs = useDocuments();
	const suppliers = useSuppliers();
	const qc = useQueryClient();
	const fileRef = (0, import_react.useRef)(null);
	const [file, setFile] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [fields, setFields] = (0, import_react.useState)({});
	const [meta, setMeta] = (0, import_react.useState)({
		doc_date: businessToday(),
		invoice_number: "",
		amount: "",
		supplier_id: "",
		category: "purchase"
	});
	const runScan = useServerFn(scanBill);
	const scan = useMutation({
		mutationFn: async () => {
			if (!preview) throw new Error("Choose a bill photo first");
			return runScan({ data: { imageDataUrl: preview } });
		},
		onSuccess: (res) => {
			if (!res.ok) {
				toast.error("Could not read that bill clearly");
				return;
			}
			const f = res.fields;
			setFields(f);
			setMeta((m) => ({
				...m,
				doc_date: typeof f["date"] === "string" ? f["date"] : m.doc_date,
				invoice_number: typeof f["invoice_number"] === "string" ? f["invoice_number"] : m.invoice_number,
				amount: f["amount"] != null ? String(f["amount"]) : m.amount
			}));
			toast.success("Bill read — check the details below");
		},
		onError: (e) => toast.error(e.message || "Scan failed")
	});
	const upload = useMutation({
		mutationFn: async () => {
			if (!file) throw new Error("Choose a file");
			return uploadBill(file, {
				doc_date: meta.doc_date || null,
				invoice_number: meta.invoice_number || null,
				amount: meta.amount ? Number(meta.amount) : null,
				supplier_id: meta.supplier_id || null,
				category: meta.category || null
			});
		},
		onSuccess: () => {
			toast.success("Bill saved");
			setFile(null);
			setPreview(null);
			setFields({});
			if (fileRef.current) fileRef.current.value = "";
			qc.invalidateQueries({ queryKey: ["documents"] });
		},
		onError: (e) => toast.error(e.message || "Upload failed")
	});
	function pick(f) {
		setFile(f);
		setFields({});
		if (f && f.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = () => setPreview(reader.result);
			reader.readAsDataURL(f);
		} else setPreview(null);
	}
	async function openDoc(path) {
		try {
			window.open(await signedUrl(path), "_blank", "noopener");
		} catch {
			toast.error("Could not open that file");
		}
	}
	const rows = docs.data ?? [];
	const totalValue = rows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Bills & Documents",
			description: "Private storage with an AI bill reader"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Documents",
					value: rows.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Value on file",
					value: inr(totalValue)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Suppliers",
					value: (suppliers.data ?? []).length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Storage",
					value: "Private",
					sub: "Signed links only"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Upload a bill"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-6 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 text-sm font-medium",
								children: file ? file.name : "Take a photo or choose a file"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "JPG, PNG, WEBP or PDF up to 15 MB"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "image/*,application/pdf",
								capture: "environment",
								className: "hidden",
								onChange: (e) => pick(e.target.files?.[0] ?? null)
							})
						]
					}),
					preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: preview,
						alt: "Preview of the supplier bill being uploaded",
						className: "mt-3 max-h-56 w-full rounded-lg object-contain"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs uppercase",
									children: "Bill date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									className: "h-11",
									value: meta.doc_date,
									onChange: (e) => setMeta({
										...meta,
										doc_date: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs uppercase",
									children: "Invoice number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "h-11",
									value: meta.invoice_number,
									onChange: (e) => setMeta({
										...meta,
										invoice_number: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs uppercase",
									children: "Amount (₹)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									className: "h-11",
									value: meta.amount,
									onChange: (e) => setMeta({
										...meta,
										amount: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs uppercase",
									children: "Supplier"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-11 w-full rounded-md border bg-background px-3 text-sm",
									value: meta.supplier_id,
									onChange: (e) => setMeta({
										...meta,
										supplier_id: e.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Not linked"
									}), (suppliers.data ?? []).map((sup) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: sup.id,
										children: sup.name
									}, sup.id))]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "h-11",
							onClick: () => scan.mutate(),
							disabled: !preview || scan.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), scan.isPending ? "Reading…" : "Scan with AI"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "h-11",
							onClick: () => upload.mutate(),
							disabled: !file || upload.isPending,
							children: "Save bill"
						})]
					}),
					Object.keys(fields).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-lg bg-muted/50 p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
							children: "What the AI read"
						}), Object.entries(fields).filter(([, v]) => v !== null && v !== "").map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: k.replace(/_/g, " ")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num font-medium",
								children: String(v)
							})]
						}, k))]
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "border-b px-4 py-3 text-sm font-semibold",
					children: "Saved documents"
				}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-10 text-center text-sm text-muted-foreground",
					children: "No bills uploaded yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[560px] overflow-y-auto",
					children: rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => openDoc(d.storage_path),
						className: "flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-left text-sm last:border-0 hover:bg-muted/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: d.file_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										d.doc_date ? prettyDate(d.doc_date) : "No date",
										d.suppliers?.name ? ` · ${d.suppliers.name}` : "",
										d.invoice_number ? ` · #${d.invoice_number}` : ""
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [d.amount != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num font-semibold",
								children: inr(d.amount)
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4 text-muted-foreground" })]
						})]
					}, d.id))
				})]
			})]
		})
	] });
}
//#endregion
export { DocumentsPage as component };

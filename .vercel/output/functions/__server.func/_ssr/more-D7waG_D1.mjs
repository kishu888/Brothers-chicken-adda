import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as ChartColumn, _ as Lightbulb, b as FileText, c as Trash2, f as Settings, r as Wallet } from "../_libs/lucide-react.mjs";
import { n as PageHeader } from "./Stat-C4Ts9jut.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-D7waG_D1.js
var import_jsx_runtime = require_jsx_runtime();
var links = [
	{
		to: "/wastage",
		label: "Wastage",
		icon: Trash2,
		hint: "Spoilage and mortality"
	},
	{
		to: "/cash",
		label: "Cash closing",
		icon: Wallet,
		hint: "Reconcile cash and UPI"
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn,
		hint: "Profit & loss, CSV export"
	},
	{
		to: "/insights",
		label: "Insights",
		icon: Lightbulb,
		hint: "Margins and AI advice"
	},
	{
		to: "/documents",
		label: "Bills",
		icon: FileText,
		hint: "Upload and AI scan"
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings,
		hint: "Shop setup and audit"
	}
];
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "More",
		description: "Everything else in the shop"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 lg:grid-cols-3",
		children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: l.to,
			className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] transition hover:bg-muted/50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(l.icon, { className: "size-5 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-semibold",
					children: l.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: l.hint
				})
			]
		}, l.to))
	})] });
}
//#endregion
export { Page as component };

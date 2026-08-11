import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as buttonVariants, t as Button } from "./button-BkEeRci-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as Bird, N as Banknote, P as ArrowLeft, T as Delete, a as Undo2, k as Check, m as Plus, n as Wheat, u as Smartphone } from "../_libs/lucide-react.mjs";
import { C as usePeriod, E as useSalesForDate, T as useReverseSale, b as useChickenTypes, i as kg, m as useAddSale, n as businessToday, o as prettyDate, r as inr, s as prettyTime } from "./data-BXdCoojx.mjs";
import { r as Stat, t as DateBar } from "./Stat-C4Ts9jut.mjs";
import { r as summarize } from "./finance-3gIK0WeS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sales-BUMcXeIK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEYS = [
	"7",
	"8",
	"9",
	"4",
	"5",
	"6",
	"1",
	"2",
	"3",
	".",
	"0",
	"back"
];
function NumberPad({ label, value, suffix, prefix, hint, onChange, onConfirm, confirmLabel = "Confirm", confirmDisabled, onBack, children }) {
	function press(key) {
		if (key === "back") {
			onChange(value.slice(0, -1));
			return;
		}
		if (key === ".") {
			if (value.includes(".")) return;
			onChange((value === "" ? "0" : value) + ".");
			return;
		}
		if (value === "0") {
			onChange(key);
			return;
		}
		const [, decimals] = value.split(".");
		if (decimals && decimals.length >= 3) return;
		onChange(value + key);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-1 pb-2",
				children: [onBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onBack,
					"aria-label": "Back",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium tracking-wide text-muted-foreground uppercase",
					children: label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card px-4 py-6 text-center shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "num text-5xl font-bold sm:text-6xl",
					children: [
						prefix,
						value === "" ? "0" : value,
						suffix ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 text-2xl text-muted-foreground",
							children: suffix
						}) : null
					]
				}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-sm text-muted-foreground",
					children: hint
				}) : null]
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-3 gap-2",
				children: KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => press(k),
					className: cn("keypad-key"),
					"aria-label": k === "back" ? "Backspace" : k,
					children: k === "back" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, { className: "size-6" }) : k
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "h-14 flex-1 text-base",
					onClick: () => onChange(""),
					children: "Clear"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "h-14 flex-[2] text-base font-semibold",
					onClick: onConfirm,
					disabled: confirmDisabled,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5" }),
						" ",
						confirmLabel
					]
				})]
			})
		]
	});
}
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function SalesPage() {
	const [date, setDate] = (0, import_react.useState)(businessToday());
	const [step, setStep] = (0, import_react.useState)("list");
	const [chickenTypeId, setChickenTypeId] = (0, import_react.useState)("");
	const [weight, setWeight] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [reverseId, setReverseId] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const sales = useSalesForDate(date);
	const period = usePeriod(date, date);
	const chickenTypes = useChickenTypes();
	const addSale = useAddSale();
	const reverseSale = useReverseSale();
	const s = summarize(period.data);
	const w = Number(weight || 0);
	const a = Number(amount || 0);
	const activeChickenTypes = chickenTypes.data?.filter((type) => type.is_active) ?? [];
	const selectedChickenType = activeChickenTypes.find((type) => type.id === chickenTypeId);
	function startSale() {
		setChickenTypeId("");
		setWeight("");
		setAmount("");
		setMethod("cash");
		setStep("chickenType");
	}
	function save() {
		if (!chickenTypeId) {
			toast.error("Please select chicken type");
			return;
		}
		if (w <= 0) {
			toast.error("Weight must be greater than 0");
			return;
		}
		if (a <= 0) {
			toast.error("Amount must be greater than 0");
			return;
		}
		if (!method) {
			toast.error("Please select payment method");
			return;
		}
		addSale.mutate({
			business_date: date,
			weight_kg: w,
			amount: a,
			payment_method: method,
			chicken_type_id: chickenTypeId
		}, {
			onSuccess: () => {
				toast.success(`Saved ${selectedChickenType?.name ?? "Chicken"} · ${kg(w)} · ${inr(a)}`);
				setChickenTypeId("");
				setWeight("");
				setAmount("");
				setMethod("cash");
				setStep("list");
			},
			onError: (e) => {
				toast.error(e instanceof Error ? e.message : "Could not save sale");
			}
		});
	}
	if (step === "chickenType") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setStep("list"),
					className: "mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
					children: "Daily Sales"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-bold",
					children: "SELECT CHICKEN TYPE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Choose exactly one chicken type"
				})
			]
		}), chickenTypes.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border bg-card p-10 text-center",
			children: "Loading chicken types..."
		}) : activeChickenTypes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border bg-card p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: "No chicken types available"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Add a chicken type from Settings."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: activeChickenTypes.filter((type) => type.name !== "Unspecified / Legacy").map((type) => {
				const selected = chickenTypeId === type.id;
				const isBroiler = type.name.toLowerCase() === "broiler";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setChickenTypeId(type.id);
						setStep("weight");
					},
					className: cn("min-h-48 rounded-2xl border-2 bg-card p-6 text-center shadow-[var(--shadow-card)] transition-all", "active:scale-[0.98]", selected ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/50"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("flex size-20 items-center justify-center rounded-full", selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
								children: isBroiler ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bird, { className: "size-10" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wheat, { className: "size-10" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold uppercase",
							children: type.name
						}),
						selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-sm font-semibold text-primary",
							children: "✓ SELECTED"
						})
					]
				}, type.id);
			})
		}) })]
	});
	if (step === "weight") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-xl border bg-card px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: "Chicken Type"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-bold",
				children: selectedChickenType?.name ?? "Not selected"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberPad, {
			label: "Weight",
			value: weight,
			suffix: "kg",
			onChange: setWeight,
			onConfirm: () => {
				if (w <= 0) {
					toast.error("Enter a valid weight");
					return;
				}
				setStep("amount");
			},
			confirmDisabled: w <= 0,
			onBack: () => setStep("chickenType"),
			hint: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: prettyDate(date) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-1",
					children: "·"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedChickenType?.name })
			] })
		})]
	});
	if (step === "amount") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-xl border bg-card px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-muted-foreground",
					children: "Chicken Type"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-bold",
					children: selectedChickenType?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 border-t pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: "Weight"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl font-bold",
						children: kg(w)
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberPad, {
			label: "Amount received",
			value: amount,
			prefix: "₹",
			onChange: setAmount,
			onConfirm: save,
			confirmLabel: addSale.isPending ? "Saving…" : "Save sale",
			confirmDisabled: a <= 0 || addSale.isPending,
			onBack: () => setStep("weight"),
			hint: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [kg(w), a > 0 ? ` · ${inr(a / w, true)}/kg` : ""] }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm font-semibold",
					children: "Payment method"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3",
					children: ["cash", "online"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMethod(m),
						className: cn("flex h-16 items-center justify-center gap-2 rounded-xl border text-base font-semibold capitalize transition-colors", method === m ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground"),
						children: [m === "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-5" }), m]
					}, m))
				})]
			})
		})]
	});
	const rows = sales.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Sales"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: prettyDate(date)
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateBar, {
				date,
				onChange: setDate
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Weight sold",
					value: kg(s.weightSold, 2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Revenue",
					value: inr(s.revenue)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Sales",
					value: s.saleCount
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Cash",
					value: inr(s.cash)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Online",
					value: inr(s.online)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Avg rate",
					value: `${inr(s.avgSellRate, true)}/kg`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 grid gap-3 sm:grid-cols-2",
			children: activeChickenTypes.filter((type) => type.name !== "Unspecified / Legacy").map((type) => {
				const typeRows = rows.filter((r) => r.chicken_type_id === type.id && r.status === "active");
				const typeWeight = typeRows.reduce((sum, r) => sum + Number(r.weight_kg || 0), 0);
				const typeRevenue = typeRows.reduce((sum, r) => sum + Number(r.amount || 0), 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground",
						children: type.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Weight"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: kg(typeWeight, 2)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Revenue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: inr(typeRevenue)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Rate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: typeWeight > 0 ? `${inr(typeRevenue / typeWeight, true)}/kg` : "₹0/kg"
							})] })
						]
					})]
				}, type.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 hidden overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[2.5rem_6rem_1fr_1fr_5rem_5rem_2.5rem] gap-2 border-b bg-surface px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Weight" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amount" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payment" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Time" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
				]
			}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-10 text-center text-sm text-muted-foreground",
				children: "No sales recorded for this day yet."
			}) : rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid grid-cols-[2.5rem_6rem_1fr_1fr_5rem_5rem_2.5rem] items-center gap-2 border-b px-3 py-3 text-sm last:border-0", r.status !== "active" && "text-muted-foreground line-through"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: i + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: r.chicken_types?.name ?? "Unspecified / Legacy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: kg(r.weight_kg)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: inr(r.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs capitalize",
						children: r.payment_method
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: prettyTime(r.sold_at)
					}),
					r.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setReverseId(r.id);
							setReason("");
						},
						"aria-label": "Reverse sale",
						className: "text-muted-foreground hover:text-negative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
				]
			}, r.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 space-y-3 lg:hidden",
			children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
				children: "No sales recorded for this day yet."
			}) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]", r.status !== "active" && "opacity-60 line-through"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-bold uppercase",
							children: r.chicken_types?.name ?? "Unspecified / Legacy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold",
							children: kg(r.weight_kg)
						})] }), r.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setReverseId(r.id);
								setReason("");
							},
							"aria-label": "Reverse sale",
							className: "rounded-lg p-2 text-muted-foreground hover:text-negative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 gap-2 border-t pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Amount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: inr(r.amount)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Rate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: r.weight_kg > 0 ? `${inr(Number(r.amount) / Number(r.weight_kg), true)}/kg` : "₹0/kg"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Payment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold capitalize",
								children: r.payment_method
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: prettyTime(r.sold_at)
					})
				]
			}, r.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-x-0 bottom-16 z-20 px-4 lg:static lg:mt-5 lg:px-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "h-16 w-full text-lg font-bold shadow-[var(--shadow-card)] lg:h-14 lg:w-56",
				onClick: startSale,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" }), "ADD SALE"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!reverseId,
			onOpenChange: (o) => !o && setReverseId(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Reverse this sale?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "The record is never deleted. It is marked reversed and kept in the audit history with your reason." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Reason (e.g. duplicate entry)",
					value: reason,
					onChange: (e) => setReason(e.target.value),
					maxLength: 200
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					disabled: reason.trim().length < 3,
					onClick: () => {
						if (!reverseId) return;
						reverseSale.mutate({
							id: reverseId,
							reason: reason.trim()
						}, {
							onSuccess: () => toast.success("Sale reversed"),
							onError: () => toast.error("Could not reverse sale")
						});
						setReverseId(null);
					},
					children: "Reverse sale"
				})] })
			] })
		})
	] });
}
//#endregion
export { SalesPage as component };

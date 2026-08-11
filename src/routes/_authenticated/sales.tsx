import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  useSalesForDate,
  useAddSale,
  useReverseSale,
  usePeriod,
  useChickenTypes,
} from "@/lib/data";
import { summarize } from "@/lib/finance";
import { businessToday, inr, kg, prettyDate, prettyTime } from "@/lib/format";
import { Stat, DateBar } from "@/components/Stat";
import { NumberPad } from "@/components/NumberPad";
import { Button } from "@/components/ui/button";
import { Plus, Banknote, Smartphone, Undo2, ArrowLeft, Wheat, Bird } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/sales")({
  head: () => ({
    meta: [
      { title: "Daily Sales — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Fast counter sales entry with chicken type, weight, amount, payment method and daily totals.",
      },
      {
        property: "og:title",
        content: "Daily Sales — Brothers Chicken Adda",
      },
      {
        property: "og:description",
        content: "Counter-fast sales entry and daily sales summary.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SalesPage,
});

type Step = "list" | "chickenType" | "weight" | "amount";

function SalesPage() {
  const [date, setDate] = useState(businessToday());
  const [step, setStep] = useState<Step>("list");

  const [chickenTypeId, setChickenTypeId] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "online">("cash");

  const [reverseId, setReverseId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const sales = useSalesForDate(date);
  const period = usePeriod(date, date);
  const chickenTypes = useChickenTypes();

  const addSale = useAddSale();
  const reverseSale = useReverseSale();

  const s = summarize(period.data);

  const w = Number(weight || 0);
  const a = Number(amount || 0);

  const activeChickenTypes =
    chickenTypes.data?.filter((type) => type.is_active) ?? [];

  const selectedChickenType = activeChickenTypes.find(
    (type) => type.id === chickenTypeId,
  );

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

    addSale.mutate(
      {
        business_date: date,
        weight_kg: w,
        amount: a,
        payment_method: method,
        chicken_type_id: chickenTypeId,
      },
      {
        onSuccess: () => {
          toast.success(
            `Saved ${selectedChickenType?.name ?? "Chicken"} · ${kg(w)} · ${inr(a)}`,
          );

          setChickenTypeId("");
          setWeight("");
          setAmount("");
          setMethod("cash");
          setStep("list");
        },
        onError: (e) => {
          toast.error(
            e instanceof Error ? e.message : "Could not save sale",
          );
        },
      },
    );
  }

  /*
   * -----------------------------------------
   * CHICKEN TYPE SCREEN
   * -----------------------------------------
   */

  if (step === "chickenType") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setStep("list")}
            className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Daily Sales
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            SELECT CHICKEN TYPE
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose exactly one chicken type
          </p>
        </div>

        {chickenTypes.isLoading ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            Loading chicken types...
          </div>
        ) : activeChickenTypes.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <p className="font-semibold">No chicken types available</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a chicken type from Settings.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeChickenTypes
                .filter(
                  (type) =>
                    type.name !== "Unspecified / Legacy",
                )
                .map((type) => {
                  const selected = chickenTypeId === type.id;

                  const isBroiler =
                    type.name.toLowerCase() === "broiler";

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setChickenTypeId(type.id);
                        setStep("weight");
                      }}
                      className={cn(
                        "min-h-48 rounded-2xl border-2 bg-card p-6 text-center shadow-[var(--shadow-card)] transition-all",
                        "active:scale-[0.98]",
                        selected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <div className="mb-4 flex justify-center">
                        <div
                          className={cn(
                            "flex size-20 items-center justify-center rounded-full",
                            selected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground",
                          )}
                        >
                          {isBroiler ? (
                            <Bird className="size-10" />
                          ) : (
                            <Wheat className="size-10" />
                          )}
                        </div>
                      </div>

                      <div className="text-xl font-bold uppercase">
                        {type.name}
                      </div>

                      {selected && (
                        <div className="mt-2 text-sm font-semibold text-primary">
                          ✓ SELECTED
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>

        
          </>
        )}
      </div>
    );
  }

  /*
   * -----------------------------------------
   * WEIGHT SCREEN
   * -----------------------------------------
   */

  if (step === "weight") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 rounded-xl border bg-card px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Chicken Type
          </p>

          <p className="text-lg font-bold">
            {selectedChickenType?.name ?? "Not selected"}
          </p>
        </div>

        <NumberPad
          label="Weight"
          value={weight}
          suffix="kg"
          onChange={setWeight}
          onConfirm={() => {
            if (w <= 0) {
              toast.error("Enter a valid weight");
              return;
            }

            setStep("amount");
          }}
          confirmDisabled={w <= 0}
          onBack={() => setStep("chickenType")}
          hint={
            <>
              <span>{prettyDate(date)}</span>
              <span className="mx-1">·</span>
              <span>{selectedChickenType?.name}</span>
            </>
          }
        />
      </div>
    );
  }

  /*
   * -----------------------------------------
   * AMOUNT SCREEN
   * -----------------------------------------
   */

  if (step === "amount") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 rounded-xl border bg-card px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Chicken Type
          </p>

          <p className="text-lg font-bold">
            {selectedChickenType?.name}
          </p>

          <div className="mt-3 border-t pt-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Weight
            </p>

            <p className="text-xl font-bold">
              {kg(w)}
            </p>
          </div>
        </div>

        <NumberPad
          label="Amount received"
          value={amount}
          prefix="₹"
          onChange={setAmount}
          onConfirm={save}
          confirmLabel={addSale.isPending ? "Saving…" : "Save sale"}
          confirmDisabled={a <= 0 || addSale.isPending}
          onBack={() => setStep("weight")}
          hint={
            <>
              {kg(w)}
              {a > 0 ? ` · ${inr(a / w, true)}/kg` : ""}
            </>
          }
        >
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold">
              Payment method
            </p>

            <div className="grid grid-cols-2 gap-3">
              {(["cash", "online"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={cn(
                    "flex h-16 items-center justify-center gap-2 rounded-xl border text-base font-semibold capitalize transition-colors",
                    method === m
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card text-foreground",
                  )}
                >
                  {m === "cash" ? (
                    <Banknote className="size-5" />
                  ) : (
                    <Smartphone className="size-5" />
                  )}

                  {m}
                </button>
              ))}
            </div>
          </div>
        </NumberPad>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * SALES LIST
   * -----------------------------------------
   */

  const rows = sales.data ?? [];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-sm text-muted-foreground">
            {prettyDate(date)}
          </p>
        </div>

        <DateBar date={date} onChange={setDate} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Weight sold" value={kg(s.weightSold, 2)} />
        <Stat label="Revenue" value={inr(s.revenue)} />
        <Stat label="Sales" value={s.saleCount} />
        <Stat label="Cash" value={inr(s.cash)} />
        <Stat label="Online" value={inr(s.online)} />
        <Stat
          label="Avg rate"
          value={`${inr(s.avgSellRate, true)}/kg`}
        />
      </div>

      {/* TYPE TOTALS */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {activeChickenTypes
          .filter(
            (type) => type.name !== "Unspecified / Legacy",
          )
          .map((type) => {
            const typeRows = rows.filter(
              (r: any) =>
                r.chicken_type_id === type.id &&
                r.status === "active",
            );

            const typeWeight = typeRows.reduce(
              (sum: number, r: any) => sum + Number(r.weight_kg || 0),
              0,
            );

            const typeRevenue = typeRows.reduce(
              (sum: number, r: any) => sum + Number(r.amount || 0),
              0,
            );

            return (
              <div
                key={type.id}
                className="rounded-xl border bg-card p-4"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {type.name}
                </p>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Weight
                    </p>
                    <p className="font-bold">
                      {kg(typeWeight, 2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Revenue
                    </p>
                    <p className="font-bold">
                      {inr(typeRevenue)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Rate
                    </p>
                    <p className="font-bold">
                      {typeWeight > 0
                        ? `${inr(typeRevenue / typeWeight, true)}/kg`
                        : "₹0/kg"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="mt-5 hidden overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] lg:block">
        <div className="grid grid-cols-[2.5rem_6rem_1fr_1fr_5rem_5rem_2.5rem] gap-2 border-b bg-surface px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>No.</span>
          <span>Type</span>
          <span>Weight</span>
          <span>Amount</span>
          <span>Payment</span>
          <span>Time</span>
          <span />
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No sales recorded for this day yet.
          </p>
        ) : (
          rows.map((r: any, i) => (
            <div
              key={r.id}
              className={cn(
                "grid grid-cols-[2.5rem_6rem_1fr_1fr_5rem_5rem_2.5rem] items-center gap-2 border-b px-3 py-3 text-sm last:border-0",
                r.status !== "active" &&
                "text-muted-foreground line-through",
              )}
            >
              <span className="text-muted-foreground">
                {i + 1}
              </span>

              <span className="font-semibold">
                {r.chicken_types?.name ?? "Unspecified / Legacy"}
              </span>

              <span className="font-medium">
                {kg(r.weight_kg)}
              </span>

              <span className="font-semibold">
                {inr(r.amount)}
              </span>

              <span className="text-xs capitalize">
                {r.payment_method}
              </span>

              <span className="text-xs text-muted-foreground">
                {prettyTime(r.sold_at)}
              </span>

              {r.status === "active" ? (
                <button
                  onClick={() => {
                    setReverseId(r.id);
                    setReason("");
                  }}
                  aria-label="Reverse sale"
                  className="text-muted-foreground hover:text-negative"
                >
                  <Undo2 className="size-4" />
                </button>
              ) : (
                <span />
              )}
            </div>
          ))
        )}
      </div>

      {/* MOBILE TRANSACTION CARDS */}
      <div className="mt-5 space-y-3 lg:hidden">
        {rows.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            No sales recorded for this day yet.
          </div>
        ) : (
          rows.map((r: any) => (
            <div
              key={r.id}
              className={cn(
                "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
                r.status !== "active" &&
                "opacity-60 line-through",
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold uppercase">
                    {r.chicken_types?.name ??
                      "Unspecified / Legacy"}
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {kg(r.weight_kg)}
                  </p>
                </div>

                {r.status === "active" && (
                  <button
                    onClick={() => {
                      setReverseId(r.id);
                      setReason("");
                    }}
                    aria-label="Reverse sale"
                    className="rounded-lg p-2 text-muted-foreground hover:text-negative"
                  >
                    <Undo2 className="size-5" />
                  </button>
                )}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Amount
                  </p>
                  <p className="font-bold">
                    {inr(r.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Rate
                  </p>
                  <p className="font-bold">
                    {r.weight_kg > 0
                      ? `${inr(
                        Number(r.amount) /
                        Number(r.weight_kg),
                        true,
                      )}/kg`
                      : "₹0/kg"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Payment
                  </p>
                  <p className="font-bold capitalize">
                    {r.payment_method}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {prettyTime(r.sold_at)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ADD SALE */}
      <div className="fixed inset-x-0 bottom-16 z-20 px-4 lg:static lg:mt-5 lg:px-0">
        <Button
          className="h-16 w-full text-lg font-bold shadow-[var(--shadow-card)] lg:h-14 lg:w-56"
          onClick={startSale}
        >
          <Plus className="size-6" />
          ADD SALE
        </Button>
      </div>

      {/* REVERSE SALE */}
      <AlertDialog
        open={!!reverseId}
        onOpenChange={(o) => !o && setReverseId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Reverse this sale?
            </AlertDialogTitle>

            <AlertDialogDescription>
              The record is never deleted. It is marked reversed
              and kept in the audit history with your reason.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            placeholder="Reason (e.g. duplicate entry)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={200}
          />

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={reason.trim().length < 3}
              onClick={() => {
                if (!reverseId) return;

                reverseSale.mutate(
                  {
                    id: reverseId,
                    reason: reason.trim(),
                  },
                  {
                    onSuccess: () =>
                      toast.success("Sale reversed"),
                    onError: () =>
                      toast.error("Could not reverse sale"),
                  },
                );

                setReverseId(null);
              }}
            >
              Reverse sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
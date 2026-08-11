import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { usePeriod, useAddExpense, useCategories } from "@/lib/data";
import { businessToday, inr, prettyDate, addDays } from "@/lib/format";
import { PageHeader, Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  head: () => ({
    meta: [
      { title: "Shop Expenses — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Track rent, wages, electricity, ice, transport and other running costs of the chicken shop with category totals.",
      },
      { property: "og:title", content: "Shop Expenses — Brothers Chicken Adda" },
      { property: "og:description", content: "Daily running costs by category." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const today = businessToday();
  const [from, setFrom] = useState(addDays(today, -30));
  const [to, setTo] = useState(today);
  const [open, setOpen] = useState(false);
  const period = usePeriod(from, to);
  const categories = useCategories();
  const addExpense = useAddExpense();
  const rows = period.data?.expenses ?? [];
  const total = rows.reduce((s, r) => s + Number(r.amount), 0);

  const [form, setForm] = useState({
    business_date: today,
    category_id: "",
    amount: "",
    payment_method: "cash",
    note: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (Number(form.amount) <= 0) return;
    addExpense.mutate(
      {
        business_date: form.business_date,
        category_id: form.category_id || null,
        amount: Number(form.amount),
        payment_method: form.payment_method,
        notes: form.note || null,
      },
      {
        onSuccess: () => {
          toast.success("Expense saved");
          setForm((f) => ({ ...f, amount: "", note: "" }));
          setOpen(false);
        },
        onError: () => toast.error("Could not save expense"),
      },
    );
  }

  const byCategory = new Map<string, number>();
  for (const r of rows) {
    const name = r.expense_categories?.name ?? "Uncategorised";
    byCategory.set(name, (byCategory.get(name) ?? 0) + Number(r.amount));
  }

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Running costs of the shop"
        action={
          <Button className="h-11" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Add expense
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="h-11 rounded-lg border bg-card px-3 text-sm"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="h-11 rounded-lg border bg-card px-3 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total expenses" value={inr(total)} tone="caution" />
        <Stat label="Entries" value={rows.length} />
        <Stat
          label="Daily average"
          value={inr(total / Math.max(1, byCategory.size ? rows.length : 1))}
        />
        <Stat label="Categories used" value={byCategory.size} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">By category</h2>
          <div className="mt-3 space-y-2 text-sm">
            {[...byCategory.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([name, amount]) => (
                <div key={name} className="flex justify-between">
                  <span>{name}</span>
                  <span className="num font-semibold">{inr(amount)}</span>
                </div>
              ))}
            {byCategory.size === 0 ? (
              <p className="text-muted-foreground">No expenses in this period.</p>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] lg:col-span-2">
          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing recorded yet.
            </p>
          ) : (
            rows.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between border-b px-4 py-3 text-sm last:border-0"
              >
                <div>
                  <p className="font-medium">{r.expense_categories?.name ?? "Uncategorised"}</p>
                  <p className="text-xs text-muted-foreground">
                    {prettyDate(r.business_date)} · {r.payment_method}
                    {r.notes ? ` · ${r.notes}` : ""}
                  </p>
                </div>
                <p className="num font-semibold">{inr(r.amount)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add expense</SheetTitle>
          </SheetHeader>
          <form onSubmit={submit} className="space-y-4 px-4 pb-8">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Date</Label>
              <Input
                type="date"
                value={form.business_date}
                onChange={(e) => setForm({ ...form, business_date: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Category</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm({ ...form, category_id: v })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {(categories.data ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Amount (₹)</Label>
              <Input
                inputMode="decimal"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Paid by</Label>
              <Select
                value={form.payment_method}
                onValueChange={(v) => setForm({ ...form, payment_method: v })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Note</Label>
              <Input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                maxLength={200}
                className="h-11"
              />
            </div>
            <Button type="submit" className="h-12 w-full" disabled={addExpense.isPending}>
              Save expense
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

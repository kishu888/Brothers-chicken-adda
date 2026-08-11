import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { usePeriod, useCashDay, useSaveCashDay } from "@/lib/data";
import { businessToday, inr, prettyDate } from "@/lib/format";
import { PageHeader, Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/cash")({
  head: () => ({
    meta: [
      { title: "Cash & Online Reconciliation — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Close the day by matching counted cash and verified UPI receipts against recorded sales and cash expenses.",
      },
      { property: "og:title", content: "Cash & Online Reconciliation — Brothers Chicken Adda" },
      { property: "og:description", content: "Daily cash drawer and UPI matching." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CashPage,
});

function CashPage() {
  const [date, setDate] = useState(businessToday());
  const period = usePeriod(date, date);
  const day = useCashDay(date);
  const save = useSaveCashDay();

  const sales = (period.data?.sales ?? []).filter((s) => (s.status ?? "active") === "active");
  const expenses = (period.data?.expenses ?? []).filter((e) => (e.status ?? "active") === "active");
  const cashSales = sales
    .filter((s) => s.payment_method === "cash")
    .reduce((s, r) => s + Number(r.amount), 0);
  const onlineSales = sales
    .filter((s) => s.payment_method === "online")
    .reduce((s, r) => s + Number(r.amount), 0);
  const cashExpenses = expenses
    .filter((e) => e.payment_method === "cash")
    .reduce((s, r) => s + Number(r.amount), 0);

  const [form, setForm] = useState({
    opening_cash: "",
    actual_cash: "",
    verified_online: "",
    note: "",
  });

  useEffect(() => {
    setForm({
      opening_cash: day.data?.opening_cash != null ? String(day.data.opening_cash) : "",
      actual_cash: day.data?.actual_cash != null ? String(day.data.actual_cash) : "",
      verified_online: day.data?.verified_online != null ? String(day.data.verified_online) : "",
      note: day.data?.note ?? "",
    });
  }, [day.data, date]);

  const opening = Number(form.opening_cash || 0);
  const expectedCash = opening + cashSales - cashExpenses;
  const actualCash = form.actual_cash === "" ? null : Number(form.actual_cash);
  const cashDiff = actualCash === null ? null : actualCash - expectedCash;
  const verifiedOnline = form.verified_online === "" ? null : Number(form.verified_online);
  const onlineDiff = verifiedOnline === null ? null : verifiedOnline - onlineSales;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(
      {
        business_date: date,
        opening_cash: opening,
        actual_cash: actualCash,
        verified_online: verifiedOnline,
        note: form.note || null,
      },
      {
        onSuccess: () => toast.success("Day closed and saved"),
        onError: () => toast.error("Could not save reconciliation"),
      },
    );
  }

  return (
    <div>
      <PageHeader
        title="Cash & Online"
        description={`Closing for ${prettyDate(date)}`}
        action={
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 rounded-lg border bg-card px-3 text-sm font-medium"
          />
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Cash sales" value={inr(cashSales)} />
        <Stat label="Online sales" value={inr(onlineSales)} />
        <Stat label="Cash expenses" value={inr(cashExpenses)} tone="caution" />
        <Stat label="Expected in drawer" value={inr(expectedCash)} tone="positive" />
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Cash drawer</h2>
          <div className="mt-3 space-y-3">
            <Field
              label="Opening cash (₹)"
              value={form.opening_cash}
              onChange={(v) => setForm({ ...form, opening_cash: v })}
            />
            <Field
              label="Counted cash at close (₹)"
              value={form.actual_cash}
              onChange={(v) => setForm({ ...form, actual_cash: v })}
            />
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <Row label="Opening" value={inr(opening)} />
              <Row label="+ Cash sales" value={inr(cashSales)} />
              <Row label="− Cash expenses" value={inr(cashExpenses)} />
              <Row label="= Expected" value={inr(expectedCash)} bold />
              <Row
                label="Difference"
                value={cashDiff === null ? "Not counted" : inr(cashDiff)}
                tone={cashDiff === null ? undefined : Math.abs(cashDiff) < 1 ? "positive" : "negative"}
                bold
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Online / UPI</h2>
          <div className="mt-3 space-y-3">
            <Field
              label="Verified in bank / UPI app (₹)"
              value={form.verified_online}
              onChange={(v) => setForm({ ...form, verified_online: v })}
            />
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <Row label="Recorded online sales" value={inr(onlineSales)} />
              <Row
                label="Difference"
                value={onlineDiff === null ? "Not verified" : inr(onlineDiff)}
                tone={
                  onlineDiff === null ? undefined : Math.abs(onlineDiff) < 1 ? "positive" : "negative"
                }
                bold
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Note</Label>
              <Input
                className="h-11"
                maxLength={200}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <Button type="submit" className="h-12 w-full" disabled={save.isPending}>
              Save day close
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase">{label}</Label>
      <Input
        inputMode="decimal"
        className="h-12 text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  tone,
}: {
  label: string;
  value: string;
  bold?: boolean;
  tone?: "positive" | "negative" | undefined;
}) {
  return (
    <div className="flex justify-between py-0.5">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span
        className={[
          "num",
          bold ? "font-bold" : "font-medium",
          tone === "positive" ? "text-positive" : "",
          tone === "negative" ? "text-negative" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

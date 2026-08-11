import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  usePeriod,
  useAddPurchase,
  useSuppliers,
  useChickenTypes,
  uploadBill,
} from "@/lib/data";
import { businessToday, inr, kg, prettyDate, addDays } from "@/lib/format";
import { PageHeader, Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/purchases")({
  head: () => ({
    meta: [
      { title: "Chicken Purchases — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Record wholesaler chicken purchases with gross weight, crate tare, automatic net weight, supplier rebate and bill upload.",
      },
      { property: "og:title", content: "Chicken Purchases — Brothers Chicken Adda" },
      { property: "og:description", content: "Wholesaler purchases, rates and bills." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PurchasesPage,
});

function PurchasesPage() {
  const today = businessToday();
  const [from, setFrom] = useState(addDays(today, -30));
  const [to, setTo] = useState(today);
  const [open, setOpen] = useState(false);
  const period = usePeriod(from, to);
  const rows = period.data?.purchases ?? [];

  const totalNet = rows.reduce((s, r) => s + Number(r.net_weight_kg ?? 0), 0);
  const totalCost = rows.reduce((s, r) => s + Number(r.total_cost ?? 0), 0);

  return (
    <div>
      <PageHeader
        title="Purchases"
        description="Chicken received from wholesalers"
        action={
          <Button className="h-11" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> New purchase
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
        <Stat label="Net chicken bought" value={kg(totalNet, 2)} />
        <Stat label="Purchase cost" value={inr(totalCost)} />
        <Stat
          label="Effective rate"
          value={totalNet > 0 ? `${inr(totalCost / totalNet, true)}/kg` : "—"}
        />
        <Stat label="Loads" value={rows.length} />
      </div>

      <div className="mt-5 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            No purchases in this period.
          </p>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {r.suppliers?.name ?? "Supplier not set"}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {r.chicken_types?.name ?? ""}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {prettyDate(r.business_date)}
                    {r.invoice_number ? ` · Invoice ${r.invoice_number}` : ""}
                  </p>
                </div>
                <p className="num text-lg font-bold">{inr(r.total_cost ?? 0)}</p>
              </div>
              <div className="num mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
                <Detail label="Gross" value={kg(r.gross_weight_kg, 2)} />
                <Detail label="Crate tare" value={kg(r.tare_weight_kg, 2)} />
                <Detail label="Net" value={kg(r.net_weight_kg ?? 0, 2)} />
                <Detail
                  label="Effective rate"
                  value={`${inr(r.effective_rate ?? 0, true)}/kg`}
                />
                <Detail label="Listed rate" value={`${inr(r.listed_rate, true)}/kg`} />
                <Detail label="Rebate" value={`${inr(r.discount_per_kg, true)}/kg`} />
                <Detail label="Other charges" value={inr(r.other_charges)} />
                <Detail label="Paid" value={inr(r.amount_paid)} />
              </div>
            </div>
          ))
        )}
      </div>

      <PurchaseSheet open={open} onOpenChange={setOpen} />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function PurchaseSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const suppliers = useSuppliers();
  const types = useChickenTypes();
  const addPurchase = useAddPurchase();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
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
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const num = (v: string) => Number(v || 0);
  const net = num(form.gross_weight_kg) - num(form.tare_weight_kg);
  const effective = num(form.listed_rate) - num(form.discount_per_kg);
  const total = net * effective + num(form.other_charges);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (net <= 0) {
      toast.error("Net weight must be greater than zero");
      return;
    }
    setBusy(true);
    try {
      let supplierId = form.supplier_id || null;
      if (!supplierId && form.new_supplier.trim()) {
        const { data, error } = await supabase
          .from("suppliers")
          .insert({ name: form.new_supplier.trim() })
          .select()
          .single();
        if (error) throw error;
        supplierId = data.id;
        qc.invalidateQueries({ queryKey: ["suppliers"] });
      }

      let documentId: string | null = null;
      if (file) {
        const doc = await uploadBill(file, {
          doc_date: form.business_date,
          category: "Chicken Purchase",
          supplier_id: supplierId,
          invoice_number: form.invoice_number || null,
          amount: total,
          related_type: "purchase",
        });
        documentId = doc.id;
      }

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
        notes: form.notes || null,
      });
      toast.success("Purchase saved");
      onOpenChange(false);
      setForm((f) => ({
        ...f,
        gross_weight_kg: "",
        tare_weight_kg: "",
        invoice_number: "",
        amount_paid: "",
        notes: "",
      }));
      setFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save purchase");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New chicken purchase</SheetTitle>
        </SheetHeader>
        <form onSubmit={submit} className="space-y-4 px-4 pb-8">
          <Field label="Purchase date">
            <Input
              type="date"
              value={form.business_date}
              onChange={(e) => set("business_date", e.target.value)}
              className="h-11"
              required
            />
          </Field>

          <Field label="Supplier">
            <Select value={form.supplier_id} onValueChange={(v) => set("supplier_id", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choose supplier" />
              </SelectTrigger>
              <SelectContent>
                {(suppliers.data ?? []).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="…or type a new supplier name"
              value={form.new_supplier}
              onChange={(e) => set("new_supplier", e.target.value)}
              className="mt-2 h-11"
              maxLength={120}
            />
          </Field>

          <Field label="Chicken type">
            <Select value={form.chicken_type_id} onValueChange={(v) => set("chicken_type_id", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choose type" />
              </SelectTrigger>
              <SelectContent>
                {(types.data ?? []).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Gross / load weight (kg)">
              <Input
                inputMode="decimal"
                value={form.gross_weight_kg}
                onChange={(e) => set("gross_weight_kg", e.target.value)}
                className="h-11"
              />
            </Field>
            <Field label="Empty crate weight (kg)">
              <Input
                inputMode="decimal"
                value={form.tare_weight_kg}
                onChange={(e) => set("tare_weight_kg", e.target.value)}
                className="h-11"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Listed rate (₹/kg)">
              <Input
                inputMode="decimal"
                value={form.listed_rate}
                onChange={(e) => set("listed_rate", e.target.value)}
                className="h-11"
              />
            </Field>
            <Field label="Supplier rebate (₹/kg)">
              <Input
                inputMode="decimal"
                value={form.discount_per_kg}
                onChange={(e) => set("discount_per_kg", e.target.value)}
                className="h-11"
              />
            </Field>
          </div>

          <div className="num rounded-xl border bg-surface p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Net chicken weight</span>
              <span className="font-semibold">{kg(net, 3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Effective purchase rate</span>
              <span className="font-semibold">{inr(effective, true)}/kg</span>
            </div>
            <div className="mt-1 flex justify-between border-t pt-1">
              <span className="text-muted-foreground">Total purchase cost</span>
              <span className="font-bold">{inr(total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Other charges (₹)">
              <Input
                inputMode="decimal"
                value={form.other_charges}
                onChange={(e) => set("other_charges", e.target.value)}
                className="h-11"
              />
            </Field>
            <Field label="Amount paid (₹)">
              <Input
                inputMode="decimal"
                value={form.amount_paid}
                onChange={(e) => set("amount_paid", e.target.value)}
                className="h-11"
              />
            </Field>
          </div>

          <Field label="Payment method">
            <Select
              value={form.payment_method}
              onValueChange={(v) => set("payment_method", v)}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Invoice number">
              <Input
                value={form.invoice_number}
                onChange={(e) => set("invoice_number", e.target.value)}
                className="h-11"
                maxLength={60}
              />
            </Field>
            <Field label="Supplier GSTIN">
              <Input
                value={form.gstin}
                onChange={(e) => set("gstin", e.target.value)}
                className="h-11"
                maxLength={20}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Taxable amount (₹)">
              <Input
                inputMode="decimal"
                value={form.taxable_amount}
                onChange={(e) => set("taxable_amount", e.target.value)}
                className="h-11"
              />
            </Field>
            <Field label="CGST (₹)">
              <Input
                inputMode="decimal"
                value={form.cgst}
                onChange={(e) => set("cgst", e.target.value)}
                className="h-11"
              />
            </Field>
            <Field label="SGST (₹)">
              <Input
                inputMode="decimal"
                value={form.sgst}
                onChange={(e) => set("sgst", e.target.value)}
                className="h-11"
              />
            </Field>
            <Field label="IGST (₹)">
              <Input
                inputMode="decimal"
                value={form.igst}
                onChange={(e) => set("igst", e.target.value)}
                className="h-11"
              />
            </Field>
          </div>

          <Field label="Bill photo or PDF">
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="h-11"
            />
          </Field>

          <Field label="Notes">
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              maxLength={500}
            />
          </Field>

          <Button type="submit" className="h-12 w-full text-base" disabled={busy}>
            {busy ? "Saving…" : "Save purchase"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs tracking-wide text-muted-foreground uppercase">{label}</Label>
      {children}
    </div>
  );
}

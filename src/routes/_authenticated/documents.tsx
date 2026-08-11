import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useDocuments, uploadBill, signedUrl, useSuppliers } from "@/lib/data";
import { scanBill } from "@/lib/ai.functions";
import { businessToday, inr, prettyDate } from "@/lib/format";
import { PageHeader, Stat } from "@/components/Stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/documents")({
  head: () => ({
    meta: [
      { title: "Bills & AI Bill Scanner — Brothers Chicken Adda" },
      {
        name: "description",
        content:
          "Upload supplier bills and receipts to secure private storage and let the AI scanner read supplier, weight, rate and amount automatically.",
      },
      { property: "og:title", content: "Bills & AI Bill Scanner — Brothers Chicken Adda" },
      { property: "og:description", content: "Secure bill storage with AI extraction." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DocumentsPage,
});

type Fields = Record<string, string | number | null>;

function DocumentsPage() {
  const docs = useDocuments();
  const suppliers = useSuppliers();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fields, setFields] = useState<Fields>({});
  const [meta, setMeta] = useState({
    doc_date: businessToday(),
    invoice_number: "",
    amount: "",
    supplier_id: "",
    category: "purchase",
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
        doc_date: typeof f["date"] === "string" ? (f["date"] as string) : m.doc_date,
        invoice_number:
          typeof f["invoice_number"] === "string" ? (f["invoice_number"] as string) : m.invoice_number,
        amount: f["amount"] != null ? String(f["amount"]) : m.amount,
      }));
      toast.success("Bill read — check the details below");
    },
    onError: (e: Error) => toast.error(e.message || "Scan failed"),
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a file");
      return uploadBill(file, {
        doc_date: meta.doc_date || null,
        invoice_number: meta.invoice_number || null,
        amount: meta.amount ? Number(meta.amount) : null,
        supplier_id: meta.supplier_id || null,
        category: meta.category || null,
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
    onError: (e: Error) => toast.error(e.message || "Upload failed"),
  });

  function pick(f: File | null) {
    setFile(f);
    setFields({});
    if (f && f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function openDoc(path: string) {
    try {
      window.open(await signedUrl(path), "_blank", "noopener");
    } catch {
      toast.error("Could not open that file");
    }
  }

  const rows = docs.data ?? [];
  const totalValue = rows.reduce((s, r) => s + Number(r.amount ?? 0), 0);

  return (
    <div>
      <PageHeader title="Bills & Documents" description="Private storage with an AI bill reader" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Documents" value={rows.length} />
        <Stat label="Value on file" value={inr(totalValue)} />
        <Stat label="Suppliers" value={(suppliers.data ?? []).length} />
        <Stat label="Storage" value="Private" sub="Signed links only" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Upload a bill</h2>

          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center">
            <Upload className="size-6 text-muted-foreground" />
            <span className="mt-2 text-sm font-medium">
              {file ? file.name : "Take a photo or choose a file"}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP or PDF up to 15 MB</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0] ?? null)}
            />
          </label>

          {preview ? (
            <img
              src={preview}
              alt="Preview of the supplier bill being uploaded"
              className="mt-3 max-h-56 w-full rounded-lg object-contain"
            />
          ) : null}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Bill date</Label>
              <Input
                type="date"
                className="h-11"
                value={meta.doc_date}
                onChange={(e) => setMeta({ ...meta, doc_date: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Invoice number</Label>
              <Input
                className="h-11"
                value={meta.invoice_number}
                onChange={(e) => setMeta({ ...meta, invoice_number: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Amount (₹)</Label>
              <Input
                inputMode="decimal"
                className="h-11"
                value={meta.amount}
                onChange={(e) => setMeta({ ...meta, amount: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase">Supplier</Label>
              <select
                className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                value={meta.supplier_id}
                onChange={(e) => setMeta({ ...meta, supplier_id: e.target.value })}
              >
                <option value="">Not linked</option>
                {(suppliers.data ?? []).map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-11"
              onClick={() => scan.mutate()}
              disabled={!preview || scan.isPending}
            >
              <Sparkles className="size-4" />
              {scan.isPending ? "Reading…" : "Scan with AI"}
            </Button>
            <Button className="h-11" onClick={() => upload.mutate()} disabled={!file || upload.isPending}>
              Save bill
            </Button>
          </div>

          {Object.keys(fields).length > 0 ? (
            <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                What the AI read
              </p>
              {Object.entries(fields)
                .filter(([, v]) => v !== null && v !== "")
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-muted-foreground">{k.replace(/_/g, " ")}</span>
                    <span className="num font-medium">{String(v)}</span>
                  </div>
                ))}
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
          <h2 className="border-b px-4 py-3 text-sm font-semibold">Saved documents</h2>
          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No bills uploaded yet.
            </p>
          ) : (
            <div className="max-h-[560px] overflow-y-auto">
              {rows.map((d) => (
                <button
                  key={d.id}
                  onClick={() => openDoc(d.storage_path)}
                  className="flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-left text-sm last:border-0 hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{d.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.doc_date ? prettyDate(d.doc_date) : "No date"}
                        {d.suppliers?.name ? ` · ${d.suppliers.name}` : ""}
                        {d.invoice_number ? ` · #${d.invoice_number}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {d.amount != null ? <span className="num font-semibold">{inr(d.amount)}</span> : null}
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

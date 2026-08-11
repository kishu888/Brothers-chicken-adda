import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { newClientKey } from "@/lib/format";

export type PaymentMethod = "cash" | "online";

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export async function logAudit(entry: {
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_value?: unknown;
  new_value?: unknown;
  reason?: string | null;
}) {
  const actor = await uid();
  await supabase.from("audit_logs").insert({
    actor_id: actor,
    action: entry.action,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id ?? null,
    old_value: (entry.old_value ?? null) as never,
    new_value: (entry.new_value ?? null) as never,
    reason: entry.reason ?? null,
  });
}

/* ---------- reference data ---------- */

export function useChickenTypes() {
  return useQuery({
    queryKey: ["chicken_types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chicken_types")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data;
    },
  });
}

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("suppliers").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["expense_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expense_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["business_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("business_settings").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/* ---------- period data ---------- */

export type PeriodData = {
  sales: Awaited<ReturnType<typeof fetchSales>>;
  purchases: Awaited<ReturnType<typeof fetchPurchases>>;
  expenses: Awaited<ReturnType<typeof fetchExpenses>>;
  wastage: Awaited<ReturnType<typeof fetchWastage>>;
};

async function fetchSales(from: string, to: string) {
  const { data, error } = await supabase
    .from("sales")
    .select("*, chicken_types(id, name)")
    .gte("business_date", from)
    .lte("business_date", to)
    .order("sold_at", { ascending: true });

  if (error) throw error;
  return data;
}

async function fetchPurchases(from: string, to: string) {
  const { data, error } = await supabase
    .from("purchases")
    .select("*, suppliers(name), chicken_types(name)")
    .gte("business_date", from)
    .lte("business_date", to)
    .order("business_date", { ascending: false });
  if (error) throw error;
  return data;
}

async function fetchExpenses(from: string, to: string) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, expense_categories(name, kind)")
    .gte("business_date", from)
    .lte("business_date", to)
    .order("business_date", { ascending: false });
  if (error) throw error;
  return data;
}

async function fetchWastage(from: string, to: string) {
  const { data, error } = await supabase
    .from("wastage")
    .select("*, chicken_types(name)")
    .gte("business_date", from)
    .lte("business_date", to)
    .order("business_date", { ascending: false });
  if (error) throw error;
  return data;
}

export function usePeriod(from: string, to: string) {
  return useQuery({
    queryKey: ["period", from, to],
    queryFn: async (): Promise<PeriodData> => {
      const [sales, purchases, expenses, wastage] = await Promise.all([
        fetchSales(from, to),
        fetchPurchases(from, to),
        fetchExpenses(from, to),
        fetchWastage(from, to),
      ]);
      return { sales, purchases, expenses, wastage };
    },
  });
}

export function useSalesForDate(date: string) {
  return useQuery({
    queryKey: ["sales", date],
    queryFn: () => fetchSales(date, date),
  });
}

/* ---------- mutations ---------- */

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["period"] });
  qc.invalidateQueries({ queryKey: ["sales"] });
  qc.invalidateQueries({ queryKey: ["stock"] });
  qc.invalidateQueries({ queryKey: ["cash_day"] });
}

export function useAddSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      business_date: string;
      weight_kg: number;
      amount: number;
      payment_method: PaymentMethod;
      chicken_type_id?: string | null;
      upi_reference?: string | null;
      notes?: string | null;
    }) => {
      const created_by = await uid();
      const { data, error } = await supabase
        .from("sales")
        .insert({ ...input, created_by, client_key: newClientKey() })
        .select()
        .single();
      if (error) throw error;
      await logAudit({
        action: "sale.created",
        entity_type: "sale",
        entity_id: data.id,
        new_value: data,
      });
      return data;
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useReverseSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data: before } = await supabase.from("sales").select("*").eq("id", id).single();
      const updated_by = await uid();
      const { data, error } = await supabase
        .from("sales")
        .update({ status: "reversed", reversal_reason: reason, updated_by })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      await logAudit({
        action: "sale.reversed",
        entity_type: "sale",
        entity_id: id,
        old_value: before,
        new_value: data,
        reason,
      });
      return data;
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAddPurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const created_by = await uid();
      const { data, error } = await supabase
        .from("purchases")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ ...(input as any), created_by, client_key: newClientKey() })
        .select()
        .single();
      if (error) throw error;
      await logAudit({
        action: "purchase.created",
        entity_type: "purchase",
        entity_id: data.id,
        new_value: data,
      });
      return data;
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const created_by = await uid();
      const { data, error } = await supabase
        .from("expenses")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ ...(input as any), created_by, client_key: newClientKey() })
        .select()
        .single();
      if (error) throw error;
      await logAudit({
        action: "expense.created",
        entity_type: "expense",
        entity_id: data.id,
        new_value: data,
      });
      return data;
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAddWastage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const created_by = await uid();
      const { data, error } = await supabase
        .from("wastage")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ ...(input as any), created_by, client_key: newClientKey() })
        .select()
        .single();
      if (error) throw error;
      await logAudit({
        action: "wastage.created",
        entity_type: "wastage",
        entity_id: data.id,
        new_value: data,
      });
      return data;
    },
    onSuccess: () => invalidateAll(qc),
  });
}

/* ---------- documents ---------- */

export async function uploadBill(file: File, meta: {
  doc_date?: string | null;
  category?: string | null;
  supplier_id?: string | null;
  invoice_number?: string | null;
  amount?: number | null;
  related_type?: string | null;
}) {
  const owner = await uid();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const allowed = ["jpg", "jpeg", "png", "webp", "pdf"];
  if (!allowed.includes(ext)) throw new Error("Only JPG, PNG, WEBP or PDF files are allowed");
  if (file.size > 15 * 1024 * 1024) throw new Error("File must be under 15 MB");
  const path = `${owner}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage.from("bills").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) throw upErr;
  const { data, error } = await supabase
    .from("documents")
    .insert({
      storage_path: path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: owner,
      ...meta,
    })
    .select()
    .single();
  if (error) throw error;
  await logAudit({ action: "document.uploaded", entity_type: "document", entity_id: data.id, new_value: data });
  return data;
}

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*, suppliers(name)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });
}

export async function signedUrl(path: string) {
  const { data, error } = await supabase.storage.from("bills").createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}

/* ---------- stock counts ---------- */

export function useStockCounts(from: string, to: string) {
  return useQuery({
    queryKey: ["stock", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_counts")
        .select("*, chicken_types(name)")
        .gte("business_date", from)
        .lte("business_date", to)
        .order("business_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveStockCount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      business_date: string;
      chicken_type_id: string;
      actual_closing_kg: number;
      expected_closing_kg?: number | null;
      note?: string | null;
    }) => {
      const created_by = await uid();
      const { data, error } = await supabase
        .from("stock_counts")
        .upsert({ ...input, created_by }, { onConflict: "business_date,chicken_type_id" })
        .select()
        .single();
      if (error) throw error;
      await logAudit({
        action: "stock_count.saved",
        entity_type: "stock_count",
        entity_id: data.id,
        new_value: data,
      });
      return data;
    },
    onSuccess: () => invalidateAll(qc),
  });
}

/* ---------- cash day ---------- */

export function useCashDay(date: string) {
  return useQuery({
    queryKey: ["cash_day", date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cash_days")
        .select("*")
        .eq("business_date", date)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveCashDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      business_date: string;
      opening_cash: number;
      actual_cash?: number | null;
      verified_online?: number | null;
      note?: string | null;
    }) => {
      const created_by = await uid();
      const { data, error } = await supabase
        .from("cash_days")
        .upsert({ ...input, created_by }, { onConflict: "business_date" })
        .select()
        .single();
      if (error) throw error;
      await logAudit({
        action: "cash_day.saved",
        entity_type: "cash_day",
        entity_id: data.id,
        new_value: data,
      });
      return data;
    },
    onSuccess: () => invalidateAll(qc),
  });
}

/* ---------- settings, roles, audit ---------- */

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("business_settings")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .upsert({ id: true, ...(input as any) })
        .select()
        .single();
      if (error) throw error;
      await logAudit({ action: "settings.updated", entity_type: "business_settings", new_value: data });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business_settings"] });
    },
  });
}

export function useMyRoles() {
  return useQuery({
    queryKey: ["my_roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role");
      if (error) throw error;
      return data.map((r) => r.role);
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const id = await uid();
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useAuditLogs(limit = 60) {
  return useQuery({
    queryKey: ["audit_logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
  });
}

export function useAddCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; kind: string }) => {
      const { data, error } = await supabase
        .from("expense_categories")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(input as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expense_categories"] }),
  });
}

export function useAddSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; phone?: string | null }) => {
      const { data, error } = await supabase
        .from("suppliers")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(input as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  });
}

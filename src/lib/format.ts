export const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const INR2 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function inr(value: number | null | undefined, decimals = false) {
  const n = Number(value ?? 0);
  return decimals ? INR2.format(n) : INR.format(Math.round(n));
}

export function kg(value: number | null | undefined, digits = 3) {
  return `${Number(value ?? 0).toFixed(digits)} kg`;
}

export function pct(value: number | null | undefined, digits = 1) {
  return `${Number(value ?? 0).toFixed(digits)}%`;
}

/** Business date (Asia/Kolkata) as YYYY-MM-DD. */
export function businessToday(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts;
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function prettyDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function shortDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function prettyTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Stable idempotency key so an offline retry never creates a duplicate. */
export function newClientKey(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

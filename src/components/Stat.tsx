import { cn } from "@/lib/utils";

export function Stat({
  label,
  value,
  sub,
  tone = "neutral",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "neutral" | "positive" | "negative" | "caution";
  className?: string;
}) {
  return (
    <div className={cn("stat-card", className)}>
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "num mt-1 text-xl font-bold sm:text-2xl",
          tone === "positive" && "text-positive",
          tone === "negative" && "text-negative",
          tone === "caution" && "text-caution",
        )}
      >
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function DateBar({
  date,
  onChange,
}: {
  date: string;
  onChange: (next: string) => void;
}) {
  return (
    <input
      type="date"
      value={date}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-lg border bg-card px-3 text-sm font-medium"
    />
  );
}

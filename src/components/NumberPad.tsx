import { Delete, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  suffix?: string;
  prefix?: string;
  hint?: React.ReactNode;
  onChange: (next: string) => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
};

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "back"] as const;

export function NumberPad({
  label,
  value,
  suffix,
  prefix,
  hint,
  onChange,
  onConfirm,
  confirmLabel = "Confirm",
  confirmDisabled,
  onBack,
  children,
}: Props) {
  function press(key: string) {
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

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 px-1 pb-2">
        {onBack ? (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
            <ArrowLeft className="size-5" />
          </Button>
        ) : null}
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
      </div>

      <div className="rounded-2xl border bg-card px-4 py-6 text-center shadow-[var(--shadow-card)]">
        <div className="num text-5xl font-bold sm:text-6xl">
          {prefix}
          {value === "" ? "0" : value}
          {suffix ? <span className="ml-1 text-2xl text-muted-foreground">{suffix}</span> : null}
        </div>
        {hint ? <div className="mt-2 text-sm text-muted-foreground">{hint}</div> : null}
      </div>

      {children}

      <div className="mt-4 grid grid-cols-3 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => press(k)}
            className={cn("keypad-key")}
            aria-label={k === "back" ? "Backspace" : k}
          >
            {k === "back" ? <Delete className="size-6" /> : k}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Button variant="outline" className="h-14 flex-1 text-base" onClick={() => onChange("")}>
          Clear
        </Button>
        <Button
          className="h-14 flex-[2] text-base font-semibold"
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          <Check className="size-5" /> {confirmLabel}
        </Button>
      </div>
    </div>
  );
}

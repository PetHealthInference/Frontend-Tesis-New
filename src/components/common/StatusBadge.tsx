import type { RiskLevel } from "../../types/dashboard";
import { cn } from "../../utils/cn";

const labels: Record<RiskLevel, string> = {
  low: "Riesgo bajo",
  moderate: "Riesgo moderado",
  high: "Riesgo alto",
};

const tones: Record<RiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700",
  moderate: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

export function StatusBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span className={cn("inline-flex rounded-md px-3 py-1 text-xs font-semibold", tones[risk])}>
      {labels[risk]}
    </span>
  );
}

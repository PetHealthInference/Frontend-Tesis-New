import type { PersistedActivatedRule } from "../../types/evaluation";

export function ActivatedRulesPanel({ rules }: { rules: PersistedActivatedRule[] }) {
  if (!rules.length) return <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No se activaron reglas para este resultado.</p>;
  return <div className="space-y-3">{rules.map((rule) => <details className="rounded-lg border border-slate-200 p-4" key={rule.id}><summary className="cursor-pointer font-bold text-slate-700">{rule.rule_code ?? `Regla #${rule.rule_id}`} {rule.rule_version ? `· v${rule.rule_version}` : ""}</summary><p className="mt-3 text-sm text-slate-600">{rule.justification}</p><ul className="mt-3 list-disc pl-5 text-sm text-slate-600">{asConditions(rule.fulfilled_conditions).map((condition) => <li key={condition}>{condition}</li>)}</ul></details>)}</div>;
}

function asConditions(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : value ? [String(value)] : [];
}

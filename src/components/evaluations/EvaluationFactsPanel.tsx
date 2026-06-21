import type { ChangeEvent } from "react";
import type { FactDefinition } from "../../types/evaluation";

type Props = {
  facts: FactDefinition[];
  values: Record<string, string | number | boolean>;
  onChange: (fact: FactDefinition, value: string | number | boolean | undefined) => void;
  isLoading: boolean;
  error: string;
};

export function EvaluationFactsPanel({ facts, values, onChange, isLoading, error }: Props) {
  if (isLoading) return <div className="h-52 animate-pulse rounded-lg bg-slate-100" />;
  if (error) return <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>;
  if (facts.length === 0) return <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No hay facts activos para esta especie.</p>;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {facts.map((fact) => <FactInput fact={fact} key={fact.id} onChange={onChange} value={values[fact.fact_key]} />)}
    </div>
  );
}

function FactInput({ fact, value, onChange }: { fact: FactDefinition; value: string | number | boolean | undefined; onChange: Props["onChange"] }) {
  const type = fact.data_type.toLowerCase();
  const label = `${fact.display_name}${fact.unit ? ` (${fact.unit})` : ""}`;
  if (type === "boolean" || type === "bool") {
    return <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700"><input checked={value === true} className="h-5 w-5" onChange={(event) => onChange(fact, event.target.checked ? true : undefined)} type="checkbox" />{label}</label>;
  }
  if (type === "numeric" || type === "number" || type === "float" || type === "integer" || type === "decimal") {
    return <label className="block text-sm font-bold text-slate-700">{label}<input className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4" min={undefined} onChange={(event) => onNumericChange(event, fact, onChange)} step="any" type="number" value={typeof value === "number" ? value : ""} /></label>;
  }
  return <label className="block text-sm font-bold text-slate-700">{label}<select className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4" onChange={(event) => onChange(fact, event.target.value || undefined)} value={typeof value === "string" ? value : ""}><option value="">Seleccionar…</option>{(fact.allowed_values ?? []).map((option) => <option key={String(option)} value={String(option)}>{String(option)}</option>)}</select>{!fact.allowed_values?.length ? <span className="mt-1 block text-xs font-medium text-amber-700">Este fact categórico no posee valores permitidos publicados.</span> : null}</label>;
}

function onNumericChange(event: ChangeEvent<HTMLInputElement>, fact: FactDefinition, onChange: Props["onChange"]) {
  const raw = event.target.value;
  onChange(fact, raw === "" ? undefined : Number(raw));
}

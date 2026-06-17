import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type DataTableProps<T> = {
  columns: string[];
  emptyMessage?: string;
  compact?: boolean;
  rows: T[];
  renderRow: (row: T) => ReactNode;
};

export function DataTable<T>({ columns, emptyMessage = "Sin registros disponibles.", compact = false, rows, renderRow }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("min-w-full border-collapse text-left", compact ? "text-xs" : "text-sm")}>
        <thead>
          <tr className="border-b border-slate-100 text-xs font-bold text-slate-500">
            {columns.map((column) => (
              <th className={cn("whitespace-nowrap", compact ? "px-3 py-3" : "px-5 py-4")} key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-600">
          {rows.length ? (
            rows.map(renderRow)
          ) : (
            <tr>
              <td className={cn("text-center font-semibold text-slate-400", compact ? "px-3 py-6" : "px-5 py-8")} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

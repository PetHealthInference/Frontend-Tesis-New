import type { ReactNode } from "react";

type DataTableProps<T> = {
  columns: string[];
  rows: T[];
  renderRow: (row: T) => ReactNode;
};

export function DataTable<T>({ columns, rows, renderRow }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-bold text-slate-500">
            {columns.map((column) => (
              <th className="whitespace-nowrap px-5 py-4" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-600">{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

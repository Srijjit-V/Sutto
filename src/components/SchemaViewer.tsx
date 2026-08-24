import type { Dataset } from "@/lib/datasets/types";
import { Table2 } from "lucide-react";

export function SchemaViewer({ dataset }: { dataset: Dataset }) {
  return (
    <div className="clay-card p-4">
      <h2 className="font-bold mb-3 flex items-center gap-2">
        <Table2 className="size-4" aria-hidden /> Schema
      </h2>
      <div className="flex flex-col gap-3">
        {dataset.tables.map((table) => (
          <div key={table.name}>
            <p className="font-mono text-sm font-bold text-[var(--primary)]">{table.name}</p>
            <ul className="text-sm text-[var(--muted-foreground)] font-mono ml-3">
              {table.columns.map((col) => (
                <li key={col.name}>
                  {col.name} <span className="opacity-70">{col.type}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

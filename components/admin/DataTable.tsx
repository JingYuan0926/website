import { useState } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onMove?: (item: T, direction: "up" | "down") => Promise<void>;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onMove,
}: DataTableProps<T>) {
  const [animating, setAnimating] = useState<{ id: string; direction: "up" | "down" } | null>(null);

  async function handleMove(item: T, idx: number, direction: "up" | "down") {
    if (!onMove) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= data.length) return;

    const otherId = data[swapIdx].id;

    // Trigger animation on both rows
    setAnimating({ id: item.id, direction });
    await new Promise((r) => setTimeout(r, 250));
    setAnimating(null);

    await onMove(item, direction);
  }

  function getRowStyle(item: T, idx: number): React.CSSProperties {
    if (!animating) return {};
    const rowHeight = 53; // approximate row height in px
    if (item.id === animating.id) {
      return {
        transform: `translateY(${animating.direction === "down" ? rowHeight : -rowHeight}px)`,
        transition: "transform 0.25s ease",
        position: "relative",
        zIndex: 2,
      };
    }
    // The item being displaced
    const myIdx = idx;
    const movingIdx = data.findIndex((d) => d.id === animating.id);
    const targetIdx = animating.direction === "down" ? movingIdx + 1 : movingIdx - 1;
    if (myIdx === targetIdx) {
      return {
        transform: `translateY(${animating.direction === "down" ? -rowHeight : rowHeight}px)`,
        transition: "transform 0.25s ease",
        position: "relative",
        zIndex: 1,
      };
    }
    return {};
  }

  return (
    <div className="border border-border-subtle rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-card">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {onMove && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider w-20">
                  Order
                </th>
              )}
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {data.map((item, idx) => (
              <tr
                key={item.id}
                className="hover:bg-bg-card/50 transition-colors"
                style={getRowStyle(item, idx)}
              >
                {columns.map((col) => (
                  <td
                    key={`${item.id}-${String(col.key)}`}
                    className="px-4 py-3 text-text-secondary"
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key as string] ?? "")}
                  </td>
                ))}
                {onMove && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(item, idx, "up")}
                        disabled={idx === 0 || !!animating}
                        className="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        aria-label="Move up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMove(item, idx, "down")}
                        disabled={idx === data.length - 1 || !!animating}
                        className="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        aria-label="Move down"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-md text-text-muted hover:text-brand-purple-light hover:bg-brand-purple/10 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="py-12 text-center text-sm text-text-muted">
          No items yet. Add your first one above.
        </div>
      )}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

type PhaseCardProps = {
  phaseNumber: number;
  title: string;
  description?: string;
  itemCount?: number;
  price?: number;
  currency?: string;
  collapsed?: boolean;
  icon?: ReactNode;

  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  onImprove?: () => void;

  children?: ReactNode;
};

export default function PhaseCard({
  phaseNumber,
  title,
  description,
  itemCount = 0,
  price = 0,
  currency = "₹",
  collapsed = false,
  icon,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  onImprove,
  children,
}: PhaseCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}
      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-start gap-4 px-5 py-4 md:px-6 md:py-5">
          {/* DRAG HANDLE */}
          <div className="hidden shrink-0 pt-3 text-zinc-800 sm:block">
            <GripVertical size={16} />
          </div>

          {/* PHASE NUMBER */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10 text-xs font-black text-[#E8820C]">
            {String(phaseNumber).padStart(2, "0")}
          </div>

          {/* PHASE INFO */}
          <button
            type="button"
            onClick={onToggle}
            className="min-w-0 flex-1 text-left"
          >
            <div className="flex items-center gap-2">
              {icon && (
                <span className="shrink-0 text-[#E8820C]">
                  {icon}
                </span>
              )}

              <h2 className="truncate text-sm font-black text-white md:text-base">
                {title || `Phase ${phaseNumber}`}
              </h2>
            </div>

            {description && (
              <p className="mt-1.5 max-w-2xl text-[10px] leading-5 text-zinc-600">
                {description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[9px] font-black uppercase tracking-wider text-zinc-700">
              <span>
                {itemCount}{" "}
                {itemCount === 1 ? "item" : "items"}
              </span>

              {price > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-zinc-800" />

                  <span>
                    {currency}
                    {price.toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>
          </button>

          {/* ACTIONS */}
          <div className="flex shrink-0 items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
                title="Edit phase"
              >
                <Pencil size={14} />
              </button>
            )}

            {onImprove && (
              <button
                type="button"
                onClick={onImprove}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-[#E8820C]"
                title="Improve with AI"
              >
                <Sparkles size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </button>

            <button
              type="button"
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-[#222] hover:text-white sm:flex"
              title="More options"
            >
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      {!collapsed && (
        <>
          {children ? (
            <div>{children}</div>
          ) : (
            <div className="px-5 py-10 text-center md:px-6">
              <p className="text-[10px] font-bold text-zinc-700">
                No items added to this phase.
              </p>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-[#292929] px-5 py-4 md:px-6">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-700 transition hover:text-red-400"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              )}
            </div>

            {onAdd && (
              <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-2 rounded-lg border border-[#292929] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#E8820C] hover:text-[#E8820C]"
              >
                <Plus size={13} />
                Add item
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
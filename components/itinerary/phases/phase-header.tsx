"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";

type PhaseHeaderProps = {
  phaseNumber: number;
  title: string;
  description?: string;

  collapsed?: boolean;
  draggable?: boolean;

  onToggle?: () => void;
  onAddDay?: () => void;
  onDelete?: () => void;
  onTitleChange?: (title: string) => void;
};

export default function PhaseHeader({
  phaseNumber,
  title,
  description,
  collapsed = false,
  draggable = true,
  onToggle,
  onAddDay,
  onDelete,
  onTitleChange,
}: PhaseHeaderProps) {
  return (
    <div className="border-b border-[#292929] bg-[#151515]">
      <div className="flex items-start gap-3 px-4 py-4">
        {/* DRAG HANDLE */}

        {draggable && (
          <button
            type="button"
            className="mt-1 flex h-7 w-5 shrink-0 cursor-grab items-center justify-center text-zinc-700 transition hover:text-zinc-400 active:cursor-grabbing"
            aria-label="Drag phase"
          >
            <GripVertical size={15} />
          </button>
        )}

        {/* PHASE NUMBER */}

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8820C]/10">
          <span className="text-[9px] font-black text-[#E8820C]">
            {String(phaseNumber).padStart(
              2,
              "0"
            )}
          </span>
        </div>

        {/* MAIN CONTENT */}

        <div className="min-w-0 flex-1">
          {onTitleChange ? (
            <input
              type="text"
              value={title}
              onChange={(event) =>
                onTitleChange(
                  event.target.value
                )
              }
              placeholder="Phase title"
              className="w-full bg-transparent text-sm font-black tracking-tight text-white outline-none placeholder:text-zinc-700"
            />
          ) : (
            <h3 className="truncate text-sm font-black tracking-tight text-white">
              {title || "Untitled Phase"}
            </h3>
          )}

          {description && (
            <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-zinc-600">
              {description}
            </p>
          )}
        </div>

        {/* ACTIONS */}

        <div className="flex shrink-0 items-center gap-1">
          {onAddDay && (
            <button
              type="button"
              onClick={onAddDay}
              className="hidden h-8 items-center gap-1.5 rounded-lg border border-[#292929] px-2.5 text-[8px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white sm:flex"
            >
              <Plus size={12} />
              Day
            </button>
          )}

          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#202020] hover:text-white"
              aria-label={
                collapsed
                  ? "Expand phase"
                  : "Collapse phase"
              }
            >
              {collapsed ? (
                <ChevronDown size={15} />
              ) : (
                <ChevronUp size={15} />
              )}
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-500/10 hover:text-red-400"
              aria-label="Delete phase"
            >
              <Trash2 size={13} />
            </button>
          )}

          {!onToggle &&
            !onDelete &&
            !onAddDay && (
              <MoreHorizontal
                size={15}
                className="text-zinc-700"
              />
            )}
        </div>
      </div>

      {/* MOBILE ADD DAY */}

      {onAddDay && (
        <div className="border-t border-[#202020] px-4 py-2 sm:hidden">
          <button
            type="button"
            onClick={onAddDay}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#292929] py-2 text-[8px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white"
          >
            <Plus size={12} />
            Add Day
          </button>
        </div>
      )}
    </div>
  );
}
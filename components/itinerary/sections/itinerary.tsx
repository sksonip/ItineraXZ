"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

export type ItineraryDay = {
  id: string;
  day: number;
  title: string;
  location?: string;
  description?: string;
  date?: string;
  phases?: number;
};

type ItinerariesProps = {
  days: ItineraryDay[];

  onChange?: (days: ItineraryDay[]) => void;

  onAdd?: () => void;

  onEditDay?: (day: ItineraryDay) => void;

  disabled?: boolean;
};

export default function Itineraries({
  days,
  onChange,
  onAdd,
  onEditDay,
  disabled = false,
}: ItinerariesProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function deleteDay(id: string) {
    const updated = days
      .filter((day) => day.id !== id)
      .map((day, index) => ({
        ...day,
        day: index + 1,
      }));

    onChange?.(updated);
  }

  function moveDay(
    index: number,
    direction: "up" | "down"
  ) {
    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= days.length
    ) {
      return;
    }

    const updated = [...days];

    const current = updated[index];

    updated[index] =
      updated[targetIndex];

    updated[targetIndex] = current;

    const reordered = updated.map(
      (day, dayIndex) => ({
        ...day,
        day: dayIndex + 1,
      })
    );

    onChange?.(reordered);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          {/* ICON */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
            <CalendarDays
              size={17}
              className="text-[#E8820C]"
            />
          </div>

          {/* TITLE */}

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="min-w-0 flex-1 text-left"
          >
            <h2 className="text-sm font-black text-white md:text-base">
              Itinerary
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Build the trip day by day and organize
              every experience.
            </p>
          </button>

          {/* COUNT */}

          <div className="hidden text-right sm:block">
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
              {days.length}{" "}
              {days.length === 1
                ? "day"
                : "days"}
            </p>
          </div>

          {/* COLLAPSE */}

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
            aria-label={
              collapsed
                ? "Expand itinerary"
                : "Collapse itinerary"
            }
          >
            {collapsed ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </button>
        </div>

        {/* MOBILE COUNT */}

        <div className="border-t border-[#242424] px-5 py-3 sm:hidden">
          <span className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
            {days.length}{" "}
            {days.length === 1
              ? "day"
              : "days"}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <>
          {days.length === 0 ? (
            <EmptyState
              onAdd={onAdd}
              disabled={disabled}
            />
          ) : (
            <div>
              {days.map((day, index) => (
                <DayItem
                  key={day.id}
                  day={day}
                  index={index}
                  totalDays={days.length}
                  disabled={disabled}
                  onEdit={() => {
                    onEditDay?.(day);
                  }}
                  onDelete={() =>
                    deleteDay(day.id)
                  }
                  onMoveUp={() =>
                    moveDay(index, "up")
                  }
                  onMoveDown={() =>
                    moveDay(index, "down")
                  }
                />
              ))}

              {/* ADD DAY */}

              {onAdd && (
                <div className="border-t border-[#292929] p-5 md:p-6">
                  <button
                    type="button"
                    onClick={onAdd}
                    disabled={disabled}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#292929] py-3 text-[9px] font-black uppercase tracking-wider text-zinc-600 transition hover:border-[#E8820C] hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={13} />
                    Add itinerary day
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

/* ================================================== */
/* DAY ITEM                                           */
/* ================================================== */

function DayItem({
  day,
  index,
  totalDays,
  disabled,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  day: ItineraryDay;
  index: number;
  totalDays: number;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      <div className="flex gap-3 md:gap-4">
        {/* DRAG / ORDER CONTROLS */}

        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#181818]">
            <GripVertical
              size={13}
              className="text-zinc-700"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={
                disabled || index === 0
              }
              className="flex h-6 w-8 items-center justify-center rounded text-zinc-700 transition hover:bg-[#222] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
              title="Move day up"
            >
              <ChevronUp size={13} />
            </button>

            <button
              type="button"
              onClick={onMoveDown}
              disabled={
                disabled ||
                index === totalDays - 1
              }
              className="flex h-6 w-8 items-center justify-center rounded text-zinc-700 transition hover:bg-[#222] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
              title="Move day down"
            >
              <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {/* DAY CONTENT */}

        <div className="min-w-0 flex-1">
          {/* TOP */}

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E8820C]">
                  Day {day.day}
                </span>

                {day.date && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-zinc-800" />

                    <span className="text-[9px] font-bold text-zinc-700">
                      {day.date}
                    </span>
                  </>
                )}
              </div>

              <h3 className="mt-2 text-sm font-black text-white">
                {day.title ||
                  "Untitled day"}
              </h3>

              {day.location && (
                <p className="mt-1 text-[9px] font-bold text-zinc-600">
                  {day.location}
                </p>
              )}
            </div>

            {/* ACTIONS */}

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={onEdit}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-[#222] hover:text-white disabled:opacity-30"
                title="Edit day"
              >
                <Pencil size={13} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-950/20 hover:text-red-400 disabled:opacity-30"
                title="Delete day"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}

          {day.description && (
            <p className="mt-3 max-w-2xl text-[10px] leading-5 text-zinc-600">
              {day.description}
            </p>
          )}

          {/* PHASES */}

          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-md border border-[#292929] bg-[#181818] px-2.5 py-1.5 text-[9px] font-black text-zinc-500">
              {day.phases ?? 0}{" "}
              {day.phases === 1
                ? "phase"
                : "phases"}
            </span>

            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-500">
              <Check size={10} />
              Day configured
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* EMPTY STATE                                        */
/* ================================================== */

function EmptyState({
  onAdd,
  disabled,
}: {
  onAdd?: () => void;
  disabled: boolean;
}) {
  return (
    <div className="px-5 py-12 text-center md:px-6">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#292929] bg-[#181818]">
        <CalendarDays
          size={20}
          className="text-zinc-700"
        />
      </div>

      <h3 className="mt-4 text-xs font-black text-zinc-400">
        No itinerary days yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-[10px] leading-5 text-zinc-700">
        Start building the trip by adding the first
        day.
      </p>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black disabled:opacity-30"
        >
          <Plus size={13} />
          Add first day
        </button>
      )}
    </div>
  );
}
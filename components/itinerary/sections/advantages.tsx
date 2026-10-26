"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

export type Advantage = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

type AdvantagesProps = {
  advantages: Advantage[];

  onChange?: (
    advantages: Advantage[]
  ) => void;

  onAdd?: () => void;

  disabled?: boolean;
};

export default function Advantages({
  advantages,
  onChange,
  onAdd,
  disabled = false,
}: AdvantagesProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function updateAdvantage(
    id: string,
    updates: Partial<Advantage>
  ) {
    const updated = advantages.map(
      (advantage) =>
        advantage.id === id
          ? {
              ...advantage,
              ...updates,
            }
          : advantage
    );

    onChange?.(updated);
  }

  function deleteAdvantage(id: string) {
    const updated = advantages.filter(
      (advantage) =>
        advantage.id !== id
    );

    onChange?.(updated);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          {/* ICON */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
            <Lightbulb
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
              Advantages
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Highlight what makes this itinerary
              valuable to the traveler.
            </p>
          </button>

          {/* COUNT */}

          <div className="hidden text-right sm:block">
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
              {advantages.length}{" "}
              {advantages.length === 1
                ? "advantage"
                : "advantages"}
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
                ? "Expand advantages"
                : "Collapse advantages"
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
            {advantages.length}{" "}
            {advantages.length === 1
              ? "advantage"
              : "advantages"}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <>
          {advantages.length === 0 ? (
            <EmptyState
              onAdd={onAdd}
              disabled={disabled}
            />
          ) : (
            <div>
              {advantages.map(
                (advantage, index) => (
                  <AdvantageItem
                    key={advantage.id}
                    advantage={advantage}
                    index={index}
                    disabled={disabled}
                    onChange={(updates) =>
                      updateAdvantage(
                        advantage.id,
                        updates
                      )
                    }
                    onDelete={() =>
                      deleteAdvantage(
                        advantage.id
                      )
                    }
                  />
                )
              )}

              {/* ADD */}

              {onAdd && (
                <div className="border-t border-[#292929] p-5 md:p-6">
                  <button
                    type="button"
                    onClick={onAdd}
                    disabled={disabled}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#292929] py-3 text-[9px] font-black uppercase tracking-wider text-zinc-600 transition hover:border-[#E8820C] hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={13} />
                    Add advantage
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
/* ADVANTAGE ITEM                                     */
/* ================================================== */

function AdvantageItem({
  advantage,
  index,
  disabled,
  onChange,
  onDelete,
}: {
  advantage: Advantage;
  index: number;
  disabled: boolean;
  onChange: (
    updates: Partial<Advantage>
  ) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] =
    useState(false);

  if (editing) {
    return (
      <EditAdvantage
        advantage={advantage}
        index={index}
        disabled={disabled}
        onChange={onChange}
        onDelete={onDelete}
        onClose={() =>
          setEditing(false)
        }
      />
    );
  }

  return (
    <div className="border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      <div className="flex items-start gap-4">
        {/* NUMBER */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-[10px] font-black text-[#E8820C]">
          {String(index + 1).padStart(
            2,
            "0"
          )}
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xs font-black text-white md:text-sm">
                {advantage.title ||
                  "Untitled advantage"}
              </h3>

              {advantage.description && (
                <p className="mt-2 text-[10px] leading-5 text-zinc-600">
                  {advantage.description}
                </p>
              )}
            </div>

            {/* ACTIONS */}

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setEditing(true)
                }
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-[#222] hover:text-white disabled:opacity-30"
                title="Edit advantage"
              >
                <Pencil size={13} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-950/20 hover:text-red-400 disabled:opacity-30"
                title="Delete advantage"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* STATUS */}

          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-500">
              <Check size={11} />
              Included
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* EDIT ADVANTAGE                                     */
/* ================================================== */

function EditAdvantage({
  advantage,
  index,
  disabled,
  onChange,
  onDelete,
  onClose,
}: {
  advantage: Advantage;
  index: number;
  disabled: boolean;
  onChange: (
    updates: Partial<Advantage>
  ) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="border-b border-[#242424] bg-[#141414] p-5 last:border-b-0 md:p-6">
      {/* EDIT HEADER */}

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-[9px] font-black text-[#E8820C]">
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E8820C]">
              Advantage
            </p>

            <h3 className="mt-1 text-sm font-black text-white">
              Edit advantage
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-[9px] font-black uppercase tracking-wider text-zinc-600 transition hover:text-white"
        >
          Done
        </button>
      </div>

      {/* FIELDS */}

      <div className="space-y-4">
        {/* TITLE */}

        <div>
          <label className={labelClass}>
            Title
          </label>

          <input
            type="text"
            value={advantage.title}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                title:
                  event.target.value,
              })
            }
            placeholder="Private airport transfer"
            className={inputClass}
          />

          <p className="mt-1.5 text-[9px] text-zinc-700">
            Keep this short and benefit-focused.
          </p>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className={labelClass}>
            Description
          </label>

          <textarea
            value={
              advantage.description ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                description:
                  event.target.value,
              })
            }
            placeholder="Explain why this is valuable for the traveler..."
            rows={4}
            className={`${inputClass} resize-none`}
          />

          <p className="mt-1.5 text-[9px] text-zinc-700">
            This can be improved automatically by
            AI later.
          </p>
        </div>

        {/* ICON */}

        <div>
          <label className={labelClass}>
            Icon
          </label>

          <input
            type="text"
            value={
              advantage.icon || ""
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                icon:
                  event.target.value,
              })
            }
            placeholder="✈️"
            maxLength={4}
            className={inputClass}
          />
        </div>
      </div>

      {/* ACTIONS */}

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-zinc-700 transition hover:text-red-400 disabled:opacity-30"
        >
          <Trash2 size={12} />
          Delete
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black"
        >
          Done
        </button>
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
        <Lightbulb
          size={20}
          className="text-zinc-700"
        />
      </div>

      <h3 className="mt-4 text-xs font-black text-zinc-400">
        No advantages yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-[10px] leading-5 text-zinc-700">
        Add benefits that make the itinerary more
        compelling to the traveler.
      </p>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black disabled:opacity-30"
        >
          <Plus size={13} />
          Add advantage
        </button>
      )}
    </div>
  );
}

/* ================================================== */
/* HELPERS                                            */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C] disabled:cursor-not-allowed disabled:opacity-50";

const labelClass =
  "mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600";
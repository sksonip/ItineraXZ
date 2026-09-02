"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

export type Exclusion = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

type ExclusionsProps = {
  exclusions: Exclusion[];

  onChange?: (
    exclusions: Exclusion[]
  ) => void;

  onAdd?: () => void;

  disabled?: boolean;
};

export default function Exclusions({
  exclusions,
  onChange,
  onAdd,
  disabled = false,
}: ExclusionsProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function updateExclusion(
    id: string,
    updates: Partial<Exclusion>
  ) {
    const updated = exclusions.map(
      (exclusion) =>
        exclusion.id === id
          ? {
              ...exclusion,
              ...updates,
            }
          : exclusion
    );

    onChange?.(updated);
  }

  function deleteExclusion(id: string) {
    const updated = exclusions.filter(
      (exclusion) =>
        exclusion.id !== id
    );

    onChange?.(updated);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          {/* ICON */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5">
            <AlertCircle
              size={17}
              className="text-red-400"
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
              Exclusions
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Clearly define what is not included in
              the itinerary price.
            </p>
          </button>

          {/* COUNT */}

          <div className="hidden text-right sm:block">
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
              {exclusions.length}{" "}
              {exclusions.length === 1
                ? "exclusion"
                : "exclusions"}
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
                ? "Expand exclusions"
                : "Collapse exclusions"
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
            {exclusions.length}{" "}
            {exclusions.length === 1
              ? "exclusion"
              : "exclusions"}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <>
          {exclusions.length === 0 ? (
            <EmptyState
              onAdd={onAdd}
              disabled={disabled}
            />
          ) : (
            <div>
              {exclusions.map(
                (exclusion, index) => (
                  <ExclusionItem
                    key={exclusion.id}
                    exclusion={exclusion}
                    index={index}
                    disabled={disabled}
                    onChange={(updates) =>
                      updateExclusion(
                        exclusion.id,
                        updates
                      )
                    }
                    onDelete={() =>
                      deleteExclusion(
                        exclusion.id
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
                    Add exclusion
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
/* EXCLUSION ITEM                                     */
/* ================================================== */

function ExclusionItem({
  exclusion,
  index,
  disabled,
  onChange,
  onDelete,
}: {
  exclusion: Exclusion;
  index: number;
  disabled: boolean;
  onChange: (
    updates: Partial<Exclusion>
  ) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] =
    useState(false);

  if (editing) {
    return (
      <EditExclusion
        exclusion={exclusion}
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

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-[10px] font-black text-red-400">
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
                {exclusion.title ||
                  "Untitled exclusion"}
              </h3>

              {exclusion.description && (
                <p className="mt-2 text-[10px] leading-5 text-zinc-600">
                  {exclusion.description}
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
                title="Edit exclusion"
              >
                <Pencil size={13} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-950/20 hover:text-red-400 disabled:opacity-30"
                title="Delete exclusion"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* STATUS */}

          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-red-400">
              <AlertCircle size={11} />
              Not included
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* EDIT EXCLUSION                                     */
/* ================================================== */

function EditExclusion({
  exclusion,
  index,
  disabled,
  onChange,
  onDelete,
  onClose,
}: {
  exclusion: Exclusion;
  index: number;
  disabled: boolean;
  onChange: (
    updates: Partial<Exclusion>
  ) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="border-b border-[#242424] bg-[#141414] p-5 last:border-b-0 md:p-6">
      {/* EDIT HEADER */}

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-[9px] font-black text-red-400">
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
              Exclusion
            </p>

            <h3 className="mt-1 text-sm font-black text-white">
              Edit exclusion
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
            value={exclusion.title}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                title:
                  event.target.value,
              })
            }
            placeholder="Flights to and from destination"
            className={inputClass}
          />

          <p className="mt-1.5 text-[9px] text-zinc-700">
            State exactly what the traveler must pay
            for separately.
          </p>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className={labelClass}>
            Description
          </label>

          <textarea
            value={
              exclusion.description ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                description:
                  event.target.value,
              })
            }
            placeholder="Explain what is excluded..."
            rows={4}
            className={`${inputClass} resize-none`}
          />

          <p className="mt-1.5 text-[9px] text-zinc-700">
            Keep exclusions clear and transparent.
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
              exclusion.icon || ""
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
        <AlertCircle
          size={20}
          className="text-zinc-700"
        />
      </div>

      <h3 className="mt-4 text-xs font-black text-zinc-400">
        No exclusions yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-[10px] leading-5 text-zinc-700">
        Add anything the traveler needs to know is
        outside the package price.
      </p>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black disabled:opacity-30"
        >
          <Plus size={13} />
          Add exclusion
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
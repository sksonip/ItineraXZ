"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

export type Inclusion = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

type InclusionsProps = {
  inclusions: Inclusion[];

  onChange?: (
    inclusions: Inclusion[]
  ) => void;

  onAdd?: () => void;

  disabled?: boolean;
};

export default function Inclusions({
  inclusions,
  onChange,
  onAdd,
  disabled = false,
}: InclusionsProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function updateInclusion(
    id: string,
    updates: Partial<Inclusion>
  ) {
    const updated = inclusions.map(
      (inclusion) =>
        inclusion.id === id
          ? {
              ...inclusion,
              ...updates,
            }
          : inclusion
    );

    onChange?.(updated);
  }

  function deleteInclusion(id: string) {
    const updated = inclusions.filter(
      (inclusion) =>
        inclusion.id !== id
    );

    onChange?.(updated);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          {/* ICON */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/10 bg-emerald-500/5">
            <Check
              size={17}
              className="text-emerald-500"
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
              Inclusions
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Define everything included in the
              itinerary package.
            </p>
          </button>

          {/* COUNT */}

          <div className="hidden text-right sm:block">
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
              {inclusions.length}{" "}
              {inclusions.length === 1
                ? "inclusion"
                : "inclusions"}
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
                ? "Expand inclusions"
                : "Collapse inclusions"
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
            {inclusions.length}{" "}
            {inclusions.length === 1
              ? "inclusion"
              : "inclusions"}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <>
          {inclusions.length === 0 ? (
            <EmptyState
              onAdd={onAdd}
              disabled={disabled}
            />
          ) : (
            <div>
              {inclusions.map(
                (inclusion, index) => (
                  <InclusionItem
                    key={inclusion.id}
                    inclusion={inclusion}
                    index={index}
                    disabled={disabled}
                    onChange={(updates) =>
                      updateInclusion(
                        inclusion.id,
                        updates
                      )
                    }
                    onDelete={() =>
                      deleteInclusion(
                        inclusion.id
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
                    Add inclusion
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
/* INCLUSION ITEM                                     */
/* ================================================== */

function InclusionItem({
  inclusion,
  index,
  disabled,
  onChange,
  onDelete,
}: {
  inclusion: Inclusion;
  index: number;
  disabled: boolean;
  onChange: (
    updates: Partial<Inclusion>
  ) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] =
    useState(false);

  if (editing) {
    return (
      <EditInclusion
        inclusion={inclusion}
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

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-[10px] font-black text-emerald-500">
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
                {inclusion.title ||
                  "Untitled inclusion"}
              </h3>

              {inclusion.description && (
                <p className="mt-2 text-[10px] leading-5 text-zinc-600">
                  {inclusion.description}
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
                title="Edit inclusion"
              >
                <Pencil size={13} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-950/20 hover:text-red-400 disabled:opacity-30"
                title="Delete inclusion"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* STATUS */}

          <div className="mt-4">
            <span className="flex w-fit items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-500">
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
/* EDIT INCLUSION                                     */
/* ================================================== */

function EditInclusion({
  inclusion,
  index,
  disabled,
  onChange,
  onDelete,
  onClose,
}: {
  inclusion: Inclusion;
  index: number;
  disabled: boolean;
  onChange: (
    updates: Partial<Inclusion>
  ) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="border-b border-[#242424] bg-[#141414] p-5 last:border-b-0 md:p-6">
      {/* EDIT HEADER */}

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-[9px] font-black text-emerald-500">
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">
              Inclusion
            </p>

            <h3 className="mt-1 text-sm font-black text-white">
              Edit inclusion
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
            value={inclusion.title}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                title:
                  event.target.value,
              })
            }
            placeholder="Daily breakfast"
            className={inputClass}
          />

          <p className="mt-1.5 text-[9px] text-zinc-700">
            Use a short, clear name for the included
            service.
          </p>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className={labelClass}>
            Description
          </label>

          <textarea
            value={
              inclusion.description ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                description:
                  event.target.value,
              })
            }
            placeholder="Describe what is included..."
            rows={4}
            className={`${inputClass} resize-none`}
          />

          <p className="mt-1.5 text-[9px] text-zinc-700">
            Keep the description useful and
            traveler-friendly.
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
              inclusion.icon || ""
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                icon:
                  event.target.value,
              })
            }
            placeholder="🍳"
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
        <Check
          size={20}
          className="text-zinc-700"
        />
      </div>

      <h3 className="mt-4 text-xs font-black text-zinc-400">
        No inclusions yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-[10px] leading-5 text-zinc-700">
        Add services, experiences and facilities
        included in the package.
      </p>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black disabled:opacity-30"
        >
          <Plus size={13} />
          Add inclusion
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
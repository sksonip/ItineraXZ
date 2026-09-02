"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

export type SafetyItem = {
  id: string;
  title: string;
  description: string;
  severity?: "info" | "warning" | "important";
};

type SafetyProps = {
  safety: SafetyItem[];

  onChange?: (safety: SafetyItem[]) => void;

  disabled?: boolean;
};

export default function Safety({
  safety,
  onChange,
  disabled = false,
}: SafetyProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function addSafetyItem() {
    const newItem: SafetyItem = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      severity: "info",
    };

    onChange?.([...safety, newItem]);
  }

  function updateSafetyItem(
    id: string,
    updates: Partial<SafetyItem>
  ) {
    onChange?.(
      safety.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item
      )
    );
  }

  function deleteSafetyItem(id: string) {
    onChange?.(
      safety.filter(
        (item) => item.id !== id
      )
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-yellow-500/10 bg-yellow-500/5">
            <ShieldCheck
              size={17}
              className="text-yellow-500"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="min-w-0 flex-1 text-left"
          >
            <h2 className="text-sm font-black text-white md:text-base">
              Safety & Travel Notes
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Add important safety information,
              precautions and traveler guidance.
            </p>
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
              {safety.length}{" "}
              {safety.length === 1
                ? "note"
                : "notes"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
            aria-label={
              collapsed
                ? "Expand safety"
                : "Collapse safety"
            }
          >
            {collapsed ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </button>
        </div>

        <div className="border-t border-[#242424] px-5 py-3 sm:hidden">
          <span className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
            {safety.length}{" "}
            {safety.length === 1
              ? "note"
              : "notes"}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <div>
          {safety.length === 0 ? (
            <EmptyState
              onAdd={addSafetyItem}
              disabled={disabled}
            />
          ) : (
            <>
              <div>
                {safety.map(
                  (item, index) => (
                    <SafetyItemEditor
                      key={item.id}
                      item={item}
                      index={index}
                      disabled={disabled}
                      onChange={(updates) =>
                        updateSafetyItem(
                          item.id,
                          updates
                        )
                      }
                      onDelete={() =>
                        deleteSafetyItem(
                          item.id
                        )
                      }
                    />
                  )
                )}
              </div>

              {/* ADD BUTTON */}

              <div className="border-t border-[#292929] p-5 md:p-6">
                <button
                  type="button"
                  onClick={addSafetyItem}
                  disabled={disabled}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#292929] py-3 text-[9px] font-black uppercase tracking-wider text-zinc-600 transition hover:border-[#E8820C] hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={13} />
                  Add safety note
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

/* ================================================== */
/* SAFETY ITEM                                        */
/* ================================================== */

function SafetyItemEditor({
  item,
  index,
  disabled,
  onChange,
  onDelete,
}: {
  item: SafetyItem;
  index: number;
  disabled: boolean;
  onChange: (
    updates: Partial<SafetyItem>
  ) => void;
  onDelete: () => void;
}) {
  return (
    <div className="border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      <div className="flex items-start gap-4">
        {/* NUMBER */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-yellow-500/10 bg-yellow-500/5 text-[10px] font-black text-yellow-500">
          {String(index + 1).padStart(
            2,
            "0"
          )}
        </div>

        {/* FORM */}

        <div className="min-w-0 flex-1 space-y-4">
          {/* TITLE + DELETE */}

          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <label className={labelClass}>
                Safety note
              </label>

              <input
                type="text"
                value={item.title}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    title:
                      event.target.value,
                  })
                }
                placeholder="Keep valuables secure"
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={onDelete}
              disabled={disabled}
              className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-950/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
              title="Delete safety note"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className={labelClass}>
              Details
            </label>

            <textarea
              value={item.description}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  description:
                    event.target.value,
                })
              }
              placeholder="Explain the precaution or information travelers should know..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* SEVERITY */}

          <div>
            <label className={labelClass}>
              Priority
            </label>

            <div className="grid grid-cols-3 gap-2">
              <SeverityButton
                value="info"
                label="Info"
                active={
                  item.severity ===
                  "info"
                }
                disabled={disabled}
                onClick={() =>
                  onChange({
                    severity: "info",
                  })
                }
              />

              <SeverityButton
                value="warning"
                label="Warning"
                active={
                  item.severity ===
                  "warning"
                }
                disabled={disabled}
                onClick={() =>
                  onChange({
                    severity:
                      "warning",
                  })
                }
              />

              <SeverityButton
                value="important"
                label="Important"
                active={
                  item.severity ===
                  "important"
                }
                disabled={disabled}
                onClick={() =>
                  onChange({
                    severity:
                      "important",
                  })
                }
              />
            </div>
          </div>

          {/* PREVIEW */}

          <div className="rounded-lg border border-[#292929] bg-[#151515] p-3">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={14}
                className={severityIconClass(
                  item.severity
                )}
              />

              <div className="min-w-0">
                <p className="text-[10px] font-black text-zinc-400">
                  {item.title ||
                    "Safety note"}
                </p>

                {item.description && (
                  <p className="mt-1 text-[9px] leading-4 text-zinc-700">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* SEVERITY BUTTON                                    */
/* ================================================== */

function SeverityButton({
  value,
  label,
  active,
  disabled,
  onClick,
}: {
  value:
    | "info"
    | "warning"
    | "important";
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2.5 text-[9px] font-black uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? severityActiveClass(value)
          : "border-[#292929] bg-[#181818] text-zinc-700 hover:border-[#3A3A3A] hover:text-zinc-400"
      }`}
    >
      {label}
    </button>
  );
}

/* ================================================== */
/* EMPTY STATE                                        */
/* ================================================== */

function EmptyState({
  onAdd,
  disabled,
}: {
  onAdd: () => void;
  disabled: boolean;
}) {
  return (
    <div className="px-5 py-12 text-center md:px-6">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#292929] bg-[#181818]">
        <ShieldCheck
          size={20}
          className="text-zinc-700"
        />
      </div>

      <h3 className="mt-4 text-xs font-black text-zinc-400">
        No safety notes yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-[10px] leading-5 text-zinc-700">
        Add useful precautions and travel guidance
        for your travelers.
      </p>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black disabled:opacity-30"
      >
        <Plus size={13} />
        Add safety note
      </button>
    </div>
  );
}

/* ================================================== */
/* HELPERS                                            */
/* ================================================== */

function severityActiveClass(
  severity:
    | "info"
    | "warning"
    | "important"
) {
  if (severity === "important") {
    return "border-red-500/30 bg-red-500/10 text-red-400";
  }

  if (severity === "warning") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-500";
  }

  return "border-blue-500/30 bg-blue-500/10 text-blue-400";
}

function severityIconClass(
  severity:
    | "info"
    | "warning"
    | "important"
    | undefined
) {
  if (severity === "important") {
    return "shrink-0 text-red-400";
  }

  if (severity === "warning") {
    return "shrink-0 text-yellow-500";
  }

  return "shrink-0 text-blue-400";
}

/* ================================================== */
/* STYLES                                             */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C] disabled:cursor-not-allowed disabled:opacity-50";

const labelClass =
  "mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600";
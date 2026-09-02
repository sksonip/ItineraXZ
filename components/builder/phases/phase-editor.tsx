"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

export type PhaseItem = {
  id: string;
  title: string;
  description: string;
  time?: string;
  location?: string;
  duration?: string;
  price?: number;
};

export type PhaseEditorValue = {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  items: PhaseItem[];
};

type PhaseEditorProps = {
  value: PhaseEditorValue;
  onChange: (value: PhaseEditorValue) => void;
  onSave?: (value: PhaseEditorValue) => void;
  onCancel?: () => void;
  onImprove?: (
    phase: PhaseEditorValue
  ) => Promise<
    Partial<PhaseEditorValue> | null
  >;
};

export default function PhaseEditor({
  value,
  onChange,
  onSave,
  onCancel,
  onImprove,
}: PhaseEditorProps) {
  const [draft, setDraft] =
    useState<PhaseEditorValue>(value);

  const [improving, setImproving] =
    useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function updatePhase(
    updates: Partial<PhaseEditorValue>
  ) {
    const next = {
      ...draft,
      ...updates,
    };

    setDraft(next);
    onChange(next);
  }

  function updateItem(
    id: string,
    updates: Partial<PhaseItem>
  ) {
    const items = draft.items.map((item) =>
      item.id === id
        ? {
            ...item,
            ...updates,
          }
        : item
    );

    updatePhase({ items });
  }

  function addItem() {
    const newItem: PhaseItem = {
      id: createId(),
      title: "New item",
      description: "",
      time: "",
      location: "",
      duration: "",
      price: 0,
    };

    updatePhase({
      items: [
        ...draft.items,
        newItem,
      ],
    });
  }

  function deleteItem(id: string) {
    updatePhase({
      items: draft.items.filter(
        (item) => item.id !== id
      ),
    });
  }

  function moveItem(
    id: string,
    direction: "up" | "down"
  ) {
    const index = draft.items.findIndex(
      (item) => item.id === id
    );

    if (index === -1) return;

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= draft.items.length
    ) {
      return;
    }

    const items = [...draft.items];

    const [item] = items.splice(index, 1);

    items.splice(newIndex, 0, item);

    updatePhase({ items });
  }

  async function improvePhase() {
    if (!onImprove || improving) return;

    try {
      setImproving(true);

      const result = await onImprove(draft);

      if (result) {
        updatePhase(result);
      }
    } catch (error) {
      console.error(
        "Failed to improve phase:",
        error
      );
    } finally {
      setImproving(false);
    }
  }

  function save() {
    onSave?.(draft);
  }

  const totalPrice = draft.items.reduce(
    (total, item) =>
      total + Number(item.price || 0),
    0
  );

  return (
    <div className="rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515] p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8820C] text-xs font-black text-black">
              {String(
                draft.phaseNumber
              ).padStart(2, "0")}
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
                Phase editor
              </p>

              <h2 className="mt-1 text-lg font-black">
                Edit phase
              </h2>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
              aria-label="Close editor"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* PHASE DETAILS */}

      <div className="border-b border-[#292929] p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[120px_1fr]">
          {/* PHASE NUMBER */}

          <Field label="Phase">
            <input
              type="number"
              min={1}
              value={draft.phaseNumber}
              onChange={(event) =>
                updatePhase({
                  phaseNumber: Math.max(
                    1,
                    Number(
                      event.target.value
                    ) || 1
                  ),
                })
              }
              className={inputClass}
            />
          </Field>

          {/* TITLE */}

          <Field
            label="Phase title"
            icon={<FileText size={12} />}
          >
            <input
              type="text"
              value={draft.title}
              onChange={(event) =>
                updatePhase({
                  title:
                    event.target.value,
                })
              }
              placeholder="Arrival & Exploration"
              maxLength={100}
              className={inputClass}
            />

            <p className="mt-1.5 text-right text-[9px] font-bold text-zinc-700">
              {draft.title.length}/100
            </p>
          </Field>
        </div>

        {/* DESCRIPTION */}

        <div className="mt-5">
          <Field
            label="Description"
            icon={<FileText size={12} />}
          >
            <textarea
              value={draft.description}
              onChange={(event) =>
                updatePhase({
                  description:
                    event.target.value,
                })
              }
              placeholder="Describe what this phase of the itinerary covers..."
              rows={4}
              maxLength={500}
              className={`${inputClass} resize-none leading-6`}
            />

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[9px] font-bold text-zinc-700">
                Optional
              </span>

              <span className="text-[9px] font-bold text-zinc-700">
                {draft.description.length}/500
              </span>
            </div>
          </Field>
        </div>

        {/* AI IMPROVE */}

        {onImprove && (
          <button
            type="button"
            onClick={improvePhase}
            disabled={improving}
            className="mt-5 flex items-center gap-2 rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/5 px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-[#E8820C] transition hover:border-[#E8820C]/40 hover:bg-[#E8820C]/10 disabled:cursor-wait disabled:opacity-50"
          >
            <Sparkles
              size={13}
              className={
                improving
                  ? "animate-pulse"
                  : ""
              }
            />

            {improving
              ? "Improving phase..."
              : "Improve phase with AI"}
          </button>
        )}
      </div>

      {/* ITEMS HEADER */}

      <div className="flex items-center justify-between border-b border-[#292929] px-5 py-4 md:px-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider">
            Phase items
          </h3>

          <p className="mt-1 text-[10px] font-bold text-zinc-700">
            {draft.items.length}{" "}
            {draft.items.length === 1
              ? "item"
              : "items"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {totalPrice > 0 && (
            <span className="hidden text-xs font-black text-zinc-400 sm:block">
              ₹
              {totalPrice.toLocaleString(
                "en-IN"
              )}
            </span>
          )}

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 rounded-lg bg-[#E8820C] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
          >
            <Plus size={13} />
            Add item
          </button>
        </div>
      </div>

      {/* ITEMS */}

      {draft.items.length === 0 ? (
        <EmptyItems onAdd={addItem} />
      ) : (
        <div>
          {draft.items.map(
            (item, index) => (
              <PhaseItemEditor
                key={item.id}
                item={item}
                index={index}
                total={draft.items.length}
                onChange={(updates) =>
                  updateItem(
                    item.id,
                    updates
                  )
                }
                onDelete={() =>
                  deleteItem(item.id)
                }
                onMoveUp={() =>
                  moveItem(
                    item.id,
                    "up"
                  )
                }
                onMoveDown={() =>
                  moveItem(
                    item.id,
                    "down"
                  )
                }
              />
            )
          )}
        </div>
      )}

      {/* FOOTER */}

      <div className="flex flex-col-reverse gap-3 border-t border-[#292929] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <p className="text-[10px] font-bold text-zinc-700">
          Changes are applied to this phase.
        </p>

        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[#292929] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={save}
            className="flex items-center gap-2 rounded-lg bg-[#E8820C] px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
          >
            <Save size={13} />
            Save phase
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* PHASE ITEM EDITOR                                  */
/* ================================================== */

function PhaseItemEditor({
  item,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  item: PhaseItem;
  index: number;
  total: number;
  onChange: (
    updates: Partial<PhaseItem>
  ) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      {/* ITEM HEADER */}

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#292929] bg-[#181818] text-[10px] font-black text-[#E8820C]">
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
              Item
            </p>

            <p className="mt-0.5 max-w-[220px] truncate text-xs font-black">
              {item.title ||
                "Untitled item"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-950/30 hover:text-red-400"
          title="Delete item"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* TITLE */}

      <div className="mb-5">
        <Field label="Item title">
          <input
            type="text"
            value={item.title}
            onChange={(event) =>
              onChange({
                title:
                  event.target.value,
              })
            }
            placeholder="Visit a landmark"
            className={inputClass}
          />
        </Field>
      </div>

      {/* TIME / DURATION */}

      <div className="mb-5 grid gap-5 md:grid-cols-2">
        <Field label="Time">
          <input
            type="time"
            value={item.time || ""}
            onChange={(event) =>
              onChange({
                time:
                  event.target.value,
              })
            }
            className={inputClass}
          />
        </Field>

        <Field label="Duration">
          <input
            type="text"
            value={item.duration || ""}
            onChange={(event) =>
              onChange({
                duration:
                  event.target.value,
              })
            }
            placeholder="2 hours"
            className={inputClass}
          />
        </Field>
      </div>

      {/* LOCATION */}

      <div className="mb-5">
        <Field label="Location">
          <input
            type="text"
            value={item.location || ""}
            onChange={(event) =>
              onChange({
                location:
                  event.target.value,
              })
            }
            placeholder="Mysore Palace, Mysuru"
            className={inputClass}
          />
        </Field>
      </div>

      {/* DESCRIPTION */}

      <div className="mb-5">
        <Field label="Description">
          <textarea
            value={item.description}
            onChange={(event) =>
              onChange({
                description:
                  event.target.value,
              })
            }
            placeholder="Describe this item..."
            rows={4}
            maxLength={500}
            className={`${inputClass} resize-none leading-6`}
          />

          <p className="mt-1.5 text-right text-[9px] font-bold text-zinc-700">
            {item.description.length}/500
          </p>
        </Field>
      </div>

      {/* PRICE */}

      <div className="mb-5">
        <Field label="Price">
          <div className="flex overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#181818]">
            <div className="flex items-center border-r border-[#2A2A2A] px-4 text-sm font-black text-zinc-500">
              ₹
            </div>

            <input
              type="number"
              min={0}
              value={item.price || 0}
              onChange={(event) =>
                onChange({
                  price: Math.max(
                    0,
                    Number(
                      event.target.value
                    ) || 0
                  ),
                })
              }
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-black text-white outline-none"
            />

            <button
              type="button"
              onClick={() =>
                onChange({
                  price: Math.max(
                    0,
                    Number(item.price || 0) -
                      100
                  ),
                })
              }
              className="border-l border-[#2A2A2A] px-3 text-xs font-black text-zinc-500 transition hover:bg-[#222] hover:text-white"
            >
              −₹100
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  price:
                    Number(
                      item.price || 0
                    ) + 100,
                })
              }
              className="border-l border-[#2A2A2A] px-3 text-xs font-black text-zinc-500 transition hover:bg-[#222] hover:text-[#E8820C]"
            >
              +₹100
            </button>
          </div>
        </Field>
      </div>

      {/* REORDER */}

      <div className="flex items-center justify-between border-t border-[#242424] pt-4">
        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
          Item order
        </span>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#292929] text-zinc-600 transition hover:border-[#444] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            title="Move up"
          >
            <ArrowUp size={13} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={
              index === total - 1
            }
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#292929] text-zinc-600 transition hover:border-[#444] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            title="Move down"
          >
            <ArrowDown size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* EMPTY STATE                                        */
/* ================================================== */

function EmptyItems({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <div className="px-5 py-12 text-center md:px-6">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-zinc-600">
        <Plus size={17} />
      </div>

      <h3 className="mt-4 text-xs font-black">
        No items yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-zinc-700">
        Add an item to start building this
        phase.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
      >
        <Plus size={13} />
        Add item
      </button>
    </div>
  );
}

/* ================================================== */
/* FIELD                                              */
/* ================================================== */

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
        {icon}
        {label}
      </span>

      {children}
    </label>
  );
}

/* ================================================== */
/* INPUT STYLE                                        */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]";

/* ================================================== */
/* ID GENERATOR                                       */
/* ================================================== */

function createId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}
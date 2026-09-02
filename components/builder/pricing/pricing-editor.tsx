"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Percent,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import AdjustmentControl from "./adjustment-control";

export type PricingItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  included?: boolean;
};

export type PricingEditorValue = {
  currency: string;
  basePrice: number;
  markupPercent: number;
  discountPercent: number;
  items: PricingItem[];
};

type PricingEditorProps = {
  value: PricingEditorValue;
  onChange: (value: PricingEditorValue) => void;
  onSave?: (value: PricingEditorValue) => void;
  onCancel?: () => void;
  disabled?: boolean;
};

export default function PricingEditor({
  value,
  onChange,
  onSave,
  onCancel,
  disabled = false,
}: PricingEditorProps) {
  const [draft, setDraft] =
    useState<PricingEditorValue>(value);

  const [showItems, setShowItems] =
    useState(true);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function updatePricing(
    updates: Partial<PricingEditorValue>
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
    updates: Partial<PricingItem>
  ) {
    const items = draft.items.map((item) =>
      item.id === id
        ? {
            ...item,
            ...updates,
          }
        : item
    );

    updatePricing({ items });
  }

  function addItem() {
    const newItem: PricingItem = {
      id: createId(),
      name: "New item",
      quantity: 1,
      unitPrice: 0,
      included: false,
    };

    updatePricing({
      items: [
        ...draft.items,
        newItem,
      ],
    });
  }

  function removeItem(id: string) {
    updatePricing({
      items: draft.items.filter(
        (item) => item.id !== id
      ),
    });
  }

  const subtotal = useMemo(() => {
    return draft.items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0) *
          Number(item.unitPrice || 0),
      0
    );
  }, [draft.items]);

  const calculatedBase =
    draft.items.length > 0
      ? subtotal
      : Number(draft.basePrice || 0);

  const markupAmount =
    calculatedBase *
    (Number(draft.markupPercent || 0) /
      100);

  const discountAmount =
    (calculatedBase + markupAmount) *
    (Number(draft.discountPercent || 0) /
      100);

  const finalPrice = Math.max(
    0,
    calculatedBase +
      markupAmount -
      discountAmount
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515] p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
              Pricing
            </p>

            <h2 className="mt-1 text-lg font-black">
              Build your price
            </h2>

            <p className="mt-1.5 text-[10px] leading-5 text-zinc-600">
              Adjust the base price, markup, discount,
              and individual itinerary costs.
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={disabled}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white disabled:opacity-30"
              aria-label="Close pricing editor"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* CURRENCY */}

      <div className="border-b border-[#292929] p-5 md:p-6">
        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
          Currency
        </label>

        <select
          value={draft.currency}
          disabled={disabled}
          onChange={(event) =>
            updatePricing({
              currency:
                event.target.value,
            })
          }
          className={inputClass}
        >
          <option value="₹">
            Indian Rupee (₹)
          </option>

          <option value="$">
            US Dollar ($)
          </option>

          <option value="€">
            Euro (€)
          </option>

          <option value="£">
            British Pound (£)
          </option>

          <option value="¥">
            Japanese Yen (¥)
          </option>
        </select>
      </div>

      {/* BASE PRICE */}

      <div className="border-b border-[#292929] p-5 md:p-6">
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Base price
            </label>

            <span className="text-[9px] font-bold text-zinc-700">
              Starting price
            </span>
          </div>

          <div className="flex overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#181818]">
            <div className="flex items-center border-r border-[#2A2A2A] px-4 text-sm font-black text-zinc-500">
              {draft.currency}
            </div>

            <input
              type="number"
              min={0}
              value={draft.basePrice}
              disabled={disabled}
              onChange={(event) =>
                updatePricing({
                  basePrice: Math.max(
                    0,
                    Number(
                      event.target.value
                    ) || 0
                  ),
                })
              }
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-black text-white outline-none"
            />
          </div>
        </div>

        {/* MARKUP */}

        <div className="mb-5">
          <AdjustmentControl
            value={draft.markupPercent}
            onChange={(markupPercent) =>
              updatePricing({
                markupPercent,
              })
            }
            mode="percent"
            step={5}
            min={0}
            max={200}
            label="Builder markup"
            disabled={disabled}
          />
        </div>

        {/* DISCOUNT */}

        <AdjustmentControl
          value={draft.discountPercent}
          onChange={(discountPercent) =>
            updatePricing({
              discountPercent,
            })
          }
          mode="percent"
          step={5}
          min={0}
          max={100}
          label="Customer discount"
          disabled={disabled}
        />
      </div>

      {/* COST ITEMS */}

      <div className="border-b border-[#292929]">
        <button
          type="button"
          onClick={() =>
            setShowItems(!showItems)
          }
          className="flex w-full items-center justify-between px-5 py-4 text-left md:px-6"
        >
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider">
              Cost items
            </h3>

            <p className="mt-1 text-[10px] font-bold text-zinc-700">
              {draft.items.length}{" "}
              {draft.items.length === 1
                ? "item"
                : "items"}
            </p>
          </div>

          {showItems ? (
            <ChevronUp
              size={16}
              className="text-zinc-600"
            />
          ) : (
            <ChevronDown
              size={16}
              className="text-zinc-600"
            />
          )}
        </button>

        {showItems && (
          <div className="border-t border-[#242424]">
            {draft.items.length === 0 ? (
              <EmptyItems
                onAdd={addItem}
                disabled={disabled}
              />
            ) : (
              <>
                {draft.items.map(
                  (item) => (
                    <PricingItemRow
                      key={item.id}
                      item={item}
                      currency={
                        draft.currency
                      }
                      disabled={disabled}
                      onChange={(updates) =>
                        updateItem(
                          item.id,
                          updates
                        )
                      }
                      onDelete={() =>
                        removeItem(
                          item.id
                        )
                      }
                    />
                  )
                )}

                <div className="p-5 md:p-6">
                  <button
                    type="button"
                    onClick={addItem}
                    disabled={disabled}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#292929] py-3 text-[9px] font-black uppercase tracking-wider text-zinc-600 transition hover:border-[#E8820C] hover:text-[#E8820C] disabled:opacity-30"
                  >
                    <Plus size={13} />
                    Add cost item
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* CALCULATION */}

      <div className="border-b border-[#292929] bg-[#151515] p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Calculator
            size={14}
            className="text-[#E8820C]"
          />

          <h3 className="text-xs font-black uppercase tracking-wider">
            Price summary
          </h3>
        </div>

        <div className="space-y-3">
          <SummaryRow
            label="Base"
            value={formatMoney(
              calculatedBase,
              draft.currency
            )}
          />

          <SummaryRow
            label={`Markup (${draft.markupPercent}%)`}
            value={`+${formatMoney(
              markupAmount,
              draft.currency
            )}`}
            positive
          />

          {draft.discountPercent > 0 && (
            <SummaryRow
              label={`Discount (${draft.discountPercent}%)`}
              value={`-${formatMoney(
                discountAmount,
                draft.currency
              )}`}
              negative
            />
          )}

          <div className="my-3 border-t border-[#292929]" />

          <div className="flex items-end justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Final price
            </span>

            <span className="text-2xl font-black text-[#E8820C]">
              {formatMoney(
                finalPrice,
                draft.currency
              )}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <p className="text-[9px] font-bold text-zinc-700">
            Prices can be adjusted by the builder.
          </p>
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={disabled}
              className="rounded-lg border border-[#292929] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white disabled:opacity-30"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={() => onSave?.(draft)}
            disabled={disabled}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#E8820C] px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={13} />
            Save pricing
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* PRICING ITEM                                       */
/* ================================================== */

function PricingItemRow({
  item,
  currency,
  disabled,
  onChange,
  onDelete,
}: {
  item: PricingItem;
  currency: string;
  disabled: boolean;
  onChange: (
    updates: Partial<PricingItem>
  ) => void;
  onDelete: () => void;
}) {
  const total =
    Number(item.quantity || 0) *
    Number(item.unitPrice || 0);

  return (
    <div className="border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_100px_150px_auto] md:items-end">
        {/* NAME */}

        <div>
          <label className={labelClass}>
            Item
          </label>

          <input
            type="text"
            value={item.name}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                name:
                  event.target.value,
              })
            }
            placeholder="Hotel accommodation"
            className={inputClass}
          />
        </div>

        {/* QUANTITY */}

        <div>
          <label className={labelClass}>
            Qty
          </label>

          <input
            type="number"
            min={1}
            value={item.quantity}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                quantity: Math.max(
                  1,
                  Number(
                    event.target.value
                  ) || 1
                ),
              })
            }
            className={inputClass}
          />
        </div>

        {/* UNIT PRICE */}

        <div>
          <label className={labelClass}>
            Unit price
          </label>

          <div className="flex overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#181818]">
            <span className="flex items-center border-r border-[#2A2A2A] px-3 text-xs font-black text-zinc-600">
              {currency}
            </span>

            <input
              type="number"
              min={0}
              value={item.unitPrice}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  unitPrice: Math.max(
                    0,
                    Number(
                      event.target.value
                    ) || 0
                  ),
                })
              }
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-black text-white outline-none"
            />
          </div>
        </div>

        {/* DELETE */}

        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="flex h-[46px] w-full items-center justify-center rounded-lg border border-[#292929] text-zinc-700 transition hover:border-red-900/50 hover:bg-red-950/20 hover:text-red-400 disabled:opacity-30 md:w-[46px]"
          title="Delete item"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* ITEM TOTAL */}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-700">
          Item total
        </span>

        <span className="text-xs font-black text-zinc-400">
          {formatMoney(total, currency)}
        </span>
      </div>
    </div>
  );
}

/* ================================================== */
/* SUMMARY ROW                                        */
/* ================================================== */

function SummaryRow({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-bold text-zinc-600">
        {label}
      </span>

      <span
        className={[
          "text-xs font-black",
          positive
            ? "text-emerald-500"
            : "",
          negative
            ? "text-red-400"
            : "",
          !positive && !negative
            ? "text-zinc-400"
            : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

/* ================================================== */
/* EMPTY STATE                                        */
/* ================================================== */

function EmptyItems({
  onAdd,
  disabled,
}: {
  onAdd: () => void;
  disabled: boolean;
}) {
  return (
    <div className="px-5 py-10 text-center md:px-6">
      <DollarSign
        size={20}
        className="mx-auto text-zinc-700"
      />

      <p className="mt-3 text-xs font-black">
        No cost items
      </p>

      <p className="mt-1 text-[10px] text-zinc-700">
        Add hotels, transport, activities,
        meals, or other costs.
      </p>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black disabled:opacity-30"
      >
        <Plus size={13} />
        Add item
      </button>
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

function formatMoney(
  value: number,
  currency: string
) {
  return `${currency}${Math.round(
    value
  ).toLocaleString("en-IN")}`;
}

function createId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `price-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}
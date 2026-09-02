"use client";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

export type PricingItemData = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  included?: boolean;
};

type PricingItemProps = {
  item: PricingItemData;
  currency?: string;

  onChange: (
    updates: Partial<PricingItemData>
  ) => void;

  onDelete?: () => void;

  disabled?: boolean;
};

export default function PricingItem({
  item,
  currency = "₹",
  onChange,
  onDelete,
  disabled = false,
}: PricingItemProps) {
  const quantity = Math.max(
    1,
    Number(item.quantity) || 1
  );

  const unitPrice = Math.max(
    0,
    Number(item.unitPrice) || 0
  );

  const total = quantity * unitPrice;

  function changeQuantity(
    amount: number
  ) {
    onChange({
      quantity: Math.max(
        1,
        quantity + amount
      ),
    });
  }

  function changePrice(
    amount: number
  ) {
    onChange({
      unitPrice: Math.max(
        0,
        unitPrice + amount
      ),
    });
  }

  return (
    <div className="border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      {/* TOP */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
            Pricing item
          </label>

          <input
            type="text"
            value={item.name}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                name: event.target.value,
              })
            }
            placeholder="Hotel accommodation"
            className={inputClass}
          />
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="mt-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#292929] text-zinc-700 transition hover:border-red-900/50 hover:bg-red-950/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
            title="Delete pricing item"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* CONTROLS */}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {/* QUANTITY */}

        <div>
          <label className={labelClass}>
            Quantity
          </label>

          <div className="flex overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#181818]">
            <button
              type="button"
              onClick={() =>
                changeQuantity(-1)
              }
              disabled={
                disabled || quantity <= 1
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center border-r border-[#2A2A2A] text-zinc-600 transition hover:bg-[#222] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>

            <input
              type="number"
              min={1}
              value={quantity}
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
              className="min-w-0 flex-1 bg-transparent px-3 text-center text-sm font-black text-white outline-none"
            />

            <button
              type="button"
              onClick={() =>
                changeQuantity(1)
              }
              disabled={disabled}
              className="flex h-11 w-11 shrink-0 items-center justify-center border-l border-[#2A2A2A] text-zinc-600 transition hover:bg-[#222] hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* UNIT PRICE */}

        <div>
          <label className={labelClass}>
            Unit price
          </label>

          <div className="flex overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#181818]">
            <span className="flex h-11 items-center border-r border-[#2A2A2A] px-3 text-sm font-black text-zinc-600">
              {currency}
            </span>

            <input
              type="number"
              min={0}
              value={unitPrice}
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
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-black text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* QUICK PRICE ADJUSTMENT */}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <QuickButton
          label={`-${currency}100`}
          onClick={() =>
            changePrice(-100)
          }
          disabled={
            disabled || unitPrice <= 0
          }
        />

        <QuickButton
          label={`-${currency}500`}
          onClick={() =>
            changePrice(-500)
          }
          disabled={
            disabled || unitPrice <= 0
          }
        />

        <QuickButton
          label={`+${currency}500`}
          onClick={() =>
            changePrice(500)
          }
          disabled={disabled}
        />

        <QuickButton
          label={`+${currency}1,000`}
          onClick={() =>
            changePrice(1000)
          }
          disabled={disabled}
        />
      </div>

      {/* INCLUDED */}

      <div className="mt-5 flex items-center justify-between rounded-lg border border-[#242424] bg-[#151515] px-4 py-3">
        <div>
          <p className="text-[10px] font-black text-zinc-400">
            Included in package
          </p>

          <p className="mt-0.5 text-[9px] text-zinc-700">
            Show this cost as part of the itinerary.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={Boolean(
            item.included
          )}
          disabled={disabled}
          onClick={() =>
            onChange({
              included:
                !item.included,
            })
          }
          className={[
            "relative h-6 w-11 rounded-full transition",
            item.included
              ? "bg-[#E8820C]"
              : "bg-[#292929]",
            disabled
              ? "cursor-not-allowed opacity-40"
              : "",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
              item.included
                ? "left-6"
                : "left-1",
            ].join(" ")}
          />
        </button>
      </div>

      {/* TOTAL */}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-700">
          Item total
        </span>

        <span className="text-sm font-black text-white">
          {formatMoney(total, currency)}
        </span>
      </div>
    </div>
  );
}

/* ================================================== */
/* QUICK BUTTON                                       */
/* ================================================== */

function QuickButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-[#292929] px-2.5 py-1.5 text-[9px] font-black text-zinc-600 transition hover:border-[#444] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
    >
      {label}
    </button>
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
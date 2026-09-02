"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react";

export type PricingData = {
  basePrice: number;
  adjustment: number;
  discount: number;
  taxes: number;
  fees: number;
  currency: string;
};

type PricingProps = {
  pricing: PricingData;

  onChange?: (pricing: PricingData) => void;

  disabled?: boolean;

  onSuggestPrice?: () => void;

  aiLoading?: boolean;
};

export default function Pricing({
  pricing,
  onChange,
  disabled = false,
  onSuggestPrice,
  aiLoading = false,
}: PricingProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  const subtotal = useMemo(() => {
    return (
      pricing.basePrice +
      pricing.adjustment
    );
  }, [
    pricing.basePrice,
    pricing.adjustment,
  ]);

  const discountAmount = useMemo(() => {
    return Math.min(
      Math.max(pricing.discount, 0),
      Math.max(subtotal, 0)
    );
  }, [
    pricing.discount,
    subtotal,
  ]);

  const finalPrice = useMemo(() => {
    return Math.max(
      0,
      subtotal -
        discountAmount +
        Math.max(pricing.taxes, 0) +
        Math.max(pricing.fees, 0)
    );
  }, [
    subtotal,
    discountAmount,
    pricing.taxes,
    pricing.fees,
  ]);

  function updateField(
    field: keyof PricingData,
    value: number | string
  ) {
    onChange?.({
      ...pricing,
      [field]: value,
    });
  }

  function changeAmount(
    field: keyof PricingData,
    amount: number
  ) {
    const current =
      typeof pricing[field] === "number"
        ? (pricing[field] as number)
        : 0;

    updateField(
      field,
      Math.max(0, current + amount)
    );
  }

  function formatPrice(
    amount: number
  ) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency:
          pricing.currency || "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
            <Calculator
              size={17}
              className="text-[#E8820C]"
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
              Pricing
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Adjust the package price before sending
              it to the traveler.
            </p>
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
              Final price
            </p>

            <p className="mt-1 text-xs font-black text-white">
              {formatPrice(finalPrice)}
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
                ? "Expand pricing"
                : "Collapse pricing"
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
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
              Final price
            </span>

            <span className="text-xs font-black text-white">
              {formatPrice(finalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <div className="p-5 md:p-6">
          {/* CURRENCY */}

          <div className="mb-5">
            <label className={labelClass}>
              Currency
            </label>

            <select
              value={pricing.currency}
              disabled={disabled}
              onChange={(event) =>
                updateField(
                  "currency",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="INR">
                INR — Indian Rupee
              </option>

              <option value="USD">
                USD — US Dollar
              </option>

              <option value="EUR">
                EUR — Euro
              </option>

              <option value="GBP">
                GBP — British Pound
              </option>

              <option value="AED">
                AED — UAE Dirham
              </option>
            </select>
          </div>

          {/* PRICE GRID */}

          <div className="grid gap-4 md:grid-cols-2">
            {/* BASE PRICE */}

            <PriceControl
              label="Base price"
              description="Actual cost of the itinerary."
              value={pricing.basePrice}
              currency={pricing.currency}
              disabled={disabled}
              onChange={(value) =>
                updateField(
                  "basePrice",
                  value
                )
              }
              onDecrease={() =>
                changeAmount(
                  "basePrice",
                  -1000
                )
              }
              onIncrease={() =>
                changeAmount(
                  "basePrice",
                  1000
                )
              }
            />

            {/* ADJUSTMENT */}

            <PriceControl
              label="Builder adjustment"
              description="Your markup or manual price adjustment."
              value={pricing.adjustment}
              currency={pricing.currency}
              disabled={disabled}
              onChange={(value) =>
                updateField(
                  "adjustment",
                  value
                )
              }
              onDecrease={() =>
                changeAmount(
                  "adjustment",
                  -500
                )
              }
              onIncrease={() =>
                changeAmount(
                  "adjustment",
                  500
                )
              }
            />

            {/* DISCOUNT */}

            <PriceControl
              label="Discount"
              description="Amount deducted from the package price."
              value={pricing.discount}
              currency={pricing.currency}
              disabled={disabled}
              onChange={(value) =>
                updateField(
                  "discount",
                  value
                )
              }
              onDecrease={() =>
                changeAmount(
                  "discount",
                  -500
                )
              }
              onIncrease={() =>
                changeAmount(
                  "discount",
                  500
                )
              }
            />

            {/* TAXES */}

            <PriceControl
              label="Taxes"
              description="Taxes added to the traveler price."
              value={pricing.taxes}
              currency={pricing.currency}
              disabled={disabled}
              onChange={(value) =>
                updateField(
                  "taxes",
                  value
                )
              }
              onDecrease={() =>
                changeAmount(
                  "taxes",
                  -100
                )
              }
              onIncrease={() =>
                changeAmount(
                  "taxes",
                  100
                )
              }
            />

            {/* FEES */}

            <PriceControl
              label="Additional fees"
              description="Service or operational fees."
              value={pricing.fees}
              currency={pricing.currency}
              disabled={disabled}
              onChange={(value) =>
                updateField(
                  "fees",
                  value
                )
              }
              onDecrease={() =>
                changeAmount(
                  "fees",
                  -100
                )
              }
              onIncrease={() =>
                changeAmount(
                  "fees",
                  100
                )
              }
            />
          </div>

          {/* AI PRICE SUGGESTION */}

          {onSuggestPrice && (
            <button
              type="button"
              onClick={onSuggestPrice}
              disabled={
                disabled || aiLoading
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/5 py-3 text-[9px] font-black uppercase tracking-wider text-[#E8820C] transition hover:border-[#E8820C]/50 hover:bg-[#E8820C]/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Sparkles size={13} />

              {aiLoading
                ? "Calculating suggestion..."
                : "Suggest pricing with AI"}
            </button>
          )}

          {/* SUMMARY */}

          <div className="mt-5 rounded-xl border border-[#292929] bg-[#151515]">
            <div className="border-b border-[#292929] px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
                Price breakdown
              </p>
            </div>

            <div className="space-y-3 p-4">
              <SummaryRow
                label="Base price"
                value={formatPrice(
                  pricing.basePrice
                )}
              />

              <SummaryRow
                label="Builder adjustment"
                value={`${pricing.adjustment >= 0 ? "+" : "-"}${formatPrice(
                  Math.abs(
                    pricing.adjustment
                  )
                )}`}
              />

              <SummaryRow
                label="Subtotal"
                value={formatPrice(
                  subtotal
                )}
                strong
              />

              {discountAmount > 0 && (
                <SummaryRow
                  label="Discount"
                  value={`-${formatPrice(
                    discountAmount
                  )}`}
                />
              )}

              {pricing.taxes > 0 && (
                <SummaryRow
                  label="Taxes"
                  value={`+${formatPrice(
                    pricing.taxes
                  )}`}
                />
              )}

              {pricing.fees > 0 && (
                <SummaryRow
                  label="Additional fees"
                  value={`+${formatPrice(
                    pricing.fees
                  )}`}
                />
              )}

              <div className="my-2 border-t border-[#292929]" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
                    Traveler price
                  </p>

                  <p className="mt-1 text-[9px] text-zinc-700">
                    Final package price
                  </p>
                </div>

                <p className="text-xl font-black tracking-tight text-white">
                  {formatPrice(
                    finalPrice
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* MOBILE NOTE */}

          <p className="mt-4 text-[9px] leading-5 text-zinc-700">
            Positive builder adjustment increases the
            traveler price. A negative adjustment can be
            used when you want to reduce the selling
            price.
          </p>
        </div>
      )}
    </section>
  );
}

/* ================================================== */
/* PRICE CONTROL                                      */
/* ================================================== */

function PriceControl({
  label,
  description,
  value,
  currency,
  disabled,
  onChange,
  onDecrease,
  onIncrease,
}: {
  label: string;
  description: string;
  value: number;
  currency: string;
  disabled: boolean;
  onChange: (value: number) => void;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#292929] bg-[#151515] p-4">
      <div className="mb-3">
        <label className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </label>

        <p className="mt-1 text-[9px] leading-4 text-zinc-700">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* DECREASE */}

        <button
          type="button"
          onClick={onDecrease}
          disabled={disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-zinc-600 transition hover:border-[#E8820C]/40 hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} />
        </button>

        {/* INPUT */}

        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-700">
            {currency}
          </span>

          <input
            type="number"
            min="0"
            step="100"
            value={value}
            disabled={disabled}
            onChange={(event) =>
              onChange(
                Math.max(
                  0,
                  Number(event.target.value) ||
                    0
                )
              )
            }
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#181818] py-2.5 pl-12 pr-3 text-right text-sm font-black text-white outline-none focus:border-[#E8820C] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* INCREASE */}

        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-zinc-600 transition hover:border-[#E8820C]/40 hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} />
        </button>
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
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          strong
            ? "text-[10px] font-black text-zinc-400"
            : "text-[10px] font-bold text-zinc-600"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-xs font-black text-white"
            : "text-[10px] font-bold text-zinc-500"
        }
      >
        {value}
      </span>
    </div>
  );
}

/* ================================================== */
/* STYLES                                             */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#E8820C] disabled:cursor-not-allowed disabled:opacity-50";

const labelClass =
  "mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600";
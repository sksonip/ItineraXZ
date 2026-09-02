"use client";

import {
  ArrowDown,
  ArrowUp,
  Calculator,
  Check,
  CircleDollarSign,
} from "lucide-react";

export type PricingSummaryProps = {
  basePrice: number;
  markupPercent?: number;
  discountPercent?: number;

  currency?: string;

  title?: string;
  subtitle?: string;

  showBreakdown?: boolean;
  showPerPerson?: boolean;

  travelers?: number;

  onApply?: () => void;
  applyLabel?: string;

  className?: string;
};

export default function PricingSummary({
  basePrice,
  markupPercent = 0,
  discountPercent = 0,
  currency = "₹",
  title = "Pricing summary",
  subtitle = "Final itinerary price",
  showBreakdown = true,
  showPerPerson = false,
  travelers = 1,
  onApply,
  applyLabel = "Apply price",
  className = "",
}: PricingSummaryProps) {
  const safeBasePrice = Math.max(
    0,
    Number(basePrice) || 0
  );

  const safeMarkup = Math.max(
    0,
    Number(markupPercent) || 0
  );

  const safeDiscount = Math.max(
    0,
    Number(discountPercent) || 0
  );

  const safeTravelers = Math.max(
    1,
    Number(travelers) || 1
  );

  const markupAmount =
    safeBasePrice * (safeMarkup / 100);

  const priceAfterMarkup =
    safeBasePrice + markupAmount;

  const discountAmount =
    priceAfterMarkup * (safeDiscount / 100);

  const finalPrice = Math.max(
    0,
    priceAfterMarkup - discountAmount
  );

  const perPersonPrice =
    finalPrice / safeTravelers;

  return (
    <div
      className={[
        "overflow-hidden rounded-xl border border-[#292929] bg-[#111111]",
        className,
      ].join(" ")}
    >
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515] px-5 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
            <Calculator
              size={15}
              className="text-[#E8820C]"
            />
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              {title}
            </h3>

            <p className="mt-1 text-[9px] font-bold text-zinc-700">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* BREAKDOWN */}

      {showBreakdown && (
        <div className="border-b border-[#292929] px-5 py-5 md:px-6">
          <div className="space-y-4">
            {/* BASE */}

            <SummaryRow
              label="Base price"
              value={formatMoney(
                safeBasePrice,
                currency
              )}
            />

            {/* MARKUP */}

            {safeMarkup > 0 && (
              <SummaryRow
                label={`Builder markup (${safeMarkup}%)`}
                value={`+${formatMoney(
                  markupAmount,
                  currency
                )}`}
                type="positive"
                icon={<ArrowUp size={11} />}
              />
            )}

            {/* DISCOUNT */}

            {safeDiscount > 0 && (
              <SummaryRow
                label={`Discount (${safeDiscount}%)`}
                value={`-${formatMoney(
                  discountAmount,
                  currency
                )}`}
                type="negative"
                icon={<ArrowDown size={11} />}
              />
            )}
          </div>
        </div>
      )}

      {/* FINAL PRICE */}

      <div className="bg-[#151515] px-5 py-5 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CircleDollarSign
                size={14}
                className="text-[#E8820C]"
              />

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Final price
              </span>
            </div>

            {showPerPerson &&
              safeTravelers > 1 && (
                <p className="mt-2 text-[9px] font-bold text-zinc-700">
                  {formatMoney(
                    perPersonPrice,
                    currency
                  )}{" "}
                  per person
                </p>
              )}
          </div>

          <span className="text-2xl font-black text-[#E8820C] md:text-3xl">
            {formatMoney(
              finalPrice,
              currency
            )}
          </span>
        </div>

        {/* PER PERSON */}

        {showPerPerson &&
          safeTravelers > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-[#292929] bg-[#111111] px-4 py-3">
              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-600">
                {safeTravelers} travelers
              </span>

              <span className="text-xs font-black text-zinc-300">
                {formatMoney(
                  perPersonPrice,
                  currency
                )}{" "}
                / person
              </span>
            </div>
          )}
      </div>

      {/* APPLY */}

      {onApply && (
        <div className="border-t border-[#292929] p-5 md:px-6">
          <button
            type="button"
            onClick={onApply}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8820C] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
          >
            <Check size={13} />
            {applyLabel}
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================================== */
/* SUMMARY ROW                                        */
/* ================================================== */

function SummaryRow({
  label,
  value,
  type = "normal",
  icon,
}: {
  label: string;
  value: string;
  type?: "normal" | "positive" | "negative";
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2">
        {icon && (
          <span
            className={[
              "flex h-5 w-5 shrink-0 items-center justify-center rounded",
              type === "positive"
                ? "bg-emerald-500/10 text-emerald-500"
                : "",
              type === "negative"
                ? "bg-red-500/10 text-red-400"
                : "",
            ].join(" ")}
          >
            {icon}
          </span>
        )}

        <span className="truncate text-[10px] font-bold text-zinc-600">
          {label}
        </span>
      </div>

      <span
        className={[
          "shrink-0 text-xs font-black",
          type === "positive"
            ? "text-emerald-500"
            : "",
          type === "negative"
            ? "text-red-400"
            : "",
          type === "normal"
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
/* FORMAT                                             */
/* ================================================== */

function formatMoney(
  value: number,
  currency: string
) {
  return `${currency}${Math.round(
    value
  ).toLocaleString("en-IN")}`;
}
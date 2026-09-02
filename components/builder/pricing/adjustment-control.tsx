"use client";

import {
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

type AdjustmentMode = "amount" | "percent";

type AdjustmentControlProps = {
  value: number;
  onChange: (value: number) => void;

  mode?: AdjustmentMode;
  min?: number;
  max?: number;
  step?: number;

  currency?: string;
  label?: string;
  disabled?: boolean;
};

export default function AdjustmentControl({
  value,
  onChange,
  mode = "amount",
  min = 0,
  max,
  step = 100,
  currency = "₹",
  label = "Price adjustment",
  disabled = false,
}: AdjustmentControlProps) {
  const safeValue = Number.isFinite(value)
    ? value
    : 0;

  function clamp(next: number) {
    let result = next;

    if (result < min) {
      result = min;
    }

    if (
      max !== undefined &&
      result > max
    ) {
      result = max;
    }

    return result;
  }

  function update(next: number) {
    onChange(clamp(next));
  }

  function decrease() {
    update(safeValue - step);
  }

  function increase() {
    update(safeValue + step);
  }

  function reset() {
    onChange(0);
  }

  const displayValue =
    mode === "percent"
      ? `${safeValue}%`
      : `${currency}${safeValue.toLocaleString(
          "en-IN"
        )}`;

  const stepLabel =
    mode === "percent"
      ? `${step}%`
      : `${currency}${step.toLocaleString(
          "en-IN"
        )}`;

  return (
    <div className="w-full">
      {/* LABEL */}

      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </label>

        {safeValue !== 0 && (
          <button
            type="button"
            onClick={reset}
            disabled={disabled}
            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-zinc-700 transition hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw size={10} />
            Reset
          </button>
        )}
      </div>

      {/* CONTROL */}

      <div
        className={[
          "flex overflow-hidden rounded-lg border",
          "border-[#2A2A2A] bg-[#181818]",
          disabled
            ? "opacity-50"
            : "",
        ].join(" ")}
      >
        {/* DECREASE */}

        <button
          type="button"
          onClick={decrease}
          disabled={
            disabled ||
            safeValue <= min
          }
          className="flex h-12 w-12 shrink-0 items-center justify-center border-r border-[#2A2A2A] text-zinc-500 transition hover:bg-[#222] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
          aria-label={`Decrease by ${stepLabel}`}
        >
          <Minus size={15} />
        </button>

        {/* VALUE */}

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-4">
          <span className="text-sm font-black text-white">
            {displayValue}
          </span>

          {safeValue !== 0 && (
            <span
              className={[
                "mt-0.5 text-[9px] font-bold",
                safeValue > 0
                  ? "text-emerald-500"
                  : "text-red-400",
              ].join(" ")}
            >
              {safeValue > 0
                ? "Increase"
                : "Decrease"}
            </span>
          )}
        </div>

        {/* INCREASE */}

        <button
          type="button"
          onClick={increase}
          disabled={
            disabled ||
            (max !== undefined &&
              safeValue >= max)
          }
          className="flex h-12 w-12 shrink-0 items-center justify-center border-l border-[#2A2A2A] text-zinc-500 transition hover:bg-[#222] hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-25"
          aria-label={`Increase by ${stepLabel}`}
        >
          <Plus size={15} />
        </button>
      </div>

      {/* QUICK ADJUSTMENTS */}

      <div className="mt-2 flex flex-wrap gap-1.5">
        <QuickButton
          label={
            mode === "percent"
              ? "-10%"
              : `-${currency}${step}`
          }
          onClick={decrease}
          disabled={
            disabled ||
            safeValue <= min
          }
        />

        <QuickButton
          label="Reset"
          onClick={reset}
          disabled={
            disabled ||
            safeValue === 0
          }
        />

        <QuickButton
          label={
            mode === "percent"
              ? "+10%"
              : `+${currency}${step}`
          }
          onClick={increase}
          disabled={
            disabled ||
            (max !== undefined &&
              safeValue >= max)
          }
        />
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
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

type SliderProps = {
  value?: number;
  defaultValue?: number;

  min?: number;
  max?: number;
  step?: number;

  onChange?: (value: number) => void;

  label?: string;
  valueLabel?: string;
  hint?: string;

  disabled?: boolean;
  showValue?: boolean;
  showRange?: boolean;

  className?: string;
};

export default function Slider({
  value,
  defaultValue = 0,

  min = 0,
  max = 100,
  step = 1,

  onChange,

  label,
  valueLabel,
  hint,

  disabled = false,
  showValue = true,
  showRange = false,

  className = "",
}: SliderProps) {
  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const currentValue =
    value !== undefined
      ? value
      : internalValue;

  /* ====================================== */
  /* SYNC                                   */
  /* ====================================== */

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  /* ====================================== */
  /* PERCENTAGE                             */
  /* ====================================== */

  const percentage =
    max === min
      ? 0
      : ((currentValue - min) /
          (max - min)) *
        100;

  /* ====================================== */
  /* CHANGE                                 */
  /* ====================================== */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const nextValue = Number(
      event.target.value
    );

    setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div
      className={`w-full ${className}`}
    >
      {/* ================================== */}
      {/* HEADER                              */}
      {/* ================================== */}

      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          {label && (
            <span className="text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500">
              {label}
            </span>
          )}

          {showValue && (
            <span className="text-[9px] font-black tabular-nums text-[#E8820C]">
              {valueLabel ??
                currentValue}
            </span>
          )}
        </div>
      )}

      {/* ================================== */}
      {/* SLIDER                              */}
      {/* ================================== */}

      <div className="relative flex h-5 items-center">
        {/* TRACK */}

        <div className="pointer-events-none absolute left-0 right-0 h-1 overflow-hidden rounded-full bg-[#292929]">
          {/* FILLED TRACK */}

          <div
            className="h-full rounded-full bg-[#E8820C] transition-[width]"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, percentage)
              )}%`,
            }}
          />
        </div>

        {/* INPUT */}

        <input
          type="range"
          value={currentValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={handleChange}
          aria-label={
            label || "Slider"
          }
          className="
            relative
            z-10
            h-5
            w-full
            cursor-pointer
            appearance-none
            bg-transparent
            outline-none

            disabled:cursor-not-allowed
            disabled:opacity-40

            [&::-webkit-slider-runnable-track]:h-1
            [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-transparent

            [&::-webkit-slider-thumb]:mt-[-5px]
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#E8820C]
            [&::-webkit-slider-thumb]:bg-[#151515]
            [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(232,130,12,0.12)]

            [&::-moz-range-track]:h-1
            [&::-moz-range-track]:rounded-full
            [&::-moz-range-track]:bg-transparent

            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#E8820C]
            [&::-moz-range-thumb]:bg-[#151515]
          "
        />
      </div>

      {/* ================================== */}
      {/* RANGE LABELS                        */}
      {/* ================================== */}

      {showRange && (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[7px] font-bold text-zinc-700">
            {min}
          </span>

          <span className="text-[7px] font-bold text-zinc-700">
            {max}
          </span>
        </div>
      )}

      {/* ================================== */}
      {/* HINT                                */}
      {/* ================================== */}

      {hint && (
        <p className="mt-1.5 text-[8px] leading-4 text-zinc-700">
          {hint}
        </p>
      )}
    </div>
  );
}
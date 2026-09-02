"use client";

import {
  Minus,
  Plus,
} from "lucide-react";
import {
  useEffect,
  useState,
  type InputHTMLAttributes,
} from "react";

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  value?: number;
  onChange?: (value: number) => void;

  min?: number;
  max?: number;
  step?: number;

  label?: string;
  hint?: string;
  error?: string;

  showControls?: boolean;
  allowEmpty?: boolean;
};

export default function NumberInput({
  value = 0,
  onChange,

  min,
  max,
  step = 1,

  label,
  hint,
  error,

  showControls = true,
  allowEmpty = false,

  disabled = false,
  className = "",
  id,

  ...props
}: NumberInputProps) {
  const [inputValue, setInputValue] =
    useState(String(value));

  /* ====================================== */
  /* SYNC EXTERNAL VALUE                    */
  /* ====================================== */

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  /* ====================================== */
  /* CLAMP                                  */
  /* ====================================== */

  const clampValue = (next: number) => {
    let result = next;

    if (
      min !== undefined &&
      result < min
    ) {
      result = min;
    }

    if (
      max !== undefined &&
      result > max
    ) {
      result = max;
    }

    return result;
  };

  /* ====================================== */
  /* CHANGE                                 */
  /* ====================================== */

  const updateValue = (next: number) => {
    const clamped = clampValue(next);

    setInputValue(String(clamped));
    onChange?.(clamped);
  };

  /* ====================================== */
  /* INPUT CHANGE                           */
  /* ====================================== */

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = event.target.value;

    if (raw === "" && allowEmpty) {
      setInputValue("");
      return;
    }

    // Don't allow non-numeric values.
    if (!/^-?\d*\.?\d*$/.test(raw)) {
      return;
    }

    setInputValue(raw);

    if (raw === "" || raw === "-") {
      return;
    }

    const parsed = Number(raw);

    if (Number.isNaN(parsed)) {
      return;
    }

    onChange?.(clampValue(parsed));
  };

  /* ====================================== */
  /* BLUR                                   */
  /* ====================================== */

  const handleBlur = () => {
    if (inputValue === "") {
      if (allowEmpty) {
        return;
      }

      updateValue(min ?? 0);
      return;
    }

    const parsed = Number(inputValue);

    if (Number.isNaN(parsed)) {
      updateValue(min ?? 0);
      return;
    }

    updateValue(parsed);
  };

  /* ====================================== */
  /* INCREMENT / DECREMENT                  */
  /* ====================================== */

  const increment = () => {
    const current =
      Number(inputValue) || 0;

    updateValue(current + step);
  };

  const decrement = () => {
    const current =
      Number(inputValue) || 0;

    updateValue(current - step);
  };

  const inputId =
    id ||
    (label
      ? label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
      : undefined);

  return (
    <div className="w-full">
      {/* ================================== */}
      {/* LABEL                               */}
      {/* ================================== */}

      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500"
        >
          {label}
        </label>
      )}

      {/* ================================== */}
      {/* INPUT                               */}
      {/* ================================== */}

      <div
        className={`
          flex
          h-9
          w-full
          items-center
          overflow-hidden
          rounded-lg
          border
          bg-[#151515]
          transition
          ${
            error
              ? "border-red-500/50"
              : "border-[#292929] focus-within:border-[#E8820C]/60"
          }
          ${
            disabled
              ? "opacity-40"
              : ""
          }
        `}
      >
        {/* MINUS */}

        {showControls && (
          <button
            type="button"
            onClick={decrement}
            disabled={
              disabled ||
              (min !== undefined &&
                Number(inputValue) <= min)
            }
            aria-label="Decrease value"
            className="flex h-full w-9 shrink-0 items-center justify-center border-r border-[#292929] text-zinc-600 transition hover:bg-[#202020] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Minus size={12} />
          </button>
        )}

        {/* NUMBER FIELD */}

        <input
          {...props}
          id={inputId}
          type="number"
          value={inputValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            h-full
            min-w-0
            flex-1
            bg-transparent
            px-2
            text-center
            text-[10px]
            font-bold
            text-white
            outline-none
            placeholder:text-zinc-700
            [appearance:textfield]
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none
            ${className}
          `}
        />

        {/* PLUS */}

        {showControls && (
          <button
            type="button"
            onClick={increment}
            disabled={
              disabled ||
              (max !== undefined &&
                Number(inputValue) >= max)
            }
            aria-label="Increase value"
            className="flex h-full w-9 shrink-0 items-center justify-center border-l border-[#292929] text-zinc-600 transition hover:bg-[#202020] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus size={12} />
          </button>
        )}
      </div>

      {/* ================================== */}
      {/* ERROR                               */}
      {/* ================================== */}

      {error && (
        <p className="mt-1.5 text-[8px] font-bold text-red-400">
          {error}
        </p>
      )}

      {/* ================================== */}
      {/* HINT                                */}
      {/* ================================== */}

      {!error && hint && (
        <p className="mt-1.5 text-[8px] leading-4 text-zinc-700">
          {hint}
        </p>
      )}
    </div>
  );
}
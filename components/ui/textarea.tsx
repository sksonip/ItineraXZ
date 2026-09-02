"use client";

import {
  useEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    hint?: string;
    error?: string;
    maxLength?: number;
    showCount?: boolean;
    autoResize?: boolean;
    containerClassName?: string;
  };

export default function Textarea({
  label,
  hint,
  error,
  showCount = false,
  autoResize = false,
  containerClassName = "",
  className = "",
  id,
  value,
  defaultValue,
  onChange,
  ...props
}: TextareaProps) {
  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const textareaId =
    id ||
    (label
      ? label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
      : undefined);

  /* ====================================== */
  /* AUTO RESIZE                            */
  /* ====================================== */

  const resizeTextarea = () => {
    const textarea =
      textareaRef.current;

    if (!textarea || !autoResize) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [value, autoResize]);

  /* ====================================== */
  /* CHANGE                                 */
  /* ====================================== */

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    resizeTextarea();
    onChange?.(event);
  };

  /* ====================================== */
  /* CHARACTER COUNT                        */
  /* ====================================== */

  const currentLength =
    typeof value === "string"
      ? value.length
      : typeof defaultValue === "string"
        ? defaultValue.length
        : 0;

  return (
    <div
      className={`w-full ${containerClassName}`}
    >
      {/* ================================== */}
      {/* LABEL                               */}
      {/* ================================== */}

      {label && (
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label
            htmlFor={textareaId}
            className="text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500"
          >
            {label}
          </label>

          {showCount && props.maxLength && (
            <span className="text-[7px] font-bold tabular-nums text-zinc-700">
              {currentLength}/{props.maxLength}
            </span>
          )}
        </div>
      )}

      {/* ================================== */}
      {/* TEXTAREA                            */}
      {/* ================================== */}

      <textarea
        {...props}
        ref={textareaRef}
        id={textareaId}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={`
          min-h-[96px]
          w-full
          resize-y
          rounded-lg
          border
          bg-[#151515]
          px-3
          py-2.5
          text-[10px]
          font-medium
          leading-5
          text-white
          outline-none
          transition
          placeholder:text-zinc-700
          focus:ring-1
          disabled:cursor-not-allowed
          disabled:opacity-40
          ${
            error
              ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/10"
              : "border-[#292929] hover:border-[#3a3a3a] focus:border-[#E8820C]/60 focus:ring-[#E8820C]/10"
          }
          ${
            autoResize
              ? "resize-none overflow-hidden"
              : ""
          }
          ${className}
        `}
      />

      {/* ================================== */}
      {/* FOOTER                              */}
      {/* ================================== */}

      {(error || hint) && (
        <div className="mt-1.5">
          {error ? (
            <p className="text-[8px] font-bold text-red-400">
              {error}
            </p>
          ) : (
            <p className="text-[8px] leading-4 text-zinc-700">
              {hint}
            </p>
          )}
        </div>
      )}

      {/* COUNT WITHOUT LABEL */}

      {!label &&
        showCount &&
        props.maxLength && (
          <div className="mt-1 flex justify-end">
            <span className="text-[7px] font-bold tabular-nums text-zinc-700">
              {currentLength}/{props.maxLength}
            </span>
          </div>
        )}
    </div>
  );
}
import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    hint?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    containerClassName?: string;
  };

export default function Input({
  label,
  hint,
  error,
  leftIcon,
  rightIcon,
  containerClassName = "",
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId =
    id ||
    (label
      ? label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
      : undefined);

  return (
    <div
      className={`w-full ${containerClassName}`}
    >
      {/* LABEL */}

      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500"
        >
          {label}
        </label>
      )}

      {/* INPUT WRAPPER */}

      <div className="relative">
        {/* LEFT ICON */}

        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-zinc-600">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`
            h-9
            w-full
            rounded-lg
            border
            bg-[#151515]
            text-[10px]
            font-medium
            text-white
            outline-none
            transition
            placeholder:text-zinc-700
            focus:border-[#E8820C]/60
            focus:ring-1
            focus:ring-[#E8820C]/10
            disabled:cursor-not-allowed
            disabled:opacity-40
            ${
              error
                ? "border-red-500/50 focus:border-red-500/70"
                : "border-[#292929] hover:border-[#3a3a3a]"
            }
            ${leftIcon ? "pl-9" : "px-3"}
            ${rightIcon ? "pr-9" : "pr-3"}
            ${className}
          `}
          {...props}
        />

        {/* RIGHT ICON */}

        {rightIcon && (
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-zinc-600">
            {rightIcon}
          </div>
        )}
      </div>

      {/* ERROR */}

      {error && (
        <p className="mt-1.5 text-[8px] font-bold text-red-400">
          {error}
        </p>
      )}

      {/* HINT */}

      {!error && hint && (
        <p className="mt-1.5 text-[8px] leading-4 text-zinc-700">
          {hint}
        </p>
      )}
    </div>
  );
}
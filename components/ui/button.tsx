import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "outline"
  | "link";

type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children: ReactNode;
  };

const variantClasses: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-[#E8820C] text-black hover:bg-[#F3921C] active:bg-[#D87300]",

  secondary:
    "bg-[#202020] text-white hover:bg-[#292929] active:bg-[#181818]",

  ghost:
    "bg-transparent text-zinc-500 hover:bg-[#202020] hover:text-white",

  danger:
    "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300",

  outline:
    "border border-[#292929] bg-transparent text-zinc-400 hover:border-[#444] hover:bg-[#181818] hover:text-white",

  link:
    "bg-transparent p-0 text-[#E8820C] hover:text-[#F3921C] hover:underline",
};

const sizeClasses: Record<
  ButtonSize,
  string
> = {
  sm: "h-8 px-3 text-[8px]",
  md: "h-9 px-4 text-[9px]",
  lg: "h-11 px-5 text-[10px]",
  icon: "h-9 w-9 p-0 text-[10px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex
        shrink-0
        items-center
        justify-center
        gap-2
        rounded-lg
        font-black
        uppercase
        tracking-wider
        transition-all
        duration-150
        outline-none
        focus-visible:ring-2
        focus-visible:ring-[#E8820C]/50
        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />

          <span>Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
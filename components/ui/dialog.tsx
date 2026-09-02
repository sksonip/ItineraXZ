"use client";

import {
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

/* ========================================== */
/* TYPES                                      */
/* ========================================== */

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

type DialogContentProps =
  HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    showClose?: boolean;
};

type DialogHeaderProps =
  HTMLAttributes<HTMLDivElement>;

type DialogTitleProps =
  HTMLAttributes<HTMLHeadingElement>;

type DialogDescriptionProps =
  HTMLAttributes<HTMLParagraphElement>;

type DialogFooterProps =
  HTMLAttributes<HTMLDivElement>;

/* ========================================== */
/* DIALOG                                     */
/* ========================================== */

export function Dialog({
  open,
  onOpenChange,
  children,
}: DialogProps) {
  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onOpenChange]);

  if (!mounted || !open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close dialog"
        onClick={() =>
          onOpenChange(false)
        }
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-[3px]"
      />

      {/* CONTENT */}

      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}

/* ========================================== */
/* DIALOG CONTENT                             */
/* ========================================== */

export function DialogContent({
  title,
  description,
  icon: Icon,
  showClose = true,
  className = "",
  children,
  ...props
}: DialogContentProps) {
  const contentRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  return (
    <div
      ref={contentRef}
      tabIndex={-1}
      className={`
        max-h-[90vh]
        overflow-y-auto
        rounded-xl
        border
        border-[#292929]
        bg-[#151515]
        text-white
        shadow-[0_25px_80px_rgba(0,0,0,0.5)]
        outline-none
        ${className}
      `}
      {...props}
    >
      {/* HEADER */}

      {(title ||
        description ||
        Icon ||
        showClose) && (
        <div className="border-b border-[#292929] px-5 py-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8820C]/10">
                <Icon
                  size={15}
                  className="text-[#E8820C]"
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              {title && (
                <h2 className="text-sm font-black tracking-tight text-white">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-[9px] leading-5 text-zinc-600">
                  {description}
                </p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={() => {
                  const event =
                    new CustomEvent(
                      "dialog-close"
                    );

                  window.dispatchEvent(
                    event
                  );
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#202020] hover:text-white"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* BODY */}

      <div className="px-5 py-5">
        {children}
      </div>
    </div>
  );
}

/* ========================================== */
/* HEADER                                     */
/* ========================================== */

export function DialogHeader({
  className = "",
  ...props
}: DialogHeaderProps) {
  return (
    <div
      className={`mb-5 flex flex-col space-y-1.5 ${className}`}
      {...props}
    />
  );
}

/* ========================================== */
/* TITLE                                      */
/* ========================================== */

export function DialogTitle({
  className = "",
  ...props
}: DialogTitleProps) {
  return (
    <h2
      className={`text-sm font-black tracking-tight text-white ${className}`}
      {...props}
    />
  );
}

/* ========================================== */
/* DESCRIPTION                               */
/* ========================================== */

export function DialogDescription({
  className = "",
  ...props
}: DialogDescriptionProps) {
  return (
    <p
      className={`text-[9px] leading-5 text-zinc-600 ${className}`}
      {...props}
    />
  );
}

/* ========================================== */
/* FOOTER                                     */
/* ========================================== */

export function DialogFooter({
  className = "",
  ...props
}: DialogFooterProps) {
  return (
    <div
      className={`
        mt-5
        flex
        flex-col-reverse
        gap-2
        border-t
        border-[#292929]
        pt-4
        sm:flex-row
        sm:justify-end
        ${className}
      `}
      {...props}
    />
  );
}

/* ========================================== */
/* CLOSE                                      */
/* ========================================== */

export function DialogClose({
  onClick,
  className = "",
  children = "Cancel",
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-9
        rounded-lg
        border
        border-[#292929]
        bg-transparent
        px-4
        text-[8px]
        font-black
        uppercase
        tracking-wider
        text-zinc-500
        transition
        hover:border-[#444]
        hover:bg-[#202020]
        hover:text-white
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
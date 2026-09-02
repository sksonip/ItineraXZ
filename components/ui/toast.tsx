"use client";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ========================================== */
/* TYPES                                      */
/* ========================================== */

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

export type ToastData = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
};

type ToastOptions = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
};

type ToastContextValue = {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  success: (
    title: string,
    description?: string
  ) => string;
  error: (
    title: string,
    description?: string
  ) => string;
  warning: (
    title: string,
    description?: string
  ) => string;
  info: (
    title: string,
    description?: string
  ) => string;
};

/* ========================================== */
/* CONTEXT                                    */
/* ========================================== */

const ToastContext =
  createContext<ToastContextValue | null>(
    null
  );

export function useToast() {
  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}

/* ========================================== */
/* PROVIDER                                   */
/* ========================================== */

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] =
    useState<ToastData[]>([]);

  const dismiss = useCallback(
    (id: string) => {
      setToasts((current) =>
        current.filter(
          (toast) => toast.id !== id
        )
      );
    },
    []
  );

  const toast = useCallback(
    ({
      title,
      description,
      type = "info",
      duration = 4000,
    }: ToastOptions) => {
      const id = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

      setToasts((current) => [
        ...current,
        {
          id,
          title,
          description,
          type,
          duration,
        },
      ]);

      if (duration > 0) {
        window.setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (
      title: string,
      description?: string
    ) =>
      toast({
        title,
        description,
        type: "success",
      }),
    [toast]
  );

  const error = useCallback(
    (
      title: string,
      description?: string
    ) =>
      toast({
        title,
        description,
        type: "error",
      }),
    [toast]
  );

  const warning = useCallback(
    (
      title: string,
      description?: string
    ) =>
      toast({
        title,
        description,
        type: "warning",
      }),
    [toast]
  );

  const info = useCallback(
    (
      title: string,
      description?: string
    ) =>
      toast({
        title,
        description,
        type: "info",
      }),
    [toast]
  );

  return (
    <ToastContext.Provider
      value={{
        toast,
        dismiss,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      <ToastViewport
        toasts={toasts}
        dismiss={dismiss}
      />
    </ToastContext.Provider>
  );
}

/* ========================================== */
/* VIEWPORT                                   */
/* ========================================== */

function ToastViewport({
  toasts,
  dismiss,
}: {
  toasts: ToastData[];
  dismiss: (id: string) => void;
}) {
  return (
    <div
      className="
        pointer-events-none
        fixed
        bottom-4
        right-4
        z-[200]
        flex
        w-[calc(100%-2rem)]
        max-w-sm
        flex-col
        gap-2
      "
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() =>
            dismiss(toast.id)
          }
        />
      ))}
    </div>
  );
}

/* ========================================== */
/* TOAST                                      */
/* ========================================== */

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: () => void;
}) {
  const config = getToastConfig(
    toast.type
  );

  return (
    <div
      role="status"
      className={`
        pointer-events-auto
        flex
        items-start
        gap-3
        rounded-xl
        border
        bg-[#151515]
        p-3
        shadow-[0_15px_50px_rgba(0,0,0,0.45)]
        animate-in
        slide-in-from-right-5
        fade-in
        duration-200
        ${config.border}
      `}
    >
      {/* ICON */}

      <div
        className={`
          mt-0.5
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-lg
          ${config.iconBackground}
        `}
      >
        <config.icon
          size={14}
          className={config.iconColor}
        />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-black text-white">
          {toast.title}
        </p>

        {toast.description && (
          <p className="mt-1 text-[8px] leading-4 text-zinc-600">
            {toast.description}
          </p>
        )}
      </div>

      {/* CLOSE */}

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-700 transition hover:bg-[#202020] hover:text-white"
      >
        <X size={12} />
      </button>
    </div>
  );
}

/* ========================================== */
/* CONFIG                                     */
/* ========================================== */

function getToastConfig(
  type: ToastType
) {
  switch (type) {
    case "success":
      return {
        icon: CheckCircle2,
        iconColor: "text-emerald-400",
        iconBackground:
          "bg-emerald-400/10",
        border:
          "border-emerald-400/20",
      };

    case "error":
      return {
        icon: AlertCircle,
        iconColor: "text-red-400",
        iconBackground:
          "bg-red-400/10",
        border: "border-red-400/20",
      };

    case "warning":
      return {
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        iconBackground:
          "bg-amber-400/10",
        border:
          "border-amber-400/20",
      };

    case "info":
    default:
      return {
        icon: Info,
        iconColor: "text-[#E8820C]",
        iconBackground:
          "bg-[#E8820C]/10",
        border:
          "border-[#E8820C]/20",
      };
  }
}
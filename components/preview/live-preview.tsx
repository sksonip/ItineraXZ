"use client";

import {
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LivePreviewProps = {
  children: ReactNode;

  /**
   * Changes whenever the builder data changes.
   * Used to show the preview as updated.
   */
  version?: number | string;

  title?: string;

  className?: string;

  /**
   * Optional callback when the preview is refreshed.
   */
  onRefresh?: () => void;
};

export default function LivePreview({
  children,
  version,
  title = "Live Preview",
  className = "",
  onRefresh,
}: LivePreviewProps) {
  const [fullscreen, setFullscreen] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updated, setUpdated] =
    useState(false);

  useEffect(() => {
    if (
      version === undefined ||
      version === null
    ) {
      return;
    }

    setUpdated(true);

    const timer = window.setTimeout(() => {
      setUpdated(false);
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [version]);

  const handleRefresh = () => {
    setRefreshing(true);

    onRefresh?.();

    window.setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#292929] bg-[#101010] ${className}`}
    >
      {/* ====================================== */}
      {/* HEADER                                 */}
      {/* ====================================== */}

      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#292929] bg-[#151515] px-3">
        {/* TITLE */}

        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full transition ${
              updated
                ? "bg-[#E8820C] shadow-[0_0_8px_rgba(232,130,12,0.7)]"
                : "bg-emerald-500"
            }`}
          />

          <div className="min-w-0">
            <p className="truncate text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
              {title}
            </p>

            <p className="hidden text-[7px] font-bold text-zinc-700 sm:block">
              {updated
                ? "Updating preview..."
                : "Preview is up to date"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#202020] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh preview"
          >
            <RefreshCw
              size={13}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
          </button>

          <button
            type="button"
            onClick={() =>
              setFullscreen(
                (value) => !value
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#202020] hover:text-white"
            aria-label={
              fullscreen
                ? "Exit fullscreen"
                : "Fullscreen preview"
            }
          >
            {fullscreen ? (
              <Minimize2 size={13} />
            ) : (
              <Maximize2 size={13} />
            )}
          </button>
        </div>
      </div>

      {/* ====================================== */}
      {/* PREVIEW                                */}
      {/* ====================================== */}

      <div
        className={
          fullscreen
            ? "fixed inset-0 z-[100] flex min-h-screen flex-col bg-[#090909]"
            : "relative min-h-0 flex-1"
        }
      >
        {fullscreen && (
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#292929] bg-[#151515] px-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
                {title}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setFullscreen(false)
              }
              className="flex h-8 items-center gap-2 rounded-lg border border-[#292929] px-3 text-[8px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white"
            >
              <Minimize2 size={12} />
              Exit Preview
            </button>
          </div>
        )}

        <div
          className={
            fullscreen
              ? "min-h-0 flex-1 overflow-auto bg-[#D7D7D7] p-4 md:p-8"
              : "h-full min-h-[500px] overflow-auto bg-[#D7D7D7] p-3 md:p-6"
          }
        >
          <div
            className={
              fullscreen
                ? "mx-auto flex w-full justify-center"
                : "flex min-w-max justify-center"
            }
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
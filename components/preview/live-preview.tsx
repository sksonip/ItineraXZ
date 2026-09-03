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
  /**
   * Render exactly one document page here.
   * The preview uses an A4 portrait canvas and clips anything
   * that extends beyond that page.
   */
  children: ReactNode;

  /** Changes whenever the builder data changes. */
  version?: number | string;

  title?: string;
  className?: string;

  /** Optional callback when the preview is manually refreshed. */
  onRefresh?: () => void;
};

export default function LivePreview({
  children,
  version,
  title = "PDF Preview",
  className = "",
  onRefresh,
}: LivePreviewProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (version === undefined || version === null) return;

    setUpdated(true);
    const timer = window.setTimeout(() => {
      setUpdated(false);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [version]);

  useEffect(() => {
    if (!fullscreen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () =>
      window.removeEventListener("keydown", closeOnEscape);
  }, [fullscreen]);

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh?.();

    window.setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  const previewSurface = (
    <div className="min-h-0 flex-1 overflow-auto bg-[#d7d7d7] p-3 md:p-6">
      <div className="flex min-h-full items-start justify-center">
        {/* One A4 page only: 595.56 × 841.68 points. */}
        <article className="relative aspect-[595.56/841.68] w-full max-w-[595.56px] shrink-0 overflow-hidden bg-white shadow-[0_12px_40px_rgba(0,0,0,0.24)]">
          <div className="absolute inset-0">{children}</div>
        </article>
      </div>
    </div>
  );

  return (
    <section
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#292929] bg-[#101010] ${className}`}
    >
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#292929] bg-[#151515] px-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full transition ${
              updated
                ? "bg-[#e8820c] shadow-[0_0_8px_rgba(232,130,12,0.7)]"
                : "bg-emerald-500"
            }`}
          />

          <div className="min-w-0">
            <p className="truncate text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
              {title}
            </p>
            <p className="hidden text-[7px] font-bold text-zinc-700 sm:block">
              {updated ? "Updating preview..." : "One-page A4 preview"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#202020] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh PDF preview"
          >
            <RefreshCw
              size={13}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={() => setFullscreen((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#202020] hover:text-white"
            aria-label={
              fullscreen
                ? "Exit fullscreen preview"
                : "Open fullscreen preview"
            }
          >
            {fullscreen ? (
              <Minimize2 size={13} />
            ) : (
              <Maximize2 size={13} />
            )}
          </button>
        </div>
      </header>

      {fullscreen ? (
        <div className="fixed inset-0 z-[100] flex min-h-screen flex-col bg-[#090909]">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#292929] bg-[#151515] px-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
                {title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="flex h-8 items-center gap-2 rounded-lg border border-[#292929] px-3 text-[8px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white"
            >
              <Minimize2 size={12} />
              Exit Preview
            </button>
          </div>

          {previewSurface}
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1">
          {previewSurface}
        </div>
      )}
    </section>
  );
}
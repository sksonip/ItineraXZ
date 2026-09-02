"use client";

import {
  Download,
  Eye,
  Maximize2,
  Minimize2,
  Printer,
  RefreshCw,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type PreviewToolbarProps = {
  zoom?: number;
  fullscreen?: boolean;
  loading?: boolean;

  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;

  onFullscreen?: () => void;
  onRefresh?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
};

export default function PreviewToolbar({
  zoom = 100,
  fullscreen = false,
  loading = false,

  onZoomIn,
  onZoomOut,
  onResetZoom,

  onFullscreen,
  onRefresh,
  onDownload,
  onPrint,
  onShare,
}: PreviewToolbarProps) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#292929] bg-[#151515] px-2">
      {/* ====================================== */}
      {/* LEFT                                 */}
      {/* ====================================== */}

      <div className="flex items-center gap-1">
        <div className="mr-2 hidden items-center gap-2 px-2 sm:flex">
          <Eye
            size={13}
            className="text-[#E8820C]"
          />

          <span className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Preview
          </span>
        </div>

        {/* ZOOM OUT */}

        <ToolbarButton
          label="Zoom out"
          onClick={onZoomOut}
          disabled={!onZoomOut}
        >
          <ZoomOut size={13} />
        </ToolbarButton>

        {/* ZOOM VALUE */}

        <button
          type="button"
          onClick={onResetZoom}
          disabled={!onResetZoom}
          className="flex h-7 min-w-[48px] items-center justify-center rounded-md px-2 text-[8px] font-black text-zinc-500 transition hover:bg-[#202020] hover:text-white disabled:cursor-default"
        >
          {Math.round(zoom)}%
        </button>

        {/* ZOOM IN */}

        <ToolbarButton
          label="Zoom in"
          onClick={onZoomIn}
          disabled={!onZoomIn}
        >
          <ZoomIn size={13} />
        </ToolbarButton>
      </div>

      {/* ====================================== */}
      {/* RIGHT                                */}
      {/* ====================================== */}

      <div className="flex items-center gap-1">
        {/* REFRESH */}

        {onRefresh && (
          <ToolbarButton
            label="Refresh preview"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw
              size={13}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
          </ToolbarButton>
        )}

        {/* SHARE */}

        {onShare && (
          <ToolbarButton
            label="Share itinerary"
            onClick={onShare}
          >
            <Share2 size={13} />
          </ToolbarButton>
        )}

        {/* PRINT */}

        {onPrint && (
          <ToolbarButton
            label="Print itinerary"
            onClick={onPrint}
          >
            <Printer size={13} />
          </ToolbarButton>
        )}

        {/* DOWNLOAD */}

        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="ml-1 flex h-7 items-center gap-1.5 rounded-md bg-[#E8820C] px-2.5 text-[8px] font-black uppercase tracking-wider text-black transition hover:bg-[#F3921C]"
          >
            <Download size={12} />
            <span className="hidden sm:inline">
              PDF
            </span>
          </button>
        )}

        {/* FULLSCREEN */}

        {onFullscreen && (
          <ToolbarButton
            label={
              fullscreen
                ? "Exit fullscreen"
                : "Fullscreen"
            }
            onClick={onFullscreen}
            active={fullscreen}
          >
            {fullscreen ? (
              <Minimize2 size={13} />
            ) : (
              <Maximize2 size={13} />
            )}
          </ToolbarButton>
        )}
      </div>
    </div>
  );
}

/* ========================================== */
/* TOOLBAR BUTTON                             */
/* ========================================== */

function ToolbarButton({
  children,
  label,
  onClick,
  disabled = false,
  active = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
        active
          ? "bg-[#E8820C]/10 text-[#E8820C]"
          : "text-zinc-600 hover:bg-[#202020] hover:text-white"
      } ${
        disabled
          ? "cursor-not-allowed opacity-30"
          : ""
      }`}
    >
      {children}
    </button>
  );
}
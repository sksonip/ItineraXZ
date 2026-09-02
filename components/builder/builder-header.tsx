"use client";

import {
  ArrowLeft,
  Eye,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";

type BuilderHeaderProps = {
  title?: string;
  subtitle?: string;
  saving?: boolean;
  dirty?: boolean;
  onBack?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  onImport?: () => void;
  onAiSuggest?: () => void;
};

export default function BuilderHeader({
  title = "Itinerary Builder",
  subtitle = "Create and refine your travel experience.",
  saving = false,
  dirty = false,
  onBack,
  onSave,
  onPreview,
  onImport,
  onAiSuggest,
}: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#292929] bg-[#0D0D0D]/95 backdrop-blur">
      <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 md:px-6">
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#292929] bg-[#151515] text-zinc-600 transition hover:border-[#3A3A3A] hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft size={15} />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-black tracking-tight text-white md:text-base">
                {title}
              </h1>

              {dirty && (
                <span className="hidden items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-zinc-600 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E8820C]" />
                  Unsaved
                </span>
              )}
            </div>

            <p className="mt-0.5 hidden truncate text-[9px] text-zinc-700 sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex shrink-0 items-center gap-2">
          {/* IMPORT */}

          {onImport && (
            <button
              type="button"
              onClick={onImport}
              className="hidden h-9 items-center gap-2 rounded-lg border border-[#292929] bg-[#151515] px-3 text-[9px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#3A3A3A] hover:text-white md:flex"
            >
              <Upload size={13} />
              Import
            </button>
          )}

          {/* AI */}

          {onAiSuggest && (
            <button
              type="button"
              onClick={onAiSuggest}
              className="flex h-9 items-center gap-2 rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/5 px-3 text-[9px] font-black uppercase tracking-wider text-[#E8820C] transition hover:border-[#E8820C]/50 hover:bg-[#E8820C]/10"
            >
              <Sparkles size={13} />

              <span className="hidden sm:inline">
                AI Suggest
              </span>
            </button>
          )}

          {/* PREVIEW */}

          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="hidden h-9 items-center gap-2 rounded-lg border border-[#292929] bg-[#151515] px-3 text-[9px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#3A3A3A] hover:text-white sm:flex"
            >
              <Eye size={13} />
              Preview
            </button>
          )}

          {/* SAVE */}

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex h-9 items-center gap-2 rounded-lg bg-[#E8820C] px-3.5 text-[9px] font-black uppercase tracking-wider text-black transition hover:bg-[#F28F19] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={13} />

              <span>
                {saving ? "Saving..." : "Save"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* MOBILE STATUS */}

      {dirty && (
        <div className="border-t border-[#202020] px-4 py-2 sm:hidden">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8820C]" />

            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-600">
              Unsaved changes
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
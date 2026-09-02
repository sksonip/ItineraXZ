"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
} from "lucide-react";

export type ItineraryOverview = {
  title: string;
  subtitle?: string;
  description: string;
  destination?: string;
  duration?: string;
};

type OverviewProps = {
  overview: ItineraryOverview;

  onChange?: (
    overview: ItineraryOverview
  ) => void;

  disabled?: boolean;

  onImproveWithAI?: () => void;

  aiLoading?: boolean;
};

export default function Overview({
  overview,
  onChange,
  disabled = false,
  onImproveWithAI,
  aiLoading = false,
}: OverviewProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function updateField(
    field: keyof ItineraryOverview,
    value: string
  ) {
    onChange?.({
      ...overview,
      [field]: value,
    });
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          {/* ICON */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
            <FileText
              size={17}
              className="text-[#E8820C]"
            />
          </div>

          {/* TITLE */}

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="min-w-0 flex-1 text-left"
          >
            <h2 className="text-sm font-black text-white md:text-base">
              Overview
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Define the main story and positioning of
              the itinerary.
            </p>
          </button>

          {/* COLLAPSE */}

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
            aria-label={
              collapsed
                ? "Expand overview"
                : "Collapse overview"
            }
          >
            {collapsed ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </button>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <div className="p-5 md:p-6">
          <div className="space-y-5">
            {/* TITLE */}

            <div>
              <label className={labelClass}>
                Itinerary title
              </label>

              <input
                type="text"
                value={overview.title}
                disabled={disabled}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value
                  )
                }
                placeholder="7 Days in Kerala"
                className={inputClass}
              />

              <p className={hintClass}>
                Use a clear title that immediately
                communicates the trip.
              </p>
            </div>

            {/* SUBTITLE */}

            <div>
              <label className={labelClass}>
                Subtitle
              </label>

              <input
                type="text"
                value={
                  overview.subtitle || ""
                }
                disabled={disabled}
                onChange={(event) =>
                  updateField(
                    "subtitle",
                    event.target.value
                  )
                }
                placeholder="A relaxed journey through God's Own Country"
                className={inputClass}
              />

              <p className={hintClass}>
                A short supporting line that makes the
                itinerary more compelling.
              </p>
            </div>

            {/* DESTINATION + DURATION */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Destination
                </label>

                <input
                  type="text"
                  value={
                    overview.destination ||
                    ""
                  }
                  disabled={disabled}
                  onChange={(event) =>
                    updateField(
                      "destination",
                      event.target.value
                    )
                  }
                  placeholder="Kerala, India"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Duration
                </label>

                <input
                  type="text"
                  value={
                    overview.duration || ""
                  }
                  disabled={disabled}
                  onChange={(event) =>
                    updateField(
                      "duration",
                      event.target.value
                    )
                  }
                  placeholder="7 Days / 6 Nights"
                  className={inputClass}
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600"
                >
                  Description
                </label>

                {onImproveWithAI && (
                  <button
                    type="button"
                    onClick={onImproveWithAI}
                    disabled={
                      disabled ||
                      aiLoading ||
                      !overview.description.trim()
                    }
                    className="flex items-center gap-1.5 rounded-md border border-[#E8820C]/20 bg-[#E8820C]/5 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#E8820C] transition hover:border-[#E8820C]/50 hover:bg-[#E8820C]/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Sparkles
                      size={11}
                    />

                    {aiLoading
                      ? "Improving..."
                      : "Improve with AI"}
                  </button>
                )}
              </div>

              <textarea
                value={overview.description}
                disabled={disabled}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the overall experience, who this itinerary is for, and what makes the journey special..."
                rows={7}
                className={`${inputClass} resize-none`}
              />

              <div className="mt-2 flex items-center justify-between">
                <p className={hintClass}>
                  Give travelers enough context to
                  understand the experience.
                </p>

                <span className="shrink-0 text-[9px] font-bold text-zinc-700">
                  {
                    overview.description
                      .length
                  }{" "}
                  chars
                </span>
              </div>
            </div>
          </div>

          {/* AI TIP */}

          {onImproveWithAI && (
            <div className="mt-5 flex gap-3 rounded-lg border border-[#292929] bg-[#151515] p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#E8820C]/10">
                <Sparkles
                  size={13}
                  className="text-[#E8820C]"
                />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">
                  Gemini suggestion
                </p>

                <p className="mt-1 text-[10px] leading-5 text-zinc-700">
                  Write a rough description first.
                  Gemini can turn it into polished,
                  traveler-facing copy.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ================================================== */
/* STYLES                                             */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C] disabled:cursor-not-allowed disabled:opacity-50";

const labelClass =
  "mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600";

const hintClass =
  "mt-1.5 text-[9px] leading-4 text-zinc-700";
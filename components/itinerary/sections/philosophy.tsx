"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Sparkles,
} from "lucide-react";

export type ItineraryPhilosophy = {
  title: string;
  description: string;
};

type PhilosophyProps = {
  philosophy: ItineraryPhilosophy;

  onChange?: (
    philosophy: ItineraryPhilosophy
  ) => void;

  disabled?: boolean;

  onImproveWithAI?: () => void;

  aiLoading?: boolean;
};

export default function Philosophy({
  philosophy,
  onChange,
  disabled = false,
  onImproveWithAI,
  aiLoading = false,
}: PhilosophyProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function updateField(
    field: keyof ItineraryPhilosophy,
    value: string
  ) {
    onChange?.({
      ...philosophy,
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
            <Compass
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
              Travel Philosophy
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Explain the thinking and approach behind
              this itinerary.
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
                ? "Expand philosophy"
                : "Collapse philosophy"
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
                Philosophy title
              </label>

              <input
                type="text"
                value={philosophy.title}
                disabled={disabled}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Travel slower. Experience more."
                className={inputClass}
              />

              <p className={hintClass}>
                A short statement that captures the
                philosophy of the journey.
              </p>
            </div>

            {/* DESCRIPTION */}

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className={labelClass}>
                  Description
                </label>

                {onImproveWithAI && (
                  <button
                    type="button"
                    onClick={onImproveWithAI}
                    disabled={
                      disabled ||
                      aiLoading ||
                      !philosophy.description.trim()
                    }
                    className="flex items-center gap-1.5 rounded-md border border-[#E8820C]/20 bg-[#E8820C]/5 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#E8820C] transition hover:border-[#E8820C]/50 hover:bg-[#E8820C]/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Sparkles size={11} />

                    {aiLoading
                      ? "Improving..."
                      : "Improve with AI"}
                  </button>
                )}
              </div>

              <textarea
                value={philosophy.description}
                disabled={disabled}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Explain how this itinerary has been designed. For example: slower mornings, fewer hotel changes, local experiences, flexible free time, or a balance between sightseeing and relaxation..."
                rows={7}
                className={`${inputClass} resize-none`}
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className={hintClass}>
                  Focus on the experience and reasoning,
                  not just a list of activities.
                </p>

                <span className="shrink-0 text-[9px] font-bold text-zinc-700">
                  {
                    philosophy.description
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
                  Add rough ideas first. Gemini can
                  improve the wording without changing
                  the core travel concept.
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
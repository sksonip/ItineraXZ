"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

export type TripDetailsData = {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  tripType: string;
  pace: "relaxed" | "balanced" | "packed";
};

type TripDetailsProps = {
  tripDetails: TripDetailsData;

  onChange?: (
    tripDetails: TripDetailsData
  ) => void;

  disabled?: boolean;
};

export default function TripDetails({
  tripDetails,
  onChange,
  disabled = false,
}: TripDetailsProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function updateField(
    field: keyof TripDetailsData,
    value: string | number
  ) {
    onChange?.({
      ...tripDetails,
      [field]: value,
    });
  }

  function calculateDuration(
    startDate: string,
    endDate: string
  ) {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return 0;
    }

    const difference =
      end.getTime() -
      start.getTime();

    const days = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

    return Math.max(0, days + 1);
  }

  function handleDateChange(
    field: "startDate" | "endDate",
    value: string
  ) {
    const next = {
      ...tripDetails,
      [field]: value,
    };

    const duration =
      calculateDuration(
        next.startDate,
        next.endDate
      );

    onChange?.({
      ...next,
      duration,
    });
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          {/* ICON */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
            <MapPin
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
              Trip Details
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Set the destination, dates, travelers and
              overall trip style.
            </p>
          </button>

          {/* SUMMARY */}

          <div className="hidden items-center gap-4 sm:flex">
            {tripDetails.destination && (
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
                  Destination
                </p>

                <p className="mt-1 max-w-[150px] truncate text-[10px] font-bold text-zinc-400">
                  {tripDetails.destination}
                </p>
              </div>
            )}

            {tripDetails.duration > 0 && (
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
                  Duration
                </p>

                <p className="mt-1 text-[10px] font-bold text-zinc-400">
                  {tripDetails.duration}{" "}
                  {tripDetails.duration === 1
                    ? "day"
                    : "days"}
                </p>
              </div>
            )}
          </div>

          {/* COLLAPSE */}

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
            aria-label={
              collapsed
                ? "Expand trip details"
                : "Collapse trip details"
            }
          >
            {collapsed ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </button>
        </div>

        {/* MOBILE SUMMARY */}

        <div className="flex gap-4 border-t border-[#242424] px-5 py-3 sm:hidden">
          {tripDetails.destination && (
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-black uppercase tracking-wider text-zinc-700">
                Destination
              </p>

              <p className="mt-1 truncate text-[10px] font-bold text-zinc-500">
                {tripDetails.destination}
              </p>
            </div>
          )}

          {tripDetails.duration > 0 && (
            <div>
              <p className="text-[8px] font-black uppercase tracking-wider text-zinc-700">
                Duration
              </p>

              <p className="mt-1 text-[10px] font-bold text-zinc-500">
                {tripDetails.duration}{" "}
                {tripDetails.duration === 1
                  ? "day"
                  : "days"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <div className="p-5 md:p-6">
          <div className="space-y-5">
            {/* DESTINATION */}

            <div>
              <label className={labelClass}>
                Destination
              </label>

              <div className="relative">
                <MapPin
                  size={14}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700"
                />

                <input
                  type="text"
                  value={
                    tripDetails.destination
                  }
                  disabled={disabled}
                  onChange={(event) =>
                    updateField(
                      "destination",
                      event.target.value
                    )
                  }
                  placeholder="Kerala, India"
                  className={`${inputClass} pl-10`}
                />
              </div>

              <p className={hintClass}>
                Enter the main destination or region
                covered by the trip.
              </p>
            </div>

            {/* DATES */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Start date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700"
                  />

                  <input
                    type="date"
                    value={
                      tripDetails.startDate
                    }
                    disabled={disabled}
                    onChange={(event) =>
                      handleDateChange(
                        "startDate",
                        event.target.value
                      )
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  End date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700"
                  />

                  <input
                    type="date"
                    value={
                      tripDetails.endDate
                    }
                    min={
                      tripDetails.startDate ||
                      undefined
                    }
                    disabled={disabled}
                    onChange={(event) =>
                      handleDateChange(
                        "endDate",
                        event.target.value
                      )
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* DURATION + TRAVELERS */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Duration
                </label>

                <div className="relative">
                  <Clock3
                    size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700"
                  />

                  <input
                    type="number"
                    min={1}
                    value={
                      tripDetails.duration ||
                      ""
                    }
                    disabled={disabled}
                    onChange={(event) =>
                      updateField(
                        "duration",
                        Math.max(
                          1,
                          Number(
                            event.target
                              .value
                          ) || 1
                        )
                      )
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <p className={hintClass}>
                  Automatically calculated from the
                  dates, but can be adjusted.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Travelers
                </label>

                <div className="relative">
                  <Users
                    size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700"
                  />

                  <input
                    type="number"
                    min={1}
                    value={
                      tripDetails.travelers ||
                      ""
                    }
                    disabled={disabled}
                    onChange={(event) =>
                      updateField(
                        "travelers",
                        Math.max(
                          1,
                          Number(
                            event.target
                              .value
                          ) || 1
                        )
                      )
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <p className={hintClass}>
                  Number of travelers this itinerary is
                  being prepared for.
                </p>
              </div>
            </div>

            {/* TRIP TYPE */}

            <div>
              <label className={labelClass}>
                Trip type
              </label>

              <select
                value={
                  tripDetails.tripType
                }
                disabled={disabled}
                onChange={(event) =>
                  updateField(
                    "tripType",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select trip type
                </option>

                <option value="leisure">
                  Leisure
                </option>

                <option value="adventure">
                  Adventure
                </option>

                <option value="honeymoon">
                  Honeymoon
                </option>

                <option value="family">
                  Family
                </option>

                <option value="luxury">
                  Luxury
                </option>

                <option value="business">
                  Business
                </option>

                <option value="wellness">
                  Wellness
                </option>

                <option value="cultural">
                  Cultural
                </option>

                <option value="road-trip">
                  Road Trip
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* PACE */}

            <div>
              <label className={labelClass}>
                Travel pace
              </label>

              <div className="grid grid-cols-3 gap-2">
                <PaceButton
                  label="Relaxed"
                  description="More free time"
                  active={
                    tripDetails.pace ===
                    "relaxed"
                  }
                  disabled={disabled}
                  onClick={() =>
                    updateField(
                      "pace",
                      "relaxed"
                    )
                  }
                />

                <PaceButton
                  label="Balanced"
                  description="Mix of activity & rest"
                  active={
                    tripDetails.pace ===
                    "balanced"
                  }
                  disabled={disabled}
                  onClick={() =>
                    updateField(
                      "pace",
                      "balanced"
                    )
                  }
                />

                <PaceButton
                  label="Packed"
                  description="Maximum sightseeing"
                  active={
                    tripDetails.pace ===
                    "packed"
                  }
                  disabled={disabled}
                  onClick={() =>
                    updateField(
                      "pace",
                      "packed"
                    )
                  }
                />
              </div>

              <p className={hintClass}>
                This can later be used by Gemini to
                generate more suitable day suggestions.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ================================================== */
/* PACE BUTTON                                        */
/* ================================================== */

function PaceButton({
  label,
  description,
  active,
  disabled,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "border-[#E8820C]/40 bg-[#E8820C]/10"
          : "border-[#292929] bg-[#181818] hover:border-[#3A3A3A]"
      }`}
    >
      <p
        className={`text-[9px] font-black uppercase tracking-wider ${
          active
            ? "text-[#E8820C]"
            : "text-zinc-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-[8px] leading-4 text-zinc-700">
        {description}
      </p>
    </button>
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
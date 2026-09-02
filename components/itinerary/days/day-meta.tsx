"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Moon,
  Users,
} from "lucide-react";

export type DayMetaData = {
  date?: string;
  location?: string;
  duration?: string;
  nights?: number;
  travelers?: number;
};

type DayMetaProps = {
  meta: DayMetaData;
  onChange?: (meta: DayMetaData) => void;
  readOnly?: boolean;
};

export default function DayMeta({
  meta,
  onChange,
  readOnly = false,
}: DayMetaProps) {
  const update = (
    changes: Partial<DayMetaData>
  ) => {
    onChange?.({
      ...meta,
      ...changes,
    });
  };

  if (readOnly) {
    return (
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-[#292929] bg-[#151515] px-4 py-3">
        {meta.date && (
          <MetaItem
            icon={CalendarDays}
            label="Date"
            value={meta.date}
          />
        )}

        {meta.location && (
          <MetaItem
            icon={MapPin}
            label="Location"
            value={meta.location}
          />
        )}

        {meta.duration && (
          <MetaItem
            icon={Clock3}
            label="Duration"
            value={meta.duration}
          />
        )}

        {typeof meta.nights === "number" &&
          meta.nights > 0 && (
            <MetaItem
              icon={Moon}
              label="Nights"
              value={`${meta.nights} ${
                meta.nights === 1
                  ? "night"
                  : "nights"
              }`}
            />
          )}

        {typeof meta.travelers ===
          "number" &&
          meta.travelers > 0 && (
            <MetaItem
              icon={Users}
              label="Travelers"
              value={String(
                meta.travelers
              )}
            />
          )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#292929] bg-[#151515] p-4">
      <div className="mb-4">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
          Day Meta
        </p>

        <p className="mt-1 text-[9px] leading-4 text-zinc-700">
          Add the key details for this day.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* DATE */}

        <MetaField
          icon={CalendarDays}
          label="Date"
        >
          <input
            type="date"
            value={meta.date || ""}
            onChange={(event) =>
              update({
                date:
                  event.target.value,
              })
            }
            className={inputClass}
          />
        </MetaField>

        {/* LOCATION */}

        <MetaField
          icon={MapPin}
          label="Location"
        >
          <input
            type="text"
            value={meta.location || ""}
            onChange={(event) =>
              update({
                location:
                  event.target.value,
              })
            }
            placeholder="Munnar"
            className={inputClass}
          />
        </MetaField>

        {/* DURATION */}

        <MetaField
          icon={Clock3}
          label="Duration"
        >
          <input
            type="text"
            value={meta.duration || ""}
            onChange={(event) =>
              update({
                duration:
                  event.target.value,
              })
            }
            placeholder="8 hours"
            className={inputClass}
          />
        </MetaField>

        {/* NIGHTS */}

        <MetaField
          icon={Moon}
          label="Nights"
        >
          <input
            type="number"
            min={0}
            value={meta.nights ?? ""}
            onChange={(event) =>
              update({
                nights:
                  event.target.value ===
                  ""
                    ? undefined
                    : Math.max(
                        0,
                        Number(
                          event.target
                            .value
                        )
                      ),
              })
            }
            placeholder="1"
            className={inputClass}
          />
        </MetaField>
      </div>

      {/* TRAVELERS */}

      <div className="mt-3 max-w-[240px]">
        <MetaField
          icon={Users}
          label="Travelers"
        >
          <input
            type="number"
            min={1}
            value={meta.travelers ?? ""}
            onChange={(event) =>
              update({
                travelers:
                  event.target.value ===
                  ""
                    ? undefined
                    : Math.max(
                        1,
                        Number(
                          event.target
                            .value
                        )
                      ),
              })
            }
            placeholder="2"
            className={inputClass}
          />
        </MetaField>
      </div>
    </div>
  );
}

/* ================================================== */
/* FIELD                                             */
/* ================================================== */

function MetaField({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-zinc-600">
        <Icon size={10} />
        {label}
      </label>

      {children}
    </div>
  );
}

/* ================================================== */
/* READ ONLY ITEM                                    */
/* ================================================== */

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        size={12}
        className="shrink-0 text-[#E8820C]"
      />

      <div>
        <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-700">
          {label}
        </p>

        <p className="mt-0.5 text-[9px] font-bold text-zinc-400">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ================================================== */
/* STYLES                                            */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-3 py-2.5 text-[10px] font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C] focus:ring-1 focus:ring-[#E8820C]/10";
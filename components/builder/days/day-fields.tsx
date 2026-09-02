"use client";

import type { ReactNode } from "react";
import { CalendarDays, FileText, Hash } from "lucide-react";

export type DayFieldsValue = {
  dayNumber: number;
  date: string;
  title: string;
  description?: string;
};

type DayFieldsProps = {
  value: DayFieldsValue;
  onChange: (value: DayFieldsValue) => void;
  disabled?: boolean;
  showDescription?: boolean;
};

export default function DayFields({
  value,
  onChange,
  disabled = false,
  showDescription = true,
}: DayFieldsProps) {
  function update(
    updates: Partial<DayFieldsValue>
  ) {
    onChange({
      ...value,
      ...updates,
    });
  }

  return (
    <div className="space-y-5">
      {/* DAY NUMBER / DATE */}

      <div className="grid gap-5 md:grid-cols-[140px_1fr]">
        {/* DAY NUMBER */}

        <Field
          label="Day"
          icon={<Hash size={12} />}
        >
          <input
            type="number"
            min={1}
            value={value.dayNumber}
            disabled={disabled}
            onChange={(event) =>
              update({
                dayNumber: Math.max(
                  1,
                  Number(event.target.value) || 1
                ),
              })
            }
            className={inputClass(disabled)}
          />
        </Field>

        {/* DATE */}

        <Field
          label="Date"
          icon={<CalendarDays size={12} />}
        >
          <input
            type="date"
            value={value.date}
            disabled={disabled}
            onChange={(event) =>
              update({
                date: event.target.value,
              })
            }
            className={inputClass(disabled)}
          />
        </Field>
      </div>

      {/* TITLE */}

      <Field
        label="Day title"
        icon={<FileText size={12} />}
      >
        <input
          type="text"
          value={value.title}
          disabled={disabled}
          onChange={(event) =>
            update({
              title: event.target.value,
            })
          }
          placeholder="Arrival & Heritage"
          maxLength={100}
          className={inputClass(disabled)}
        />

        <div className="mt-1.5 flex justify-end">
          <span className="text-[9px] font-bold text-zinc-700">
            {value.title.length}/100
          </span>
        </div>
      </Field>

      {/* DESCRIPTION */}

      {showDescription && (
        <Field
          label="Day description"
          icon={<FileText size={12} />}
        >
          <textarea
            value={value.description || ""}
            disabled={disabled}
            onChange={(event) =>
              update({
                description:
                  event.target.value,
              })
            }
            placeholder="Describe the overall experience for this day..."
            rows={4}
            maxLength={500}
            className={`${inputClass(
              disabled
            )} resize-none leading-6`}
          />

          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[9px] font-bold text-zinc-700">
              Optional
            </span>

            <span className="text-[9px] font-bold text-zinc-700">
              {(value.description || "").length}
              /500
            </span>
          </div>
        </Field>
      )}
    </div>
  );
}

/* ================================================== */
/* FIELD                                              */
/* ================================================== */

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
        {icon}
        {label}
      </span>

      {children}
    </label>
  );
}

/* ================================================== */
/* INPUT STYLE                                        */
/* ================================================== */

function inputClass(disabled: boolean) {
  return [
    "w-full rounded-lg border bg-[#181818] px-4 py-3",
    "text-sm font-bold text-white outline-none",
    "placeholder:text-zinc-700",
    "transition",
    disabled
      ? "cursor-not-allowed border-[#242424] opacity-50"
      : "border-[#2A2A2A] focus:border-[#E8820C]",
  ].join(" ");
}
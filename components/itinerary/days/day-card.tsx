"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export type DayActivity = {
  id: string;
  title: string;
  description?: string;
  time?: string;
};

export type DayCardData = {
  id: string;
  day: number;
  title: string;
  description?: string;
  location?: string;
  activities: DayActivity[];
};

type DayCardProps = {
  day: DayCardData;
  onChange?: (day: DayCardData) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
  defaultOpen?: boolean;
};

export default function DayCard({
  day,
  onChange,
  onDelete,
  readOnly = false,
  defaultOpen = true,
}: DayCardProps) {
  const [open, setOpen] =
    useState(defaultOpen);

  const update = (
    changes: Partial<DayCardData>
  ) => {
    onChange?.({
      ...day,
      ...changes,
    });
  };

  const updateActivity = (
    activityId: string,
    changes: Partial<DayActivity>
  ) => {
    update({
      activities: day.activities.map(
        (activity) =>
          activity.id === activityId
            ? {
                ...activity,
                ...changes,
              }
            : activity
      ),
    });
  };

  const addActivity = () => {
    update({
      activities: [
        ...day.activities,
        {
          id: crypto.randomUUID(),
          title: "",
          description: "",
          time: "",
        },
      ],
    });
  };

  const deleteActivity = (
    activityId: string
  ) => {
    update({
      activities: day.activities.filter(
        (activity) =>
          activity.id !== activityId
      ),
    });
  };

  return (
    <article className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="flex items-center gap-3 border-b border-[#292929] px-4 py-4 md:px-5">
        {!readOnly && (
          <div
            className="cursor-grab text-zinc-800"
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </div>
        )}

        {/* DAY NUMBER */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
          <span className="text-[10px] font-black text-[#E8820C]">
            {String(day.day).padStart(
              2,
              "0"
            )}
          </span>
        </div>

        {/* TITLE */}

        <div className="min-w-0 flex-1">
          {readOnly ? (
            <>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-700">
                Day {day.day}
              </p>

              <h3 className="mt-0.5 truncate text-sm font-black text-white">
                {day.title ||
                  "Untitled day"}
              </h3>
            </>
          ) : (
            <input
              value={day.title}
              onChange={(event) =>
                update({
                  title:
                    event.target.value,
                })
              }
              placeholder={`Day ${day.day} title`}
              className="w-full bg-transparent text-sm font-black text-white outline-none placeholder:text-zinc-700"
            />
          )}

          {day.location && (
            <div className="mt-1 flex items-center gap-1.5 text-[9px] text-zinc-600">
              <MapPin size={10} />

              <span>
                {day.location}
              </span>
            </div>
          )}
        </div>

        {/* ACTIONS */}

        <div className="flex shrink-0 items-center gap-1">
          {!readOnly && onDelete && (
            <button
              type="button"
              onClick={() =>
                onDelete(day.id)
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-500/10 hover:text-red-400"
              aria-label={`Delete day ${day.day}`}
            >
              <Trash2 size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setOpen((value) => !value)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#1A1A1A] hover:text-white"
            aria-label={
              open
                ? "Collapse day"
                : "Expand day"
            }
          >
            {open ? (
              <ChevronUp size={15} />
            ) : (
              <ChevronDown size={15} />
            )}
          </button>
        </div>
      </div>

      {/* CONTENT */}

      {open && (
        <div className="p-4 md:p-5">
          {/* DESCRIPTION */}

          {!readOnly ? (
            <div className="mb-5">
              <label className={labelClass}>
                Day Description
              </label>

              <textarea
                value={day.description || ""}
                onChange={(event) =>
                  update({
                    description:
                      event.target.value,
                  })
                }
                placeholder="Describe what happens during this day..."
                rows={4}
                className={textareaClass}
              />
            </div>
          ) : (
            day.description && (
              <p className="mb-5 text-xs leading-6 text-zinc-500">
                {day.description}
              </p>
            )
          )}

          {/* LOCATION */}

          {!readOnly && (
            <div className="mb-6">
              <label className={labelClass}>
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700"
                />

                <input
                  value={day.location || ""}
                  onChange={(event) =>
                    update({
                      location:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Munnar, Kerala"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          )}

          {/* ACTIVITIES */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <label className={labelClass}>
                  Activities
                </label>

                <p className="text-[9px] text-zinc-700">
                  {day.activities.length}{" "}
                  {day.activities.length ===
                  1
                    ? "activity"
                    : "activities"}
                </p>
              </div>

              {!readOnly && (
                <button
                  type="button"
                  onClick={addActivity}
                  className="flex items-center gap-1.5 rounded-lg border border-[#292929] bg-[#151515] px-3 py-2 text-[8px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#E8820C]/40 hover:text-[#E8820C]"
                >
                  <Plus size={12} />
                  Add Activity
                </button>
              )}
            </div>

            {day.activities.length ===
              0 && (
              <div className="rounded-lg border border-dashed border-[#292929] px-4 py-8 text-center">
                <p className="text-[10px] font-bold text-zinc-700">
                  No activities added yet.
                </p>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={addActivity}
                    className="mt-2 text-[9px] font-black uppercase tracking-wider text-[#E8820C]"
                  >
                    Add first activity
                  </button>
                )}
              </div>
            )}

            <div className="space-y-3">
              {day.activities.map(
                (activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    index={index}
                    readOnly={readOnly}
                    onChange={(changes) =>
                      updateActivity(
                        activity.id,
                        changes
                      )
                    }
                    onDelete={() =>
                      deleteActivity(
                        activity.id
                      )
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

/* ================================================== */
/* ACTIVITY ITEM                                      */
/* ================================================== */

function ActivityItem({
  activity,
  index,
  readOnly,
  onChange,
  onDelete,
}: {
  activity: DayActivity;
  index: number;
  readOnly: boolean;
  onChange: (
    changes: Partial<DayActivity>
  ) => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-[#292929] bg-[#151515] p-4">
      <div className="flex gap-3">
        {/* NUMBER */}

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1D1D1D] text-[8px] font-black text-zinc-600">
          {String(index + 1).padStart(
            2,
            "0"
          )}
        </div>

        {/* FIELDS */}

        <div className="min-w-0 flex-1 space-y-3">
          {readOnly ? (
            <h4 className="text-xs font-black text-white">
              {activity.title ||
                "Untitled activity"}
            </h4>
          ) : (
            <input
              value={activity.title}
              onChange={(event) =>
                onChange({
                  title:
                    event.target.value,
                })
              }
              placeholder="Activity title"
              className={inputClass}
            />
          )}

          {!readOnly && (
            <input
              value={activity.time || ""}
              onChange={(event) =>
                onChange({
                  time:
                    event.target.value,
                })
              }
              placeholder="Time — e.g. 09:00 AM"
              className={inputClass}
            />
          )}

          {readOnly && activity.time && (
            <p className="text-[9px] font-bold text-[#E8820C]">
              {activity.time}
            </p>
          )}

          {readOnly ? (
            activity.description && (
              <p className="text-[10px] leading-5 text-zinc-600">
                {activity.description}
              </p>
            )
          ) : (
            <textarea
              value={
                activity.description || ""
              }
              onChange={(event) =>
                onChange({
                  description:
                    event.target.value,
                })
              }
              placeholder="Describe this activity..."
              rows={3}
              className={textareaClass}
            />
          )}
        </div>

        {/* DELETE */}

        {!readOnly && (
          <button
            type="button"
            onClick={onDelete}
            className="h-7 w-7 shrink-0 text-zinc-700 transition hover:text-red-400"
            aria-label="Delete activity"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ================================================== */
/* STYLES                                             */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-3 py-2.5 text-[11px] font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]";

const textareaClass =
  "w-full resize-none rounded-lg border border-[#2A2A2A] bg-[#181818] px-3 py-2.5 text-[11px] font-medium leading-5 text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]";

const labelClass =
  "mb-2 block text-[8px] font-black uppercase tracking-[0.18em] text-zinc-600";
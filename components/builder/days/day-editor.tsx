"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Clock3,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

export type EditorActivity = {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  duration: string;
  price: number;
};

export type DayEditorValue = {
  dayNumber: number;
  date: string;
  title: string;
  activities: EditorActivity[];
};

type DayEditorProps = {
  value: DayEditorValue;
  onChange: (value: DayEditorValue) => void;
  onSave?: (value: DayEditorValue) => void;
  onCancel?: () => void;
  onImprove?: (
    activity: EditorActivity
  ) => Promise<Partial<EditorActivity> | null>;
};

export default function DayEditor({
  value,
  onChange,
  onSave,
  onCancel,
  onImprove,
}: DayEditorProps) {
  const [draft, setDraft] =
    useState<DayEditorValue>(value);

  const [improvingId, setImprovingId] =
    useState<string | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function updateDay(
    updates: Partial<DayEditorValue>
  ) {
    const next = {
      ...draft,
      ...updates,
    };

    setDraft(next);
    onChange(next);
  }

  function updateActivity(
    id: string,
    updates: Partial<EditorActivity>
  ) {
    const activities = draft.activities.map(
      (activity) =>
        activity.id === id
          ? {
              ...activity,
              ...updates,
            }
          : activity
    );

    updateDay({ activities });
  }

  function addActivity() {
    const newActivity: EditorActivity = {
      id: createId(),
      time: "",
      title: "New activity",
      location: "",
      description: "",
      duration: "",
      price: 0,
    };

    updateDay({
      activities: [
        ...draft.activities,
        newActivity,
      ],
    });
  }

  function deleteActivity(id: string) {
    updateDay({
      activities: draft.activities.filter(
        (activity) => activity.id !== id
      ),
    });
  }

  function moveActivity(
    id: string,
    direction: "up" | "down"
  ) {
    const index =
      draft.activities.findIndex(
        (activity) => activity.id === id
      );

    if (index === -1) return;

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= draft.activities.length
    ) {
      return;
    }

    const activities = [
      ...draft.activities,
    ];

    const [item] = activities.splice(
      index,
      1
    );

    activities.splice(newIndex, 0, item);

    updateDay({ activities });
  }

  async function improveActivity(
    activity: EditorActivity
  ) {
    if (!onImprove) return;

    try {
      setImprovingId(activity.id);

      const result = await onImprove(
        activity
      );

      if (result) {
        updateActivity(activity.id, result);
      }
    } catch (error) {
      console.error(
        "Failed to improve activity:",
        error
      );
    } finally {
      setImprovingId(null);
    }
  }

  function save() {
    onSave?.(draft);
  }

  return (
    <div className="rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515] p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
              Editing day {draft.dayNumber}
            </p>

            <h2 className="mt-1 text-lg font-black">
              Day details
            </h2>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
              aria-label="Close editor"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* DAY DETAILS */}

      <div className="border-b border-[#292929] p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* TITLE */}

          <Field label="Day title">
            <input
              type="text"
              value={draft.title}
              onChange={(event) =>
                updateDay({
                  title:
                    event.target.value,
                })
              }
              placeholder="Arrival & exploration"
              className={inputClass}
            />
          </Field>

          {/* DATE */}

          <Field label="Date">
            <input
              type="text"
              value={draft.date}
              onChange={(event) =>
                updateDay({
                  date:
                    event.target.value,
                })
              }
              placeholder="12 September 2026"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      {/* ACTIVITIES */}

      <div>
        <div className="flex items-center justify-between border-b border-[#292929] px-5 py-4 md:px-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider">
              Activities
            </h3>

            <p className="mt-1 text-[10px] text-zinc-700">
              {draft.activities.length}{" "}
              {draft.activities.length === 1
                ? "activity"
                : "activities"}
            </p>
          </div>

          <button
            type="button"
            onClick={addActivity}
            className="flex items-center gap-2 rounded-lg bg-[#E8820C] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
          >
            <Plus size={13} />
            Add
          </button>
        </div>

        {draft.activities.length === 0 ? (
          <EmptyActivities
            onAdd={addActivity}
          />
        ) : (
          <div>
            {draft.activities.map(
              (activity, index) => (
                <ActivityEditor
                  key={activity.id}
                  activity={activity}
                  index={index}
                  total={
                    draft.activities.length
                  }
                  improving={
                    improvingId ===
                    activity.id
                  }
                  onChange={(updates) =>
                    updateActivity(
                      activity.id,
                      updates
                    )
                  }
                  onDelete={() =>
                    deleteActivity(
                      activity.id
                    )
                  }
                  onMoveUp={() =>
                    moveActivity(
                      activity.id,
                      "up"
                    )
                  }
                  onMoveDown={() =>
                    moveActivity(
                      activity.id,
                      "down"
                    )
                  }
                  onImprove={() =>
                    improveActivity(
                      activity
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="flex flex-col-reverse gap-3 border-t border-[#292929] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="text-[10px] font-bold text-zinc-700">
          Changes are applied to this day only.
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[#292929] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={save}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#E8820C] px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
          >
            <Save size={13} />
            Save day
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* ACTIVITY EDITOR                                    */
/* ================================================== */

function ActivityEditor({
  activity,
  index,
  total,
  improving,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onImprove,
}: {
  activity: EditorActivity;
  index: number;
  total: number;
  improving: boolean;
  onChange: (
    updates: Partial<EditorActivity>
  ) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onImprove: () => void;
}) {
  return (
    <div className="border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      {/* ACTIVITY TOP */}

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#292929] bg-[#181818] text-[10px] font-black text-[#E8820C]">
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
              Activity
            </p>

            <p className="mt-0.5 text-xs font-black">
              {activity.title ||
                "Untitled activity"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-950/30 hover:text-red-400"
          aria-label="Delete activity"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* TITLE */}

      <div className="mb-5">
        <Field label="Activity name">
          <input
            type="text"
            value={activity.title}
            onChange={(event) =>
              onChange({
                title:
                  event.target.value,
              })
            }
            placeholder="Visit Mysore Palace"
            className={inputClass}
          />
        </Field>
      </div>

      {/* TIME / DURATION */}

      <div className="mb-5 grid gap-5 md:grid-cols-2">
        <Field
          label="Time"
          icon={<Clock3 size={12} />}
        >
          <input
            type="time"
            value={activity.time}
            onChange={(event) =>
              onChange({
                time:
                  event.target.value,
              })
            }
            className={inputClass}
          />
        </Field>

        <Field label="Duration">
          <input
            type="text"
            value={activity.duration}
            onChange={(event) =>
              onChange({
                duration:
                  event.target.value,
              })
            }
            placeholder="2 hours"
            className={inputClass}
          />
        </Field>
      </div>

      {/* LOCATION */}

      <div className="mb-5">
        <Field
          label="Location"
          icon={<MapPin size={12} />}
        >
          <input
            type="text"
            value={activity.location}
            onChange={(event) =>
              onChange({
                location:
                  event.target.value,
              })
            }
            placeholder="Mysore Palace, Mysuru"
            className={inputClass}
          />
        </Field>
      </div>

      {/* DESCRIPTION */}

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
            Description
          </label>

          <button
            type="button"
            onClick={onImprove}
            disabled={improving}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-[#E8820C] transition hover:text-[#F29420] disabled:cursor-wait disabled:opacity-50"
          >
            <Sparkles
              size={12}
              className={
                improving
                  ? "animate-pulse"
                  : ""
              }
            />

            {improving
              ? "Improving..."
              : "Improve with AI"}
          </button>
        </div>

        <textarea
          value={activity.description}
          onChange={(event) =>
            onChange({
              description:
                event.target.value,
            })
          }
          rows={5}
          placeholder="Describe what the traveller will experience..."
          className={`${inputClass} resize-none leading-6`}
        />

        <p className="mt-2 text-[9px] text-zinc-700">
          Gemini can improve this description while
          keeping the activity details intact.
        </p>
      </div>

      {/* PRICE */}

      <PriceEditor
        price={activity.price}
        onChange={(price) =>
          onChange({ price })
        }
      />

      {/* REORDER */}

      <div className="mt-5 flex items-center justify-between border-t border-[#242424] pt-4">
        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-700">
          Activity order
        </span>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#292929] text-zinc-600 transition hover:border-[#444] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            title="Move activity up"
          >
            <ArrowUp size={13} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#292929] text-zinc-600 transition hover:border-[#444] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            title="Move activity down"
          >
            <ArrowDown size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* PRICE EDITOR                                       */
/* ================================================== */

function PriceEditor({
  price,
  onChange,
}: {
  price: number;
  onChange: (price: number) => void;
}) {
  function changePrice(amount: number) {
    const nextPrice = Math.max(
      0,
      Number(price || 0) + amount
    );

    onChange(nextPrice);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
          Price
        </label>

        <span className="text-[9px] font-bold text-zinc-700">
          Adjust manually
        </span>
      </div>

      <div className="flex overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#181818]">
        <div className="flex items-center border-r border-[#2A2A2A] px-4 text-sm font-black text-zinc-500">
          ₹
        </div>

        <input
          type="number"
          min={0}
          value={price}
          onChange={(event) =>
            onChange(
              Math.max(
                0,
                Number(event.target.value)
              )
            )
          }
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-black text-white outline-none"
        />

        <button
          type="button"
          onClick={() =>
            changePrice(-100)
          }
          className="border-l border-[#2A2A2A] px-4 text-xs font-black text-zinc-500 transition hover:bg-[#222] hover:text-white"
        >
          −₹100
        </button>

        <button
          type="button"
          onClick={() =>
            changePrice(100)
          }
          className="border-l border-[#2A2A2A] px-4 text-xs font-black text-zinc-500 transition hover:bg-[#222] hover:text-[#E8820C]"
        >
          +₹100
        </button>
      </div>
    </div>
  );
}

/* ================================================== */
/* EMPTY STATE                                        */
/* ================================================== */

function EmptyActivities({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <div className="px-5 py-12 text-center md:px-6">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-zinc-600">
        <Plus size={17} />
      </div>

      <h3 className="mt-4 text-xs font-black">
        No activities
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-zinc-700">
        Start building this day by adding an
        activity.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
      >
        Add activity
      </button>
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
  icon?: React.ReactNode;
  children: React.ReactNode;
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
/* HELPERS                                            */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]";

function createId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `activity-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}
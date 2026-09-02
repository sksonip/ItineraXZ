"use client";

import {
  ChevronDown,
  ChevronUp,
  Clock3,
  GripVertical,
  MapPin,
  MoreHorizontal,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

export type DayActivity = {
  id: string;
  time?: string;
  title: string;
  location?: string;
  description?: string;
  price?: number;
  duration?: string;
};

type DayCardProps = {
  dayNumber: number;
  date?: string;
  title?: string;
  activities: DayActivity[];
  collapsed?: boolean;
  onToggle?: () => void;
  onAddActivity?: () => void;
  onDeleteActivity?: (activityId: string) => void;
  onEditActivity?: (activity: DayActivity) => void;
  onImproveActivity?: (activity: DayActivity) => void;
  onMoveActivity?: (
    activityId: string,
    direction: "up" | "down"
  ) => void;
};

export default function DayCard({
  dayNumber,
  date,
  title,
  activities,
  collapsed = false,
  onToggle,
  onAddActivity,
  onDeleteActivity,
  onEditActivity,
  onImproveActivity,
  onMoveActivity,
}: DayCardProps) {
  const totalPrice = activities.reduce(
    (total, activity) =>
      total + Number(activity.price || 0),
    0
  );

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* DAY HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
          <button
            type="button"
            onClick={onToggle}
            className="flex min-w-0 items-center gap-4 text-left"
          >
            <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-[#E8820C] text-black">
              <span className="text-[8px] font-black uppercase tracking-wider">
                Day
              </span>

              <span className="text-lg font-black leading-none">
                {dayNumber}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-sm font-black md:text-base">
                  {title || `Day ${dayNumber}`}
                </h2>

                {date && (
                  <span className="text-[10px] font-bold text-zinc-600">
                    {date}
                  </span>
                )}
              </div>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                {activities.length}{" "}
                {activities.length === 1
                  ? "activity"
                  : "activities"}
              </p>
            </div>
          </button>

          <div className="flex shrink-0 items-center gap-2">
            {totalPrice > 0 && (
              <span className="hidden text-xs font-black text-zinc-400 sm:block">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            )}

            <button
              type="button"
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#202020] hover:text-white"
              aria-label={
                collapsed
                  ? "Expand day"
                  : "Collapse day"
              }
            >
              {collapsed ? (
                <ChevronDown size={17} />
              ) : (
                <ChevronUp size={17} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <div>
          {activities.length === 0 ? (
            <EmptyDay
              onAddActivity={onAddActivity}
            />
          ) : (
            <div>
              {activities.map(
                (activity, index) => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    index={index}
                    total={activities.length}
                    onEdit={() =>
                      onEditActivity?.(activity)
                    }
                    onDelete={() =>
                      onDeleteActivity?.(
                        activity.id
                      )
                    }
                    onImprove={() =>
                      onImproveActivity?.(
                        activity
                      )
                    }
                    onMoveUp={() =>
                      onMoveActivity?.(
                        activity.id,
                        "up"
                      )
                    }
                    onMoveDown={() =>
                      onMoveActivity?.(
                        activity.id,
                        "down"
                      )
                    }
                  />
                )
              )}
            </div>
          )}

          {/* ADD ACTIVITY */}

          <div className="border-t border-[#292929] p-4 md:px-5">
            <button
              type="button"
              onClick={onAddActivity}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#333] px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 transition hover:border-[#E8820C] hover:text-[#E8820C]"
            >
              <Plus size={14} />
              Add activity
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ================================================== */
/* ACTIVITY ROW                                      */
/* ================================================== */

function ActivityRow({
  activity,
  index,
  total,
  onEdit,
  onDelete,
  onImprove,
  onMoveUp,
  onMoveDown,
}: {
  activity: DayActivity;
  index: number;
  total: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onImprove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <article className="group border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      <div className="flex gap-3">
        {/* DRAG HANDLE */}

        <div className="hidden shrink-0 pt-1 text-zinc-800 transition group-hover:text-zinc-600 sm:block">
          <GripVertical size={16} />
        </div>

        {/* TIME */}

        <div className="w-16 shrink-0 pt-0.5">
          {activity.time ? (
            <div className="flex items-center gap-1.5 text-[10px] font-black text-[#E8820C]">
              <Clock3 size={12} />
              {activity.time}
            </div>
          ) : (
            <span className="text-[10px] font-bold text-zinc-700">
              TIME
            </span>
          )}

          {activity.duration && (
            <p className="mt-2 text-[9px] font-bold text-zinc-700">
              {activity.duration}
            </p>
          )}
        </div>

        {/* MAIN */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <button
              type="button"
              onClick={onEdit}
              className="text-left"
            >
              <h3 className="text-sm font-black leading-5 transition hover:text-[#E8820C]">
                {activity.title}
              </h3>
            </button>

            {/* MENU */}

            <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition hover:bg-[#202020] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                title="Move up"
              >
                <ChevronUp size={13} />
              </button>

              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === total - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition hover:bg-[#202020] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                title="Move down"
              >
                <ChevronDown size={13} />
              </button>

              <button
                type="button"
                onClick={onImprove}
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition hover:bg-[#202020] hover:text-[#E8820C]"
                title="Improve with AI"
              >
                <Sparkles size={13} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition hover:bg-red-950/30 hover:text-red-400"
                title="Delete activity"
              >
                <Trash2 size={13} />
              </button>

              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-700"
                title="More options"
              >
                <MoreHorizontal size={13} />
              </button>
            </div>
          </div>

          {/* LOCATION */}

          {activity.location && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
              <MapPin
                size={12}
                className="shrink-0"
              />

              <span className="truncate">
                {activity.location}
              </span>
            </div>
          )}

          {/* DESCRIPTION */}

          {activity.description && (
            <p className="mt-3 max-w-2xl text-xs leading-6 text-zinc-600">
              {activity.description}
            </p>
          )}

          {/* FOOTER */}

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onImprove}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-700 transition hover:text-[#E8820C]"
            >
              <Sparkles size={11} />
              Improve with AI
            </button>

            {activity.price !== undefined && (
              <span className="text-xs font-black text-zinc-400">
                ₹
                {Number(
                  activity.price
                ).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ================================================== */
/* EMPTY DAY                                         */
/* ================================================== */

function EmptyDay({
  onAddActivity,
}: {
  onAddActivity?: () => void;
}) {
  return (
    <div className="px-5 py-12 text-center md:px-6">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-zinc-600">
        <CalendarIcon />
      </div>

      <h3 className="mt-4 text-xs font-black">
        No activities yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-zinc-700">
        Add your first activity to start building
        this day.
      </p>

      <button
        type="button"
        onClick={onAddActivity}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
      >
        <Plus size={13} />
        Add activity
      </button>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        width="18"
        height="18"
        x="3"
        y="4"
        rx="2"
      />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
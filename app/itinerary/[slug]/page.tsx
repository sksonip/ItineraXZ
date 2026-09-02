"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  IndianRupee,
  MapPin,
  Users,
  Sparkles,
  Loader2,
  Pencil,
  Download,
} from "lucide-react";

type Activity = {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  location?: string;
  duration?: string;
  time?: string;
  price?: number;
};

type Day = {
  id?: string;
  dayNumber?: number;
  day?: number;
  title?: string;
  description?: string;
  activities?: Activity[];
  items?: Activity[];
};

type Highlight = {
  title?: string;
  text?: string;
  description?: string;
};

type Itinerary = {
  id?: string;
  slug?: string;
  title?: string;
  tripName?: string;
  destination?: string;
  description?: string;
  durationDays?: number;
  travellers?: number;
  budget?: number;
  totalPrice?: number;
  price?: number;
  style?: string;
  startPoint?: string;
  endPoint?: string;
  highlights?: Highlight[];
  days?: Day[];
  createdAt?: string;
};

export default function ItineraryPage() {
  const params = useParams();
  const router = useRouter();

  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug;

  const [itinerary, setItinerary] =
    useState<Itinerary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const itinerarySlug = slug;

    async function loadItinerary() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/itineraries/${encodeURIComponent(itinerarySlug)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Unable to load itinerary."
          );
        }

        const result =
          data?.itinerary || data?.data || data;

        setItinerary(result);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load itinerary."
        );
      } finally {
        setLoading(false);
      }
    }

    loadItinerary();
  }, [slug]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !itinerary) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-5 text-white">
        <div className="w-full max-w-md rounded-xl border border-[#272727] bg-[#111111] p-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-950/40 text-red-400">
            !
          </div>

          <h1 className="text-xl font-black">
            Itinerary not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error ||
              "This itinerary does not exist or is no longer available."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/itineraries")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-5 py-3 text-xs font-black uppercase tracking-wider text-black"
          >
            <ArrowLeft size={15} />
            Back to itineraries
          </button>
        </div>
      </main>
    );
  }

  const title =
    itinerary.title ||
    itinerary.tripName ||
    "Untitled itinerary";

  const destination =
    itinerary.destination || "Destination";

  const days = itinerary.days || [];

  const duration =
    itinerary.durationDays ||
    days.length ||
    0;

  const travellers =
    itinerary.travellers || 1;

  const price =
    itinerary.totalPrice ??
    itinerary.price ??
    itinerary.budget ??
    0;

  const highlights = itinerary.highlights || [];

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-[#242424] bg-[#090909]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="hidden text-center sm:block">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
              Itinerary
            </p>

            <p className="max-w-[220px] truncate text-xs font-black">
              {title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {itinerary.id && (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/itineraries/${itinerary.id}`
                  )
                }
                className="hidden items-center gap-2 rounded-lg border border-[#292929] px-3 py-2 text-xs font-bold text-zinc-400 transition hover:border-[#444] hover:text-white sm:flex"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                window.print()
              }
              className="flex items-center gap-2 rounded-lg border border-[#292929] px-3 py-2 text-xs font-bold text-zinc-400 transition hover:border-[#444] hover:text-white"
            >
              <Download size={14} />
              <span className="hidden sm:inline">
                Print
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="border-b border-[#242424]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#E8820C]/30 bg-[#E8820C]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#E8820C]">
                {itinerary.style || "Custom trip"}
              </span>

              {duration > 0 && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  <CalendarDays size={13} />
                  {duration} days
                </span>
              )}
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              {title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <MapPin
                  size={16}
                  className="text-[#E8820C]"
                />
                {destination}
              </span>

              <span className="flex items-center gap-2">
                <Users size={16} />
                {travellers}{" "}
                {travellers === 1
                  ? "traveller"
                  : "travellers"}
              </span>

              {itinerary.startPoint && (
                <span className="text-xs text-zinc-700">
                  {itinerary.startPoint}
                  {itinerary.endPoint
                    ? ` → ${itinerary.endPoint}`
                    : ""}
                </span>
              )}
            </div>

            {itinerary.description && (
              <p className="mt-8 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
                {itinerary.description}
              </p>
            )}
          </div>

          {/* QUICK STATS */}

          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#292929] bg-[#292929] md:grid-cols-4">
            <Stat
              label="Duration"
              value={`${duration} days`}
              icon={<CalendarDays size={15} />}
            />

            <Stat
              label="Travellers"
              value={`${travellers}`}
              icon={<Users size={15} />}
            />

            <Stat
              label="Starting"
              value={itinerary.startPoint || "Flexible"}
              icon={<MapPin size={15} />}
            />

            <Stat
              label="Budget"
              value={
                price > 0
                  ? formatCurrency(price)
                  : "Flexible"
              }
              icon={<IndianRupee size={15} />}
            />
          </div>
        </div>
      </section>

      {/* BODY */}

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_300px]">
        <div>
          {/* HIGHLIGHTS */}

          {highlights.length > 0 && (
            <section className="mb-14">
              <SectionHeading
                number="01"
                title="Trip highlights"
              />

              <div className="grid gap-3 md:grid-cols-2">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[#252525] bg-[#111111] p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles
                        size={15}
                        className="text-[#E8820C]"
                      />

                      <h3 className="text-sm font-black">
                        {highlight.title ||
                          `Highlight ${index + 1}`}
                      </h3>
                    </div>

                    <p className="text-xs leading-6 text-zinc-500">
                      {highlight.text ||
                        highlight.description ||
                        ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DAYS */}

          <section>
            <SectionHeading
              number="02"
              title="Day by day"
            />

            {days.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#292929] p-8 text-center">
                <p className="text-sm font-bold text-zinc-500">
                  No day plans have been added yet.
                </p>

                {itinerary.id && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/itineraries/${itinerary.id}`
                      )
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-xs font-black text-black"
                  >
                    Build itinerary
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {days.map((day, index) => (
                  <DayCard
                    key={day.id || index}
                    day={day}
                    fallbackDayNumber={index + 1}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* SIDEBAR */}

        <aside>
          <div className="space-y-5 lg:sticky lg:top-24">
            {/* PRICE */}

            <div className="rounded-xl border border-[#292929] bg-[#111111] p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
                Estimated trip price
              </p>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black">
                  {price > 0
                    ? formatCurrency(price)
                    : "Custom"}
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-zinc-600">
                Pricing can be adjusted in the itinerary
                builder.
              </p>

              {itinerary.id && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/itineraries/${itinerary.id}`
                    )
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8820C] px-4 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
                >
                  Customize
                  <ArrowRight size={15} />
                </button>
              )}
            </div>

            {/* ROUTE */}

            {(itinerary.startPoint ||
              itinerary.endPoint) && (
              <div className="rounded-xl border border-[#292929] bg-[#111111] p-6">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
                  Route
                </p>

                <div className="mt-5 space-y-5">
                  {itinerary.startPoint && (
                    <RoutePoint
                      label="Start"
                      value={itinerary.startPoint}
                    />
                  )}

                  {itinerary.endPoint && (
                    <RoutePoint
                      label="Finish"
                      value={itinerary.endPoint}
                    />
                  )}
                </div>
              </div>
            )}

            {/* AI */}

            <div className="rounded-xl border border-[#E8820C]/20 bg-[#E8820C]/5 p-6">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-[#E8820C]"
                />

                <p className="text-xs font-black">
                  AI-assisted itinerary
                </p>
              </div>

              <p className="mt-3 text-xs leading-6 text-zinc-500">
                Descriptions, activities, highlights and
                pricing can all be refined while building
                the trip.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}

      <footer className="border-t border-[#242424]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[10px] text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Itinerary Builder
          </span>

          <span>
            No account required
          </span>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------------------------- */
/* DAY CARD                                           */
/* -------------------------------------------------- */

function DayCard({
  day,
  fallbackDayNumber,
}: {
  day: Day;
  fallbackDayNumber: number;
}) {
  const dayNumber =
    day.dayNumber ||
    day.day ||
    fallbackDayNumber;

  const activities =
    day.activities ||
    day.items ||
    [];

  return (
    <article className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* DAY HEADER */}

      <div className="border-b border-[#242424] p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8820C] text-sm font-black text-black">
            {String(dayNumber).padStart(2, "0")}
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
              Day {dayNumber}
            </p>

            <h3 className="mt-1 text-lg font-black">
              {day.title ||
                `Day ${dayNumber}`}
            </h3>

            {day.description && (
              <p className="mt-2 text-xs leading-6 text-zinc-500">
                {day.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVITIES */}

      {activities.length > 0 && (
        <div className="divide-y divide-[#222222]">
          {activities.map((activity, index) => (
            <ActivityRow
              key={activity.id || index}
              activity={activity}
              index={index}
            />
          ))}
        </div>
      )}

      {activities.length === 0 && (
        <div className="p-6 text-xs text-zinc-700">
          No activities added for this day.
        </div>
      )}
    </article>
  );
}

/* -------------------------------------------------- */
/* ACTIVITY                                           */
/* -------------------------------------------------- */

function ActivityRow({
  activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {
  const title =
    activity.title ||
    activity.name ||
    `Activity ${index + 1}`;

  return (
    <div className="p-5 md:p-6">
      <div className="flex gap-4">
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#303030] text-[10px] font-black text-zinc-500">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <h4 className="text-sm font-black">
              {title}
            </h4>

            <div className="flex shrink-0 flex-wrap gap-3 text-[10px] text-zinc-600">
              {activity.time && (
                <span className="flex items-center gap-1">
                  <Clock3 size={12} />
                  {activity.time}
                </span>
              )}

              {activity.duration && (
                <span>
                  {activity.duration}
                </span>
              )}
            </div>
          </div>

          {activity.description && (
            <p className="mt-2 max-w-2xl text-xs leading-6 text-zinc-500">
              {activity.description}
            </p>
          )}

          {activity.location && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-600">
              <MapPin size={12} />
              {activity.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* SMALL COMPONENTS                                   */
/* -------------------------------------------------- */

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#111111] p-4">
      <div className="flex items-center gap-2 text-zinc-600">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-xs font-black text-zinc-300">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#E8820C]">
        {number}
      </p>

      <h2 className="mt-1 text-2xl font-black tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function RoutePoint({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#333]">
        <MapPin
          size={11}
          className="text-[#E8820C]"
        />
      </div>

      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
          {label}
        </p>

        <p className="mt-1 text-xs font-bold text-zinc-400">
          {value}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
      <div className="text-center">
        <Loader2
          size={24}
          className="mx-auto animate-spin text-[#E8820C]"
        />

        <p className="mt-4 text-xs font-bold text-zinc-600">
          Loading itinerary...
        </p>
      </div>
    </main>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Moon,
  ShieldCheck,
  Users,
} from "lucide-react";

export type DocumentActivity = {
  id: string;
  title: string;
  description?: string;
  time?: string;
};

export type DocumentDay = {
  id: string;
  day: number;
  title: string;
  description?: string;
  location?: string;
  date?: string;
  duration?: string;
  nights?: number;
  activities: DocumentActivity[];
};

export type ItineraryDocumentData = {
  title: string;
  destination?: string;
  subtitle?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  days: DocumentDay[];

  inclusions?: string[];
  exclusions?: string[];
  highlights?: string[];
  advantages?: string[];
  safety?: string[];
};

type ItineraryDocumentProps = {
  itinerary: ItineraryDocumentData;
  className?: string;
};

export default function ItineraryDocument({
  itinerary,
  className = "",
}: ItineraryDocumentProps) {
  return (
    <main
      className={`mx-auto w-full max-w-[900px] bg-white text-[#171717] ${className}`}
    >
      {/* ========================================= */}
      {/* COVER                                    */}
      {/* ========================================= */}

      <section className="relative min-h-[420px] overflow-hidden border-b border-[#E5E5E5] bg-[#111111] px-8 py-12 text-white md:px-14 md:py-16">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#E8820C]/20" />

        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/5" />

        <div className="relative z-10">
          <p className="mb-5 text-[9px] font-black uppercase tracking-[0.35em] text-[#E8820C]">
            Custom Travel Itinerary
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            {itinerary.title ||
              "Your Journey"}
          </h1>

          {itinerary.destination && (
            <div className="mt-5 flex items-center gap-2 text-sm font-bold text-zinc-400">
              <MapPin
                size={15}
                className="text-[#E8820C]"
              />

              {itinerary.destination}
            </div>
          )}

          {itinerary.subtitle && (
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
              {itinerary.subtitle}
            </p>
          )}

          {/* TRIP META */}

          <div className="mt-10 flex flex-wrap gap-3">
            {itinerary.startDate && (
              <DocumentBadge
                icon={CalendarDays}
                value={
                  itinerary.endDate
                    ? `${itinerary.startDate} – ${itinerary.endDate}`
                    : itinerary.startDate
                }
              />
            )}

            {itinerary.travelers && (
              <DocumentBadge
                icon={Users}
                value={`${itinerary.travelers} ${
                  itinerary.travelers === 1
                    ? "traveler"
                    : "travelers"
                }`}
              />
            )}

            {itinerary.days.length > 0 && (
              <DocumentBadge
                icon={Clock3}
                value={`${itinerary.days.length} ${
                  itinerary.days.length === 1
                    ? "day"
                    : "days"
                }`}
              />
            )}
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* INTRO                                    */}
      {/* ========================================= */}

      {itinerary.description && (
        <section className="border-b border-[#E5E5E5] px-8 py-10 md:px-14">
          <DocumentHeading
            eyebrow="01"
            title="Overview"
          />

          <p className="max-w-3xl text-sm leading-7 text-[#666666]">
            {itinerary.description}
          </p>
        </section>
      )}

      {/* ========================================= */}
      {/* HIGHLIGHTS                               */}
      {/* ========================================= */}

      {itinerary.highlights &&
        itinerary.highlights.length > 0 && (
          <section className="border-b border-[#E5E5E5] px-8 py-10 md:px-14">
            <DocumentHeading
              eyebrow="02"
              title="Trip Highlights"
            />

            <div className="grid gap-3 md:grid-cols-2">
              {itinerary.highlights.map(
                (highlight, index) => (
                  <Bullet
                    key={`${highlight}-${index}`}
                    text={highlight}
                  />
                )
              )}
            </div>
          </section>
        )}

      {/* ========================================= */}
      {/* DAY BY DAY                               */}
      {/* ========================================= */}

      <section className="px-8 py-10 md:px-14">
        <DocumentHeading
          eyebrow="03"
          title="Your Journey"
        />

        <div className="space-y-10">
          {itinerary.days.map((day) => (
            <DocumentDaySection
              key={day.id}
              day={day}
            />
          ))}
        </div>
      </section>

      {/* ========================================= */}
      {/* INCLUSIONS                               */}
      {/* ========================================= */}

      {itinerary.inclusions &&
        itinerary.inclusions.length > 0 && (
          <DocumentListSection
            number="04"
            title="What's Included"
            items={itinerary.inclusions}
            icon={Check}
          />
        )}

      {/* ========================================= */}
      {/* EXCLUSIONS                               */}
      {/* ========================================= */}

      {itinerary.exclusions &&
        itinerary.exclusions.length > 0 && (
          <DocumentListSection
            number="05"
            title="What's Not Included"
            items={itinerary.exclusions}
          />
        )}

      {/* ========================================= */}
      {/* ADVANTAGES                               */}
      {/* ========================================= */}

      {itinerary.advantages &&
        itinerary.advantages.length > 0 && (
          <DocumentListSection
            number="06"
            title="Why This Itinerary"
            items={itinerary.advantages}
          />
        )}

      {/* ========================================= */}
      {/* SAFETY                                   */}
      {/* ========================================= */}

      {itinerary.safety &&
        itinerary.safety.length > 0 && (
          <section className="border-t border-[#E5E5E5] px-8 py-10 md:px-14">
            <DocumentHeading
              eyebrow="07"
              title="Safety & Important Notes"
              icon={ShieldCheck}
            />

            <div className="space-y-3">
              {itinerary.safety.map(
                (item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex gap-3 rounded-lg bg-[#F7F7F7] p-4"
                  >
                    <ShieldCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-[#E8820C]"
                    />

                    <p className="text-xs leading-5 text-[#666666]">
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

      {/* ========================================= */}
      {/* FOOTER                                   */}
      {/* ========================================= */}

      <footer className="border-t border-[#E5E5E5] bg-[#111111] px-8 py-8 text-white md:px-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black">
              {itinerary.title ||
                "Your Journey"}
            </p>

            {itinerary.destination && (
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                {itinerary.destination}
              </p>
            )}
          </div>

          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-zinc-700">
            Prepared for your journey
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ================================================= */
/* DAY SECTION                                      */
/* ================================================= */

function DocumentDaySection({
  day,
}: {
  day: DocumentDay;
}) {
  return (
    <article className="relative">
      {/* DAY HEADER */}

      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#111111]">
          <span className="text-[10px] font-black text-[#E8820C]">
            {String(day.day).padStart(
              2,
              "0"
            )}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#999999]">
            Day {day.day}
          </p>

          <h3 className="mt-1 text-xl font-black tracking-tight text-[#171717]">
            {day.title ||
              `Day ${day.day}`}
          </h3>

          {/* META */}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {day.date && (
              <SmallMeta
                icon={CalendarDays}
                value={day.date}
              />
            )}

            {day.location && (
              <SmallMeta
                icon={MapPin}
                value={day.location}
              />
            )}

            {day.duration && (
              <SmallMeta
                icon={Clock3}
                value={day.duration}
              />
            )}

            {typeof day.nights ===
              "number" &&
              day.nights > 0 && (
                <SmallMeta
                  icon={Moon}
                  value={`${day.nights} ${
                    day.nights === 1
                      ? "night"
                      : "nights"
                  }`}
                />
              )}
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}

      {day.description && (
        <p className="mb-5 ml-[60px] max-w-2xl text-xs leading-6 text-[#666666]">
          {day.description}
        </p>
      )}

      {/* ACTIVITIES */}

      {day.activities.length > 0 && (
        <div className="ml-[60px] space-y-3">
          {day.activities.map(
            (activity, index) => (
              <div
                key={activity.id}
                className="relative rounded-lg border border-[#E8E8E8] bg-[#FAFAFA] p-4"
              >
                <div className="flex gap-3">
                  <span className="mt-0.5 text-[8px] font-black text-[#BBBBBB]">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <h4 className="text-xs font-black text-[#222222]">
                        {activity.title ||
                          "Activity"}
                      </h4>

                      {activity.time && (
                        <span className="text-[8px] font-black uppercase tracking-wider text-[#E8820C]">
                          {activity.time}
                        </span>
                      )}
                    </div>

                    {activity.description && (
                      <p className="mt-2 text-[10px] leading-5 text-[#777777]">
                        {
                          activity.description
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </article>
  );
}

/* ================================================= */
/* DOCUMENT LIST                                   */
/* ================================================= */

function DocumentListSection({
  number,
  title,
  items,
  icon: Icon,
}: {
  number: string;
  title: string;
  items: string[];
  icon?: React.ElementType;
}) {
  return (
    <section className="border-t border-[#E5E5E5] px-8 py-10 md:px-14">
      <DocumentHeading
        eyebrow={number}
        title={title}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <Bullet
            key={`${item}-${index}`}
            text={item}
            icon={Icon}
          />
        ))}
      </div>
    </section>
  );
}

/* ================================================= */
/* BULLET                                           */
/* ================================================= */

function Bullet({
  text,
  icon: Icon,
}: {
  text: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-[#E8E8E8] p-4">
      {Icon ? (
        <Icon
          size={14}
          className="mt-0.5 shrink-0 text-[#E8820C]"
        />
      ) : (
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8820C]" />
      )}

      <p className="text-[10px] leading-5 text-[#666666]">
        {text}
      </p>
    </div>
  );
}

/* ================================================= */
/* HEADING                                          */
/* ================================================= */

function DocumentHeading({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[8px] font-black tracking-[0.2em] text-[#E8820C]">
          {eyebrow}
        </span>

        <span className="h-px w-8 bg-[#E8820C]" />

        {Icon && (
          <Icon
            size={12}
            className="text-[#E8820C]"
          />
        )}
      </div>

      <h2 className="text-2xl font-black tracking-tight text-[#171717]">
        {title}
      </h2>
    </div>
  );
}

/* ================================================= */
/* META                                             */
/* ================================================= */

function DocumentBadge({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <Icon
        size={12}
        className="text-[#E8820C]"
      />

      <span className="text-[9px] font-bold text-zinc-400">
        {value}
      </span>
    </div>
  );
}

function SmallMeta({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon
        size={10}
        className="text-[#E8820C]"
      />

      <span className="text-[8px] font-bold text-[#888888]">
        {value}
      </span>
    </div>
  );
}
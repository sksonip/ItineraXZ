"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Download,
  Edit3,
  MapPin,
  Moon,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

import ItineraryDocument, {
  type ItineraryDocumentData,
} from "./document/itinerary-document";

export type ItineraryPageData =
  ItineraryDocumentData & {
    id?: string;
    slug?: string;
    price?: number;
    currency?: string;
  };

type ItineraryPageProps = {
  itinerary: ItineraryPageData;

  editable?: boolean;

  onBack?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
};

export default function ItineraryPage({
  itinerary,
  editable = false,
  onBack,
  onEdit,
  onShare,
  onDownload,
}: ItineraryPageProps) {
  const days = itinerary.days ?? [];

  const totalDays = days.length;

  const totalNights = days.reduce(
    (total, day) =>
      total + (day.nights ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#090909]">
      {/* ====================================== */}
      {/* HEADER                                 */}
      {/* ====================================== */}

      <header className="sticky top-0 z-50 border-b border-[#252525] bg-[#090909]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-6">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#292929] text-zinc-500 transition hover:border-[#444] hover:text-white"
              >
                <ArrowLeft size={15} />
              </button>
            )}

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E8820C]">
                Itinerary
              </p>

              <h1 className="max-w-[220px] truncate text-xs font-black text-white md:max-w-[400px] md:text-sm">
                {itinerary.title ||
                  "Untitled Itinerary"}
              </h1>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="hidden h-9 items-center gap-2 rounded-lg border border-[#292929] px-3 text-[8px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white sm:flex"
              >
                <Share2 size={13} />
                Share
              </button>
            )}

            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="hidden h-9 items-center gap-2 rounded-lg border border-[#292929] px-3 text-[8px] font-black uppercase tracking-wider text-zinc-500 transition hover:border-[#444] hover:text-white sm:flex"
              >
                <Download size={13} />
                PDF
              </button>
            )}

            {editable && onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex h-9 items-center gap-2 rounded-lg bg-[#E8820C] px-3 text-[8px] font-black uppercase tracking-wider text-black transition hover:bg-[#F3921C]"
              >
                <Edit3 size={13} />
                Edit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ====================================== */}
      {/* HERO                                   */}
      {/* ====================================== */}

      <section className="border-b border-[#252525] bg-[#0D0D0D]">
        <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            {/* TITLE */}

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-[#E8820C]"
                />

                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  Custom Journey
                </span>
              </div>

              <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
                {itinerary.title ||
                  "Your Journey"}
              </h2>

              {itinerary.destination && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-500">
                  <MapPin
                    size={13}
                    className="text-[#E8820C]"
                  />

                  <span>
                    {itinerary.destination}
                  </span>
                </div>
              )}

              {itinerary.subtitle && (
                <p className="mt-3 max-w-2xl text-xs leading-6 text-zinc-600">
                  {itinerary.subtitle}
                </p>
              )}
            </div>

            {/* PRICE */}

            {typeof itinerary.price ===
              "number" && (
              <div className="rounded-xl border border-[#292929] bg-[#151515] px-5 py-4 lg:min-w-[220px]">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-700">
                  Estimated Price
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {itinerary.currency ??
                    "₹"}
                  {formatPrice(
                    itinerary.price
                  )}
                </p>

                {itinerary.travelers && (
                  <p className="mt-1 text-[8px] font-bold text-zinc-700">
                    For{" "}
                    {itinerary.travelers}{" "}
                    {itinerary.travelers ===
                    1
                      ? "traveler"
                      : "travelers"}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* STATS                             */}
          {/* ================================= */}

          <div className="mt-7 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Stat
              icon={CalendarDays}
              label="Duration"
              value={`${totalDays} ${
                totalDays === 1
                  ? "day"
                  : "days"
              }`}
            />

            <Stat
              icon={Moon}
              label="Nights"
              value={`${totalNights} ${
                totalNights === 1
                  ? "night"
                  : "nights"
              }`}
            />

            <Stat
              icon={Users}
              label="Travelers"
              value={
                itinerary.travelers
                  ? String(
                      itinerary.travelers
                    )
                  : "—"
              }
            />

            <Stat
              icon={Clock3}
              label="Schedule"
              value="Flexible"
            />
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* DOCUMENT                               */}
      {/* ====================================== */}

      <main className="bg-[#EAEAEA] px-3 py-5 md:px-6 md:py-8">
        <ItineraryDocument
          itinerary={itinerary}
        />
      </main>
    </div>
  );
}

/* ========================================== */
/* STAT                                       */
/* ========================================== */

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#292929] bg-[#151515] px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8820C]/10">
        <Icon
          size={13}
          className="text-[#E8820C]"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[7px] font-black uppercase tracking-[0.16em] text-zinc-700">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[10px] font-black text-zinc-300">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================== */
/* PRICE                                      */
/* ========================================== */

function formatPrice(
  price: number
): string {
  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  ).format(price);
}
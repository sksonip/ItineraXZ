"use client";

import {
  ArrowLeft,
  Download,
  Edit3,
  Loader2,
  MapPin,
  Mountain,
  Route,
  Thermometer,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Highlight = { title?: string; text?: string };
type Pillar = { title?: string; text?: string };
type Day = {
  dayLabel?: string;
  title?: string;
  distance?: string;
  altitude?: string;
  overnight?: string;
  description?: string;
};
type Phase = {
  phaseTitle?: string;
  dayRangeLabel?: string;
  days?: Day[];
};
type Advantage = { title?: string; bullets?: string[] };
type PricingItem = { label?: string; amount?: number };
type PaymentSchedule = {
  label?: string;
  note?: string;
  amount?: number;
};

type Itinerary = {
  id?: string;
  tripName?: string;
  title?: string;
  tagline?: string;
  heroImage?: string;
  durationDays?: number;
  maxAltitude?: string;
  tempRange?: string;
  startPoint?: string;
  endPoint?: string;
  totalDistanceKm?: number;
  description?: string;
  highlights?: Highlight[];
  stayPreference?: { title?: string; text?: string };
  foodPreference?: { title?: string; text?: string };
  travelCadence?: string[];
  quote?: { text?: string; attribution?: string };
  philosophyIntro?: string;
  pillars?: Pillar[];
  itinerary?: Phase[];
  phases?: Phase[];
  pricing?: {
    currency?: string;
    lineItems?: PricingItem[];
    totalPerPerson?: number;
    paymentSchedule?: PaymentSchedule[];
    disclaimer?: string;
  };
  inclusions?: string[];
  exclusions?: string[];
  advantages?: Advantage[];
  accommodationComfort?: {
    bullets?: string[];
    closingStatement?: string;
  };
  safetyTeam?: {
    bullets?: string[];
    closingStatement?: string;
  };
};

const PAPER = "#101010";

const PRINT_STYLES = `
  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    html,
    body {
      background: ${PAPER} !important;
      color: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .pdf-toolbar,
    .screen-only {
      display: none !important;
    }

    #pdf-content {
      width: 210mm !important;
      max-width: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .pdf-page {
      width: 210mm !important;
      height: 297mm !important;
      min-height: 297mm !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 14mm !important;
      overflow: hidden !important;
      box-shadow: none !important;
      break-after: page;
      page-break-after: always;
    }

    .pdf-page:last-child {
      break-after: auto;
      page-break-after: auto;
    }

    .avoid-break,
    article,
    .pdf-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    a {
      color: inherit !important;
      text-decoration: none !important;
    }
  }
`;

function money(amount: number | undefined, currency = "INR") {
  if (amount === undefined || Number.isNaN(amount)) return "-";
  return `${currency} ${amount.toLocaleString("en-IN")}`;
}

function tripNameOf(itinerary: Itinerary) {
  return itinerary.tripName || itinerary.title || "Untitled Expedition";
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toDay(day: any, index: number): Day {
  return {
    dayLabel: text(day?.dayLabel) || `Day ${day?.day || index + 1}`,
    title: text(day?.title),
    description: text(day?.description),
    distance: text(day?.distance),
    altitude: text(day?.altitude),
    overnight: text(day?.overnight) || text(day?.location),
  };
}

function normalizePreviewItinerary(
  source: Record<string, any>,
  id: string,
): Itinerary {
  const sourceDays = Array.isArray(source.days) ? source.days : [];
  const sourcePhases = Array.isArray(source.phases) ? source.phases : [];

  const phases: Phase[] = sourcePhases.map((phase: any) => ({
    phaseTitle: text(phase?.phaseTitle) || text(phase?.title),
    dayRangeLabel: text(phase?.dayRangeLabel),
    days: Array.isArray(phase?.days)
      ? phase.days
          .map((item: any) =>
            typeof item === "number" ? sourceDays[item - 1] : item,
          )
          .filter(Boolean)
          .map((day: any, index: number) => toDay(day, index))
      : [],
  }));

  const rawHighlights = source.highlightCards || source.highlights || [];
  const highlights: Highlight[] = Array.isArray(rawHighlights)
    ? rawHighlights.map((item: any) =>
        typeof item === "string"
          ? { title: item }
          : { title: text(item?.title), text: text(item?.text) },
      )
    : [];

  const rawPricingItems =
    source.pricing?.lineItems || source.pricing?.items || [];
  const lineItems: PricingItem[] = Array.isArray(rawPricingItems)
    ? rawPricingItems.map((item: any) => ({
        label: text(item?.label) || text(item?.name),
        amount: Number(item?.amount ?? item?.unitPrice ?? 0),
      }))
    : [];

  const suppliedTotal = Number(source.pricing?.totalPerPerson);
  const totalPerPerson = Number.isFinite(suppliedTotal)
    ? suppliedTotal
    : lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  return {
    ...source,
    id,
    tripName: text(source.tripName) || text(source.title),
    title: text(source.title) || text(source.tripName),
    tagline: text(source.tagline),
    heroImage: text(source.heroImage),
    durationDays: Number(
      source.durationDays || source.duration || sourceDays.length || 1,
    ),
    maxAltitude: text(source.maxAltitude),
    tempRange: text(source.tempRange),
    startPoint: text(source.startPoint),
    endPoint: text(source.endPoint),
    totalDistanceKm: Number(source.totalDistanceKm) || undefined,
    description: text(source.description) || text(source.overview),
    highlights,
    philosophyIntro:
      text(source.philosophyIntro) || text(source.philosophy),
    pillars: Array.isArray(source.pillars) ? source.pillars : [],
    phases,
    pricing: {
      currency: text(source.pricing?.currency) || "INR",
      lineItems,
      totalPerPerson,
      paymentSchedule: Array.isArray(source.pricing?.paymentSchedule)
        ? source.pricing.paymentSchedule
        : [],
      disclaimer: text(source.pricing?.disclaimer),
    },
    inclusions: Array.isArray(source.inclusions) ? source.inclusions : [],
    exclusions: Array.isArray(source.exclusions) ? source.exclusions : [],
    advantages: Array.isArray(source.advantageCards)
      ? source.advantageCards
      : Array.isArray(source.advantages)
        ? source.advantages.map((item: any) =>
            typeof item === "string"
              ? { title: item, bullets: [] }
              : item,
          )
        : [],
  };
}

function SectionTitle({
  number,
  children,
}: {
  number?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-7">
      {number && (
        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-[#E8820C]">
          {number}
        </div>
      )}
      <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
        {children}
      </h2>
      <div className="mt-3 h-[2px] w-12 bg-[#E8820C]" />
    </div>
  );
}

function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`pdf-page relative mx-auto mb-6 min-h-0 w-full max-w-[794px] overflow-hidden bg-[#101010] px-5 py-8 shadow-2xl md:mb-8 md:min-h-[1123px] md:px-[52px] md:py-[54px] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <div className="absolute -left-20 top-32 h-96 w-96 rounded-full border border-white" />
        <div className="absolute -left-32 top-48 h-[500px] w-[500px] rounded-full border border-white" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full border border-white" />
      </div>

      <div className="relative z-10 h-full">{children}</div>

      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-[#2A2A2A] pt-3 text-[8px] uppercase tracking-[0.2em] text-[#666] md:left-[52px] md:right-[52px]">
        <span>INDIA. SLOWER. BETTER</span>
        <span>#slowtravelling</span>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border border-[#2A2A2A] bg-[#181818] p-4">
      <div className="text-[#E8820C]">{icon}</div>
      <div className="min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#777]">
          {label}
        </div>
        <div className="mt-1 break-words text-sm font-bold text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

function ListBlock({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div className="avoid-break">
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-white">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-sm leading-6 text-[#CCCCCC]">
            <span className={positive ? "text-[#E8820C]" : "text-[#CC3333]"}>
              {positive ? "✓" : "×"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoSection({ title, text: value }: { title: string; text?: string }) {
  if (!value) return null;
  return (
    <div className="pdf-card border border-[#2A2A2A] bg-[#181818] p-5">
      <h3 className="text-sm font-black uppercase text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#B7B7B7]">{value}</p>
    </div>
  );
}

function BulletSection({
  title,
  bullets,
  closingStatement,
}: {
  title: string;
  bullets?: string[];
  closingStatement?: string;
}) {
  return (
    <div className="pdf-card border border-[#2A2A2A] bg-[#181818] p-5">
      <h3 className="text-sm font-black uppercase text-white">{title}</h3>
      {!!bullets?.length && (
        <ul className="mt-4 space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex gap-3 text-sm leading-6 text-[#B7B7B7]">
              <span className="text-[#E8820C]">✓</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {closingStatement && (
        <p className="mt-4 border-t border-[#2A2A2A] pt-4 text-xs leading-5 text-[#888]">
          {closingStatement}
        </p>
      )}
    </div>
  );
}

export default function ItineraryPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPdf, setSavingPdf] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const itineraryId = Array.isArray(id) ? id[0] : id;
    if (!itineraryId) return;
    let cancelled = false;

    async function loadItinerary() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/itineraries/${itineraryId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load itinerary.");
        }
        if (!cancelled) {
          setItinerary(
            normalizePreviewItinerary(data.itinerary || {}, itineraryId),
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load itinerary.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadItinerary();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const phases = useMemo(
    () => itinerary?.itinerary || itinerary?.phases || [],
    [itinerary],
  );

  const pricingTotal = useMemo(() => {
    if (!itinerary?.pricing) return 0;
    if (typeof itinerary.pricing.totalPerPerson === "number") {
      return itinerary.pricing.totalPerPerson;
    }
    return (
      itinerary.pricing.lineItems?.reduce(
        (sum, item) => sum + (item.amount || 0),
        0,
      ) || 0
    );
  }, [itinerary]);

  async function downloadPdf() {
    if (!itinerary || typeof window === "undefined") return;

    setSavingPdf(true);
    const oldTitle = document.title;
    const filename =
      tripNameOf(itinerary)
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "itinerary";

    try {
      // Wait for images and fonts so the print preview has the same composition
      // as the responsive preview. This is intentionally not html2canvas:
      // browser printing never parses unsupported oklab colors.
      await Promise.all(
        Array.from(document.querySelectorAll<HTMLImageElement>("#pdf-content img"))
          .filter((image) => !image.complete)
          .map(
            (image) =>
              new Promise<void>((resolve) => {
                image.addEventListener("load", () => resolve(), { once: true });
                image.addEventListener("error", () => resolve(), { once: true });
              }),
          ),
      );
      if (document.fonts?.ready) await document.fonts.ready;

      document.title = filename;
      window.print();
    } finally {
      // The browser restores the title after print is closed. Keeping this
      // fallback also covers browsers that do not fire afterprint reliably.
      window.setTimeout(() => {
        document.title = oldTitle;
        setSavingPdf(false);
      }, 800);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading itinerary...
        </div>
      </main>
    );
  }

  if (error || !itinerary) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black uppercase">Itinerary unavailable</h1>
          <p className="mt-3 text-sm text-zinc-500">
            {error || "The itinerary could not be found."}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-5 py-3 text-sm font-bold text-black"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const tripName = tripNameOf(itinerary);

  return (
    <main className="min-h-screen bg-[#090909] text-white print:bg-[#101010]">
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      <div className="pdf-toolbar sticky top-0 z-50 border-b border-[#242424] bg-[#0D0D0D]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="hidden text-center sm:block">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              Preview
            </p>
            <p className="text-sm font-bold">{tripName}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => router.push(`/itineraries/${id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white sm:px-3 sm:text-xs"
            >
              <Edit3 size={14} />
              Edit
            </button>
            <button
              onClick={downloadPdf}
              disabled={savingPdf}
              title="Open the print dialog, then choose Save to PDF"
              className="inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-[#f29420] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-xs"
            >
              {savingPdf ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {savingPdf ? "Preparing..." : "Save PDF"}
            </button>
          </div>
        </div>
      </div>

      <div
        id="pdf-content"
        className="mx-auto max-w-[900px] px-3 py-6 md:px-8 md:py-12"
      >
        <PageShell className="flex flex-col justify-end">
          {itinerary.heroImage && (
            <img
              src={itinerary.heroImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
          <div className="relative z-10 max-w-[650px] pb-12 md:pb-20">
            <div className="mb-8 flex h-20 w-20 items-center justify-center border border-white/70 bg-black/60 text-center text-[10px] font-black uppercase leading-3 tracking-wider text-white">
              Bettada
              <br />
              Jeeva
            </div>
            <div className="mb-5 text-[11px] font-black uppercase tracking-[0.45em] text-[#E8820C]">
              BETTADA JEEVA
            </div>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
              {tripName}
            </h1>
            {itinerary.tagline && (
              <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-[#E5E0DF] md:text-lg">
                {itinerary.tagline}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#CCCCCC]">
              {itinerary.durationDays ? <span>{itinerary.durationDays} DAYS</span> : null}
              {itinerary.startPoint && itinerary.endPoint ? (
                <span>
                  {itinerary.startPoint} → {itinerary.endPoint}
                </span>
              ) : null}
              {itinerary.totalDistanceKm ? (
                <span>{itinerary.totalDistanceKm} KM</span>
              ) : null}
            </div>
          </div>
        </PageShell>

        <PageShell>
          <SectionTitle number="01">About the Expedition</SectionTitle>
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              {itinerary.description && (
                <p className="whitespace-pre-line text-[15px] leading-8 text-[#CCCCCC]">
                  {itinerary.description}
                </p>
              )}
              {itinerary.quote?.text && (
                <div className="mt-10 border-l-2 border-[#E8820C] pl-5">
                  <p className="text-xl font-bold leading-relaxed text-white">
                    “{itinerary.quote.text}”
                  </p>
                  {itinerary.quote.attribution && (
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      — {itinerary.quote.attribution}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-3">
              {itinerary.durationDays ? (
                <InfoCard
                  icon={<Route size={17} />}
                  label="Duration"
                  value={`${itinerary.durationDays} Days`}
                />
              ) : null}
              {itinerary.maxAltitude ? (
                <InfoCard
                  icon={<Mountain size={17} />}
                  label="Maximum Altitude"
                  value={itinerary.maxAltitude}
                />
              ) : null}
              {itinerary.tempRange ? (
                <InfoCard
                  icon={<Thermometer size={17} />}
                  label="Temperature"
                  value={itinerary.tempRange}
                />
              ) : null}
              {itinerary.totalDistanceKm ? (
                <InfoCard
                  icon={<Route size={17} />}
                  label="Distance"
                  value={`${itinerary.totalDistanceKm} KM`}
                />
              ) : null}
            </div>
          </div>
          {!!itinerary.highlights?.length && (
            <div className="mt-12">
              <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-[#E8820C]">
                Expedition Highlights
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {itinerary.highlights.map((highlight, index) => (
                  <div key={index} className="pdf-card border border-[#2A2A2A] bg-[#181818] p-5">
                    <h4 className="font-black uppercase text-white">
                      {highlight.title || `Highlight ${index + 1}`}
                    </h4>
                    {highlight.text && (
                      <p className="mt-2 text-sm leading-6 text-[#B7B7B7]">
                        {highlight.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </PageShell>

        {(itinerary.philosophyIntro || itinerary.pillars?.length) && (
          <PageShell>
            <SectionTitle number="02">Expedition Focus & Philosophy</SectionTitle>
            {itinerary.philosophyIntro && (
              <p className="max-w-2xl whitespace-pre-line text-[15px] leading-8 text-[#CCCCCC]">
                {itinerary.philosophyIntro}
              </p>
            )}
            {!!itinerary.pillars?.length && (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {itinerary.pillars.map((pillar, index) => (
                  <div key={index} className="pdf-card border border-[#2A2A2A] bg-[#181818] p-6">
                    <div className="mb-4 flex h-8 w-8 items-center justify-center bg-[#E8820C] text-xs font-black text-black">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-base font-black uppercase text-white">
                      {pillar.title}
                    </h3>
                    {pillar.text && (
                      <p className="mt-3 text-sm leading-6 text-[#B7B7B7]">
                        {pillar.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </PageShell>
        )}

        {phases.map((phase, phaseIndex) => (
          <PageShell key={phaseIndex}>
            <SectionTitle number={`03.${phaseIndex + 1}`}>
              {phase.phaseTitle || `Phase ${phaseIndex + 1}`}
            </SectionTitle>
            {phase.dayRangeLabel && (
              <div className="mb-8 inline-flex border border-[#E8820C] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#E8820C]">
                {phase.dayRangeLabel}
              </div>
            )}
            <div className="space-y-5">
              {phase.days?.map((day, dayIndex) => (
                <article
                  key={dayIndex}
                  className="avoid-break border border-[#2A2A2A] bg-[#191919] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
                        {day.dayLabel || `Day ${dayIndex + 1}`}
                      </div>
                      <h3 className="mt-2 text-lg font-black uppercase text-white">
                        {day.title || "Untitled Day"}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-wider text-[#888]">
                      {day.distance && (
                        <span className="border border-[#333] px-2 py-1">
                          {day.distance}
                        </span>
                      )}
                      {day.altitude && (
                        <span className="border border-[#333] px-2 py-1">
                          {day.altitude}
                        </span>
                      )}
                    </div>
                  </div>
                  {day.description && (
                    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#E5E0DF]">
                      {day.description}
                    </p>
                  )}
                  {day.overnight && (
                    <div className="mt-4 flex items-center gap-2 border-t border-[#2A2A2A] pt-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#888]">
                      <MapPin size={12} className="text-[#E8820C]" />
                      Overnight: {day.overnight}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </PageShell>
        ))}

        {itinerary.pricing && (
          <PageShell>
            <SectionTitle number="04">Price Breakdown</SectionTitle>
            <div className="border border-[#2A2A2A] bg-[#181818]">
              {itinerary.pricing.lineItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 border-b border-[#2A2A2A] px-5 py-4 last:border-0"
                >
                  <span className="text-sm text-[#CCCCCC]">
                    {item.label || `Item ${index + 1}`}
                  </span>
                  <span className="shrink-0 text-sm font-bold text-white">
                    {money(item.amount, itinerary.pricing?.currency)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 bg-[#E8820C] px-5 py-5 text-black">
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Total Per Person
                </span>
                <span className="text-xl font-black">
                  {money(pricingTotal, itinerary.pricing.currency)}
                </span>
              </div>
            </div>
            {!!itinerary.pricing.paymentSchedule?.length && (
              <div className="mt-8">
                <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#E8820C]">
                  Payment Schedule
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {itinerary.pricing.paymentSchedule.map((payment, index) => (
                    <div key={index} className="pdf-card border border-[#2A2A2A] p-4">
                      <div className="flex justify-between gap-4">
                        <span className="text-sm font-bold text-white">
                          {payment.label}
                        </span>
                        <span className="text-sm font-bold text-[#E8820C]">
                          {money(payment.amount, itinerary.pricing?.currency)}
                        </span>
                      </div>
                      {payment.note && (
                        <p className="mt-2 text-xs text-[#888]">{payment.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {itinerary.pricing.disclaimer && (
              <p className="mt-8 text-[10px] leading-5 text-[#777]">
                {itinerary.pricing.disclaimer}
              </p>
            )}
          </PageShell>
        )}

        {!!(itinerary.inclusions?.length || itinerary.exclusions?.length) && (
          <PageShell>
            <SectionTitle number="05">Inclusions & Exclusions</SectionTitle>
            <div className="grid gap-8 md:grid-cols-2">
              {!!itinerary.inclusions?.length && (
                <ListBlock title="Included" items={itinerary.inclusions} positive />
              )}
              {!!itinerary.exclusions?.length && (
                <ListBlock title="Not Included" items={itinerary.exclusions} />
              )}
            </div>
          </PageShell>
        )}

        {!!itinerary.advantages?.length && (
          <PageShell>
            <SectionTitle number="06">Why This Expedition</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              {itinerary.advantages.map((advantage, index) => (
                <div key={index} className="pdf-card border border-[#2A2A2A] bg-[#181818] p-5">
                  <h3 className="font-black uppercase text-white">
                    {advantage.title || `Advantage ${index + 1}`}
                  </h3>
                  {!!advantage.bullets?.length && (
                    <ul className="mt-4 space-y-2">
                      {advantage.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex gap-2 text-sm leading-6 text-[#B7B7B7]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#E8820C]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </PageShell>
        )}

        {(itinerary.stayPreference ||
          itinerary.foodPreference ||
          itinerary.travelCadence?.length ||
          itinerary.accommodationComfort ||
          itinerary.safetyTeam) && (
          <PageShell>
            <SectionTitle number="07">Expedition Essentials</SectionTitle>
            <div className="space-y-6">
              {itinerary.stayPreference && (
                <InfoSection
                  title={itinerary.stayPreference.title || "Stay"}
                  text={itinerary.stayPreference.text}
                />
              )}
              {itinerary.foodPreference && (
                <InfoSection
                  title={itinerary.foodPreference.title || "Food"}
                  text={itinerary.foodPreference.text}
                />
              )}
              {itinerary.accommodationComfort && (
                <BulletSection
                  title="Accommodation Comfort"
                  bullets={itinerary.accommodationComfort.bullets}
                  closingStatement={itinerary.accommodationComfort.closingStatement}
                />
              )}
              {itinerary.safetyTeam && (
                <BulletSection
                  title="Safety & Team"
                  bullets={itinerary.safetyTeam.bullets}
                  closingStatement={itinerary.safetyTeam.closingStatement}
                />
              )}
              {!!itinerary.travelCadence?.length && (
                <BulletSection
                  title="Travel Cadence"
                  bullets={itinerary.travelCadence}
                />
              )}
            </div>
          </PageShell>
        )}
      </div>
    </main>
  );
}
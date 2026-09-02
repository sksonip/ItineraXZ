"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Eye,
  Loader2,
  Menu,
  Mountain,
  Save,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

/* ================================================== */
/* TYPES                                              */
/* ================================================== */

export type BuilderSectionId =
  | "trip-details"
  | "overview"
  | "days"
  | "inclusions"
  | "exclusions"
  | "accommodations"
  | "advantages"
  | "philosophy"
  | "pricing"
  | "safety";

export type ItineraryDay = {
  id: string;
  day: number;
  title: string;
  description: string;
  location?: string;
  activities?: string[];
};

export type ItineraryOverview = {
  title: string;
  description: string;
  highlights: string[];
};

export type ItineraryListItem = {
  id: string;
  text: string;
};

export type Accommodation = {
  id: string;
  name: string;
  location: string;
  nights: number;
  roomType?: string;
};

export type TripDetailsData = {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  tripType: string;
  pace: string;
};

export type PricingData = {
  basePrice: number;
  adjustment: number;
  discount: number;
  taxes: number;
  fees: number;
  currency: string;
};

export type SafetyItem = {
  id: string;
  category: string;
  description: string;
};

export type ItineraryData = {
  id?: string;
  tripDetails: TripDetailsData;
  overview: ItineraryOverview;
  days: ItineraryDay[];
  inclusions: ItineraryListItem[];
  exclusions: ItineraryListItem[];
  accommodations: Accommodation[];
  advantages: ItineraryListItem[];
  philosophy: string;
  pricing: PricingData;
  safety: SafetyItem[];
};

/* ================================================== */
/* DEFAULT DATA                                       */
/* ================================================== */

const defaultData: ItineraryData = {
  tripDetails: {
    destination: "",
    startDate: "",
    endDate: "",
    duration: 0,
    travelers: 2,
    tripType: "",
    pace: "balanced",
  },
  overview: {
    title: "",
    description: "",
    highlights: [],
  },
  days: [],
  inclusions: [],
  exclusions: [],
  accommodations: [],
  advantages: [],
  philosophy: "",
  pricing: {
    basePrice: 0,
    adjustment: 0,
    discount: 0,
    taxes: 0,
    fees: 0,
    currency: "INR",
  },
  safety: [],
};

/* ================================================== */
/* SIDEBAR SECTIONS                                   */
/* ================================================== */

const SECTIONS: { id: BuilderSectionId; label: string }[] = [
  { id: "trip-details", label: "Trip Details" },
  { id: "overview", label: "Overview" },
  { id: "days", label: "Itinerary" },
  { id: "inclusions", label: "Inclusions" },
  { id: "exclusions", label: "Exclusions" },
  { id: "accommodations", label: "Accommodations" },
  { id: "advantages", label: "Advantages" },
  { id: "philosophy", label: "Philosophy" },
  { id: "pricing", label: "Pricing" },
  { id: "safety", label: "Safety" },
];

/* ================================================== */
/* PROPS                                              */
/* ================================================== */

type ItineraryBuilderProps = {
  initialData?: Partial<ItineraryData>;
  itineraryId?: string;
};

/* ================================================== */
/* COMPONENT                                          */
/* ================================================== */

export default function ItineraryBuilder({
  initialData,
  itineraryId,
}: ItineraryBuilderProps) {
  const router = useRouter();

  const [data, setData] = useState<ItineraryData>(() => ({
    ...defaultData,
    ...initialData,
    tripDetails: { ...defaultData.tripDetails, ...initialData?.tripDetails },
    overview: { ...defaultData.overview, ...initialData?.overview },
    pricing: { ...defaultData.pricing, ...initialData?.pricing },
  }));

  const [activeSection, setActiveSection] = useState<BuilderSectionId>("trip-details");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  /* ================================================== */
  /* UPDATE DATA                                       */
  /* ================================================== */

  const updateData = useCallback(
    <K extends keyof ItineraryData>(key: K, value: ItineraryData[K]) => {
      setData((current) => ({ ...current, [key]: value }));
      setDirty(true);
      setSaved(false);
    },
    []
  );

  /* ================================================== */
  /* COMPLETED SECTIONS                                */
  /* ================================================== */

  const completedSections = useMemo<BuilderSectionId[]>(() => {
    const completed: BuilderSectionId[] = [];
    const trip = data.tripDetails;

    if (trip.destination && trip.duration > 0) completed.push("trip-details");
    if (data.overview.title && data.overview.description) completed.push("overview");
    if (data.days.length > 0) completed.push("days");
    if (data.inclusions.length > 0) completed.push("inclusions");
    if (data.exclusions.length > 0) completed.push("exclusions");
    if (data.accommodations.length > 0) completed.push("accommodations");
    if (data.advantages.length > 0) completed.push("advantages");
    if (data.philosophy.trim()) completed.push("philosophy");
    if (data.pricing.basePrice > 0) completed.push("pricing");
    if (data.safety.length > 0) completed.push("safety");

    return completed;
  }, [data]);

  /* ================================================== */
  /* SAVE                                              */
  /* ================================================== */

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        itineraryId ? `/api/itineraries/${itineraryId}` : "/api/itineraries",
        {
          method: itineraryId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to save itinerary");

      const result = await response.json();
      setSaved(true);
      setDirty(false);

      if (!itineraryId && result?.id) {
        router.replace(`/itineraries/${result.id}`);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to save itinerary.");
    } finally {
      setSaving(false);
    }
  };

  /* ================================================== */
  /* AI SUGGESTION                                     */
  /* ================================================== */

  const handleAiSuggest = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripDetails: data.tripDetails,
          overview: data.overview,
          days: data.days,
          pricing: data.pricing,
        }),
      });

      if (!response.ok) throw new Error("AI suggestion failed");

      const result = await response.json();

      if (result?.overview) {
        setData((current) => ({
          ...current,
          overview: { ...current.overview, ...result.overview },
        }));
        setDirty(true);
        setSaved(false);
      }

      if (result?.days) {
        setData((current) => ({ ...current, days: result.days }));
        setDirty(true);
        setSaved(false);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "AI suggestion failed.");
    } finally {
      setAiLoading(false);
    }
  };

  /* ================================================== */
  /* AI PRICING                                       */
  /* ================================================== */

  const handleAiPricing = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripDetails: data.tripDetails,
          days: data.days,
          accommodations: data.accommodations,
          currentPricing: data.pricing,
        }),
      });

      if (!response.ok) throw new Error("Pricing suggestion failed");

      const result = await response.json();

      if (typeof result?.adjustment === "number") {
        updateData("pricing", { ...data.pricing, adjustment: result.adjustment });
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to calculate pricing.");
    } finally {
      setAiLoading(false);
    }
  };

  /* ================================================== */
  /* SECTION NAVIGATION                                */
  /* ================================================== */

  const scrollToSection = (section: BuilderSectionId) => {
    setActiveSection(section);
    setSidebarOpen(false);
    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ================================================== */
  /* RENDER                                            */
  /* ================================================== */

  return (
    <div
      className="min-h-screen bg-[#f4f0e8] text-[#1d211c]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#1d211c]/30 lg:hidden"
        />
      )}

      <div className="flex min-h-screen">
        {/* SIDEBAR — desktop */}

        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[#1d211c]/10 bg-[#e9e3d8] px-4 py-6 lg:block">
          <SidebarContent
            activeSection={activeSection}
            completedSections={completedSections}
            onSectionChange={scrollToSection}
          />
        </aside>

        {/* SIDEBAR — mobile drawer */}

        {sidebarOpen && (
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#1d211c]/10 bg-[#e9e3d8] px-4 py-6 lg:hidden">
            <div className="mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold tracking-[-0.04em] text-[#1d211c]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d211c] text-[#f4f0e8]">
                  <Mountain size={15} strokeWidth={1.8} />
                </span>
                Sections
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1d211c]/10 text-[#1d211c]/60"
                aria-label="Close"
              >
                <X size={15} strokeWidth={1.8} />
              </button>
            </div>
            <SidebarContent
              activeSection={activeSection}
              completedSections={completedSections}
              onSectionChange={scrollToSection}
            />
          </aside>
        )}

        {/* MAIN */}

        <main className="min-w-0 flex-1">
          {/* HEADER */}

          <header className="sticky top-0 z-40 border-b border-[#1d211c]/10 bg-[#f4f0e8]/95 backdrop-blur">
            <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 md:px-6">
              {/* LEFT */}

              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1d211c]/10 text-[#1d211c]/60 transition hover:border-[#1d211c]/30 hover:text-[#1d211c]"
                  aria-label="Go back"
                >
                  <ArrowLeft size={15} strokeWidth={1.8} />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="truncate text-sm font-semibold tracking-[-0.04em] text-[#1d211c] md:text-[15px]">
                      {data.overview.title || "Itinerary Builder"}
                    </h1>

                    {dirty && (
                      <span className="hidden items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#b85d35] sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#b85d35]" />
                        Unsaved
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 hidden truncate text-[10px] font-medium uppercase tracking-[0.16em] text-[#1d211c]/45 sm:block">
                    {data.tripDetails.destination || "Build your travel experience"}
                  </p>
                </div>
              </div>

              {/* RIGHT */}

              <div className="flex shrink-0 items-center gap-2">
                {/* IMPORT */}

                <button
                  type="button"
                  className="hidden h-10 items-center gap-2 rounded-full border border-[#1d211c]/10 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d211c]/60 transition hover:border-[#1d211c]/30 hover:text-[#1d211c] md:flex"
                >
                  <Upload size={13} strokeWidth={1.8} />
                  Import
                </button>

                {/* AI */}

                <button
                  type="button"
                  onClick={handleAiSuggest}
                  className="flex h-10 items-center gap-2 rounded-full border border-[#b85d35]/20 bg-[#b85d35]/5 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b85d35] transition hover:border-[#b85d35]/50 hover:bg-[#b85d35]/10"
                >
                  <Sparkles size={13} strokeWidth={1.8} />
                  <span className="hidden sm:inline">AI Suggest</span>
                </button>

                {/* PREVIEW */}

                <button
                  type="button"
                  onClick={() => {
                    if (itineraryId) {
                      router.push(`/itineraries/${itineraryId}/preview`);
                    }
                  }}
                  className="hidden h-10 items-center gap-2 rounded-full border border-[#1d211c]/10 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d211c]/60 transition hover:border-[#1d211c]/30 hover:text-[#1d211c] sm:flex"
                >
                  <Eye size={13} strokeWidth={1.8} />
                  Preview
                </button>

                {/* SAVE */}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex h-10 items-center gap-2 rounded-full bg-[#b85d35] px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#974729] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={13} strokeWidth={1.8} />
                  <span>{saving ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>

            {/* MOBILE STATUS */}

            {dirty && (
              <div className="border-t border-[#1d211c]/10 px-4 py-2 sm:hidden">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b85d35]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#b85d35]">
                    Unsaved changes
                  </span>
                </div>
              </div>
            )}
          </header>

          {/* MOBILE TOOLBAR */}

          <div className="sticky top-[68px] z-30 border-b border-[#1d211c]/10 bg-[#f4f0e8] px-4 py-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[#1d211c]/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d211c]/60"
            >
              <Menu size={13} strokeWidth={1.8} />
              Sections
            </button>
          </div>

          {/* CONTENT */}

          <div className="mx-auto w-full max-w-[1100px] space-y-5 p-4 md:p-6 lg:p-8">
            {/* ERROR */}

            {error && (
              <div className="rounded-2xl border border-[#b85d35]/20 bg-[#b85d35]/5 px-4 py-3 text-[11px] font-medium text-[#b85d35]">
                {error}
              </div>
            )}

            {/* SAVED */}

            {saved && !dirty && (
              <div className="flex items-center gap-2 rounded-2xl border border-[#26372f]/15 bg-[#26372f]/5 px-4 py-3 text-[11px] font-medium text-[#26372f]">
                <Check size={13} strokeWidth={2} />
                Itinerary saved successfully.
              </div>
            )}

            {/* TRIP DETAILS */}

            <SectionWrapper id="trip-details">
              <TripDetailsEditor
                tripDetails={data.tripDetails}
                onChange={(value) => updateData("tripDetails", value)}
              />
            </SectionWrapper>

            {/* OVERVIEW */}

            <SectionWrapper id="overview">
              <OverviewEditor
                value={data.overview}
                onChange={(value) => updateData("overview", value)}
              />
            </SectionWrapper>

            {/* DAYS */}

            <SectionWrapper id="days">
              <DaysEditor
                days={data.days}
                onChange={(value) => updateData("days", value)}
              />
            </SectionWrapper>

            {/* INCLUSIONS */}

            <SectionWrapper id="inclusions">
              <ListEditor
                title="What's included"
                items={data.inclusions}
                onChange={(value) => updateData("inclusions", value)}
              />
            </SectionWrapper>

            {/* EXCLUSIONS */}

            <SectionWrapper id="exclusions">
              <ListEditor
                title="What's not included"
                items={data.exclusions}
                onChange={(value) => updateData("exclusions", value)}
              />
            </SectionWrapper>

            {/* ACCOMMODATIONS */}

            <SectionWrapper id="accommodations">
              <AccommodationEditor
                accommodations={data.accommodations}
                onChange={(value) => updateData("accommodations", value)}
              />
            </SectionWrapper>

            {/* ADVANTAGES */}

            <SectionWrapper id="advantages">
              <ListEditor
                title="Why choose this itinerary"
                items={data.advantages}
                onChange={(value) => updateData("advantages", value)}
              />
            </SectionWrapper>

            {/* PHILOSOPHY */}

            <SectionWrapper id="philosophy">
              <SectionCard>
                <textarea
                  value={data.philosophy}
                  onChange={(event) => updateData("philosophy", event.target.value)}
                  placeholder="Describe the philosophy behind this journey..."
                  rows={6}
                  className={textareaClass}
                />
              </SectionCard>
            </SectionWrapper>

            {/* PRICING */}

            <SectionWrapper id="pricing">
              <PricingEditor
                pricing={data.pricing}
                onChange={(value) => updateData("pricing", value)}
                onSuggestPrice={handleAiPricing}
                aiLoading={aiLoading}
              />
            </SectionWrapper>

            {/* SAFETY */}

            <SectionWrapper id="safety">
              <SafetyEditor
                safety={data.safety}
                onChange={(value) => updateData("safety", value)}
              />
            </SectionWrapper>

            {/* BOTTOM SAVE */}

            <div className="flex flex-col gap-4 border-t border-[#1d211c]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1d211c]/45">
                  Builder status
                </p>
                <p className="mt-1 text-[12px] text-[#1d211c]/60">
                  {dirty ? "You have unsaved changes." : "All changes are saved."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !dirty}
                className="flex items-center justify-center gap-2 rounded-full bg-[#b85d35] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#974729] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? (
                  <Loader2 size={13} strokeWidth={1.8} className="animate-spin" />
                ) : (
                  <Save size={13} strokeWidth={1.8} />
                )}
                {saving ? "Saving..." : "Save itinerary"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================================================== */
/* SIDEBAR CONTENT                                    */
/* ================================================== */

function SidebarContent({
  activeSection,
  completedSections,
  onSectionChange,
}: {
  activeSection: BuilderSectionId;
  completedSections: BuilderSectionId[];
  onSectionChange: (section: BuilderSectionId) => void;
}) {
  return (
    <div>
      <div className="mb-6 hidden items-center gap-2 text-sm font-semibold tracking-[-0.04em] text-[#1d211c] lg:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d211c] text-[#f4f0e8]">
          <Mountain size={15} strokeWidth={1.8} />
        </span>
        Sections
      </div>

      <nav className="space-y-1">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const isCompleted = completedSections.includes(section.id);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              className={`flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-[12px] font-medium transition ${
                isActive
                  ? "bg-[#1d211c] text-[#f4f0e8]"
                  : "text-[#1d211c]/55 hover:bg-[#1d211c]/5 hover:text-[#1d211c]"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                  isCompleted
                    ? "bg-[#b85d35] text-white"
                    : isActive
                      ? "border border-[#f4f0e8]/30 text-[#f4f0e8]/60"
                      : "border border-[#1d211c]/15 text-[#1d211c]/35"
                }`}
              >
                {isCompleted ? <Check size={10} strokeWidth={2.5} /> : ""}
              </span>
              {section.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ================================================== */
/* SECTION WRAPPER                                    */
/* ================================================== */

function SectionWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      {children}
    </section>
  );
}

/* ================================================== */
/* SECTION CARD                                       */
/* ================================================== */

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-[#1d211c]/10 bg-white/50 p-5 md:p-6">
      {children}
    </div>
  );
}

/* ================================================== */
/* TRIP DETAILS EDITOR                                */
/* ================================================== */

function TripDetailsEditor({
  tripDetails,
  onChange,
}: {
  tripDetails: TripDetailsData;
  onChange: (value: TripDetailsData) => void;
}) {
  return (
    <SectionCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Destination</label>
          <input
            value={tripDetails.destination}
            onChange={(event) => onChange({ ...tripDetails, destination: event.target.value })}
            placeholder="Where to?"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Start date</label>
          <input
            type="date"
            value={tripDetails.startDate}
            onChange={(event) => onChange({ ...tripDetails, startDate: event.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>End date</label>
          <input
            type="date"
            value={tripDetails.endDate}
            onChange={(event) => onChange({ ...tripDetails, endDate: event.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Duration (days)</label>
          <input
            type="number"
            min={0}
            value={tripDetails.duration}
            onChange={(event) =>
              onChange({ ...tripDetails, duration: Math.max(0, Number(event.target.value) || 0) })
            }
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Travelers</label>
          <input
            type="number"
            min={1}
            value={tripDetails.travelers}
            onChange={(event) =>
              onChange({ ...tripDetails, travelers: Math.max(1, Number(event.target.value) || 1) })
            }
            placeholder="2"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Trip type</label>
          <input
            value={tripDetails.tripType}
            onChange={(event) => onChange({ ...tripDetails, tripType: event.target.value })}
            placeholder="e.g. Adventure, Leisure"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Pace</label>
          <select
            value={tripDetails.pace}
            onChange={(event) => onChange({ ...tripDetails, pace: event.target.value })}
            className={inputClass}
          >
            <option value="relaxed">Relaxed</option>
            <option value="balanced">Balanced</option>
            <option value="packed">Packed</option>
          </select>
        </div>
      </div>
    </SectionCard>
  );
}

/* ================================================== */
/* OVERVIEW EDITOR                                    */
/* ================================================== */

function OverviewEditor({
  value,
  onChange,
}: {
  value: ItineraryOverview;
  onChange: (value: ItineraryOverview) => void;
}) {
  return (
    <SectionCard>
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Title</label>
          <input
            value={value.title}
            onChange={(event) => onChange({ ...value, title: event.target.value })}
            placeholder="7 Days in Kerala"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={value.description}
            onChange={(event) => onChange({ ...value, description: event.target.value })}
            placeholder="Describe the overall journey..."
            rows={6}
            className={textareaClass}
          />
        </div>

        <div>
          <label className={labelClass}>Highlights</label>
          <textarea
            value={value.highlights.join("\n")}
            onChange={(event) =>
              onChange({
                ...value,
                highlights: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder={"Backwater cruise\nTea plantations\nPrivate transfers"}
            rows={5}
            className={textareaClass}
          />
          <p className={hintClass}>Add one highlight per line.</p>
        </div>
      </div>
    </SectionCard>
  );
}

/* ================================================== */
/* DAYS EDITOR                                        */
/* ================================================== */

function DaysEditor({
  days,
  onChange,
}: {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
}) {
  function addDay() {
    onChange([
      ...days,
      {
        id: crypto.randomUUID(),
        day: days.length + 1,
        title: "",
        description: "",
        location: "",
        activities: [],
      },
    ]);
  }

  function updateDay(id: string, updates: Partial<ItineraryDay>) {
    onChange(days.map((day) => (day.id === id ? { ...day, ...updates } : day)));
  }

  function removeDay(id: string) {
    onChange(
      days
        .filter((day) => day.id !== id)
        .map((day, index) => ({ ...day, day: index + 1 }))
    );
  }

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <SectionCard key={day.id}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b85d35]">
                Day {day.day}
              </p>
              <p className="mt-1 text-[10px] text-[#1d211c]/40">
                Build the activities for this day.
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeDay(day.id)}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d211c]/40 transition hover:text-[#b85d35]"
            >
              Remove
            </button>
          </div>

          <div className="space-y-4">
            <input
              value={day.title}
              onChange={(event) => updateDay(day.id, { title: event.target.value })}
              placeholder="Day title"
              className={inputClass}
            />

            <input
              value={day.location || ""}
              onChange={(event) => updateDay(day.id, { location: event.target.value })}
              placeholder="Location"
              className={inputClass}
            />

            <textarea
              value={day.description}
              onChange={(event) => updateDay(day.id, { description: event.target.value })}
              placeholder="Describe the day's experience..."
              rows={5}
              className={textareaClass}
            />

            <textarea
              value={(day.activities || []).join("\n")}
              onChange={(event) =>
                updateDay(day.id, {
                  activities: event.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              placeholder={"Breakfast\nVisit tea plantation\nSunset viewpoint"}
              rows={4}
              className={textareaClass}
            />

            <p className={hintClass}>Add one activity per line.</p>
          </div>
        </SectionCard>
      ))}

      <AddButton label="+ Add day" onClick={addDay} />
    </div>
  );
}

/* ================================================== */
/* LIST EDITOR                                        */
/* ================================================== */

function ListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: ItineraryListItem[];
  onChange: (items: ItineraryListItem[]) => void;
}) {
  function addItem() {
    onChange([...items, { id: crypto.randomUUID(), text: "" }]);
  }

  function updateItem(id: string, text: string) {
    onChange(items.map((item) => (item.id === id ? { ...item, text } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <SectionCard>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#1d211c]">{title}</h3>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="w-6 text-center text-[10px] font-semibold text-[#1d211c]/40">
              {index + 1}
            </span>
            <input
              value={item.text}
              onChange={(event) => updateItem(item.id, event.target.value)}
              placeholder="Enter item..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="px-2 text-[#1d211c]/30 transition hover:text-[#b85d35]"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>

      <AddButton label="+ Add item" onClick={addItem} />
    </SectionCard>
  );
}

/* ================================================== */
/* ACCOMMODATION EDITOR                              */
/* ================================================== */

function AccommodationEditor({
  accommodations,
  onChange,
}: {
  accommodations: Accommodation[];
  onChange: (accommodations: Accommodation[]) => void;
}) {
  function addAccommodation() {
    onChange([
      ...accommodations,
      {
        id: crypto.randomUUID(),
        name: "",
        location: "",
        nights: 1,
        roomType: "",
      },
    ]);
  }

  function updateAccommodation(id: string, updates: Partial<Accommodation>) {
    onChange(
      accommodations.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }

  function removeAccommodation(id: string) {
    onChange(accommodations.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-4">
      {accommodations.map((accommodation, index) => (
        <SectionCard key={accommodation.id}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1d211c]/50">
              Stay {index + 1}
            </p>
            <button
              type="button"
              onClick={() => removeAccommodation(accommodation.id)}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d211c]/40 transition hover:text-[#b85d35]"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={accommodation.name}
              onChange={(event) =>
                updateAccommodation(accommodation.id, { name: event.target.value })
              }
              placeholder="Hotel / property name"
              className={inputClass}
            />
            <input
              value={accommodation.location}
              onChange={(event) =>
                updateAccommodation(accommodation.id, { location: event.target.value })
              }
              placeholder="Location"
              className={inputClass}
            />
            <input
              type="number"
              min={1}
              value={accommodation.nights}
              onChange={(event) =>
                updateAccommodation(accommodation.id, {
                  nights: Math.max(1, Number(event.target.value) || 1),
                })
              }
              placeholder="Nights"
              className={inputClass}
            />
            <input
              value={accommodation.roomType || ""}
              onChange={(event) =>
                updateAccommodation(accommodation.id, { roomType: event.target.value })
              }
              placeholder="Room type"
              className={inputClass}
            />
          </div>
        </SectionCard>
      ))}

      <AddButton label="+ Add accommodation" onClick={addAccommodation} />
    </div>
  );
}

/* ================================================== */
/* PRICING EDITOR                                     */
/* ================================================== */

function PricingEditor({
  pricing,
  onChange,
  onSuggestPrice,
  aiLoading,
}: {
  pricing: PricingData;
  onChange: (value: PricingData) => void;
  onSuggestPrice?: () => void;
  aiLoading: boolean;
}) {
  const total =
    pricing.basePrice +
    pricing.adjustment -
    pricing.discount +
    pricing.taxes +
    pricing.fees;

  return (
    <SectionCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Base price</label>
          <input
            type="number"
            min={0}
            value={pricing.basePrice}
            onChange={(event) =>
              onChange({ ...pricing, basePrice: Math.max(0, Number(event.target.value) || 0) })
            }
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Adjustment</label>
          <input
            type="number"
            value={pricing.adjustment}
            onChange={(event) =>
              onChange({ ...pricing, adjustment: Number(event.target.value) || 0 })
            }
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Discount</label>
          <input
            type="number"
            min={0}
            value={pricing.discount}
            onChange={(event) =>
              onChange({ ...pricing, discount: Math.max(0, Number(event.target.value) || 0) })
            }
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Taxes</label>
          <input
            type="number"
            min={0}
            value={pricing.taxes}
            onChange={(event) =>
              onChange({ ...pricing, taxes: Math.max(0, Number(event.target.value) || 0) })
            }
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Fees</label>
          <input
            type="number"
            min={0}
            value={pricing.fees}
            onChange={(event) =>
              onChange({ ...pricing, fees: Math.max(0, Number(event.target.value) || 0) })
            }
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Currency</label>
          <select
            value={pricing.currency}
            onChange={(event) => onChange({ ...pricing, currency: event.target.value })}
            className={inputClass}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      {onSuggestPrice && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onSuggestPrice}
            disabled={aiLoading}
            className="flex items-center gap-2 rounded-full border border-[#b85d35]/20 bg-[#b85d35]/5 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b85d35] transition hover:border-[#b85d35]/50 hover:bg-[#b85d35]/10 disabled:opacity-50"
          >
            {aiLoading ? (
              <Loader2 size={13} strokeWidth={1.8} className="animate-spin" />
            ) : (
              <Sparkles size={13} strokeWidth={1.8} />
            )}
            Suggest price
          </button>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-[#1d211c]/10 pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1d211c]/45">
          Total
        </span>
        <span className="text-lg font-semibold tracking-[-0.04em] text-[#1d211c]">
          {pricing.currency} {total.toLocaleString()}
        </span>
      </div>
    </SectionCard>
  );
}

function SafetyEditor({
  safety,
  onChange,
}: {
  safety: SafetyItem[];
  onChange: (safety: SafetyItem[]) => void;
}) {
  function addItem() {
    onChange([...safety, { id: crypto.randomUUID(), category: "", description: "" }]);
  }

  function updateItem(id: string, updates: Partial<SafetyItem>) {
    onChange(safety.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  function removeItem(id: string) {
    onChange(safety.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-4">
      {safety.map((item, index) => (
        <SectionCard key={item.id}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1d211c]/50">
              Item {index + 1}
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d211c]/40 transition hover:text-[#b85d35]"
            >
              Remove
            </button>
          </div>

          <div className="space-y-4">
            <input
              value={item.category}
              onChange={(event) => updateItem(item.id, { category: event.target.value })}
              placeholder="Category (e.g. Health, Transport)"
              className={inputClass}
            />
            <textarea
              value={item.description}
              onChange={(event) => updateItem(item.id, { description: event.target.value })}
              placeholder="Safety details..."
              rows={3}
              className={textareaClass}
            />
          </div>
        </SectionCard>
      ))}

      <AddButton label="+ Add safety item" onClick={addItem} />
    </div>
  );
}



function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-full border border-dashed border-[#1d211c]/20 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d211c]/50 transition hover:border-[#b85d35] hover:text-[#b85d35]"
    >
      {label}
    </button>
  );
}

const inputClass =
  "w-full rounded-full border border-[#1d211c]/15 bg-white/60 px-4 py-3 text-sm font-medium text-[#1d211c] outline-none placeholder:text-[#1d211c]/35 focus:border-[#b85d35] transition-colors";

const textareaClass =
  "w-full resize-none rounded-2xl border border-[#1d211c]/15 bg-white/60 px-4 py-3 text-sm font-medium leading-6 text-[#1d211c] outline-none placeholder:text-[#1d211c]/35 focus:border-[#b85d35] transition-colors";

const labelClass =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d211c]/50";

const hintClass =
  "mt-1.5 text-[10px] leading-4 text-[#1d211c]/40";

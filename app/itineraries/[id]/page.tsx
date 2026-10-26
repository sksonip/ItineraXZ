"use client";

import { useEffect, useId, useState } from "react";
import { EnhanceBar, EnhanceContext } from "@/components/builder/enhance";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Save,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
} from "lucide-react";

type Day = {
  dayLabel: string;
  title: string;
  description: string;
  distance?: string;
  altitude?: string;
  overnight?: string;
};

type Phase = {
  phaseTitle: string;
  dayRangeLabel: string;
  days: Day[];
};

type Highlight = {
  title: string;
  text: string;
};

type PricingItem = {
  label: string;
  amount: number;
};

type Itinerary = {
  id: string;
  tripName: string;
  tagline: string;
  destination: string;
  heroImage?: string;

  durationDays: number;
  maxAltitude: string;
  tempRange: string;
  startPoint: string;
  endPoint: string;
  totalDistanceKm: number;

  description: string;

  highlights: Highlight[];

  philosophyIntro: string;

  pillars: {
    title: string;
    text: string;
  }[];

  phases: Phase[];

  pricing: {
    currency: string;
    lineItems: PricingItem[];
    totalPerPerson: number;
    paymentSchedule: {
      label: string;
      note: string;
      amount: number;
    }[];
    disclaimer: string;
  };

  inclusions: string[];
  exclusions: string[];
};

const emptyItinerary = (id: string): Itinerary => ({
  id,
  tripName: "",
  tagline: "",
  destination: "",
  heroImage: "",

  durationDays: 1,
  maxAltitude: "",
  tempRange: "",
  startPoint: "",
  endPoint: "",
  totalDistanceKm: 0,

  description: "",

  highlights: [],

  philosophyIntro: "",

  pillars: [],

  phases: [
    {
      phaseTitle: "Phase 1",
      dayRangeLabel: "Day 1",
      days: [
        {
          dayLabel: "Day 1",
          title: "",
          description: "",
          distance: "",
          altitude: "",
          overnight: "",
        },
      ],
    },
  ],

  pricing: {
    currency: "INR",
    lineItems: [],
    totalPerPerson: 0,
    paymentSchedule: [],
    disclaimer: "",
  },

  inclusions: [],
  exclusions: [],
});

function toBuilderItinerary(
  source: Record<string, any>,
  id: string
): Itinerary {
  const sourceDays = Array.isArray(source.days)
    ? source.days
    : [];

  const sourcePhases = Array.isArray(source.phases)
    ? source.phases
    : [];

  const days = sourceDays.map((day: any, index: number) => ({
    dayLabel: day.dayLabel || `Day ${day.day || index + 1}`,
    title: day.title || "",
    description: day.description || "",
    distance: day.distance || "",
    altitude: day.altitude || "",
    overnight: day.overnight || day.location || "",
  }));

  const phases = sourcePhases.map((phase: any) => ({
    phaseTitle: phase.phaseTitle || phase.title || "",
    dayRangeLabel: phase.dayRangeLabel || "",
    days: Array.isArray(phase.days)
      ? phase.days
          .map((dayReference: any) =>
            typeof dayReference === "number"
              ? sourceDays[dayReference - 1]
              : dayReference
          )
          .filter(Boolean)
          .map((day: any, index: number) => ({
            dayLabel: day.dayLabel || `Day ${index + 1}`,
            title: day.title || "",
            description: day.description || "",
            distance: day.distance || "",
            altitude: day.altitude || "",
            overnight: day.overnight || day.location || "",
          }))
      : [],
  }));

  const highlights = Array.isArray(source.highlightCards)
    ? source.highlightCards
    : Array.isArray(source.highlights)
      ? source.highlights.map((highlight: any) =>
          typeof highlight === "string"
            ? { title: highlight, text: "" }
            : highlight
        )
      : [];

  const pricingItems = source.pricing?.lineItems ||
    source.pricing?.items || [];

  return {
    ...emptyItinerary(id),
    ...source,
    id,
    tripName: source.tripName || source.title || "",
    tagline: source.tagline || "",
    durationDays: Number(source.durationDays || source.duration || days.length || 1),
    maxAltitude: source.maxAltitude || "",
    tempRange: source.tempRange || "",
    startPoint: source.startPoint || "",
    endPoint: source.endPoint || "",
    totalDistanceKm: Number(source.totalDistanceKm || 0),
    description: source.description || source.overview || "",
    highlights,
    philosophyIntro: source.philosophyIntro || source.philosophy || "",
    pillars: source.pillars || [],
    phases: phases.length ? phases : [{
      phaseTitle: "Itinerary",
      dayRangeLabel: "",
      days,
    }],
    pricing: {
      currency: source.pricing?.currency || "INR",
      lineItems: pricingItems.map((item: any) => ({
        label: item.label || item.name || "",
        amount: Number(item.amount ?? item.unitPrice ?? 0),
      })),
      totalPerPerson: Number(
        source.pricing?.totalPerPerson ||
          pricingItems.reduce(
            (total: number, item: any) =>
              total + Number(item.amount ?? item.unitPrice ?? 0),
            0
          )
      ),
      paymentSchedule: source.pricing?.paymentSchedule || [],
      disclaimer: source.pricing?.disclaimer || "",
    },
    inclusions: source.inclusions || [],
    exclusions: source.exclusions || [],
  };
}

export default function ItineraryBuilderPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [itinerary, setItinerary] =
    useState<Itinerary | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(
    null
  );

  const [openSections, setOpenSections] = useState<
    Record<string, boolean>
  >({
    basics: true,
    overview: true,
    highlights: true,
    philosophy: true,
    itinerary: true,
    pricing: true,
    inclusions: true,
  });

  useEffect(() => {
    if (!id) return;

    const itineraryId = id;

    async function load() {
      try {
        const response = await fetch(
          `/api/itineraries/${itineraryId}`,
          {
            cache: "no-store",
          }
        );

        if (response.status === 404) {
          setItinerary(emptyItinerary(itineraryId));
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load itinerary."
          );
        }

        setItinerary(
          toBuilderItinerary(
            data.itinerary || {},
            itineraryId
          )
        );
      } catch (error) {
        console.error(error);

        setItinerary(emptyItinerary(itineraryId));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function update<K extends keyof Itinerary>(
    key: K,
    value: Itinerary[K]
  ) {
    setItinerary((current) =>
      current
        ? {
            ...current,
            [key]: value,
          }
        : current
    );
  }

  async function saveItinerary() {
    if (!itinerary) return;

    try {
      setSaving(true);

      const response = await fetch(
        `/api/itineraries/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itinerary),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details
            ? `${data.error || "Failed to save itinerary."} ${JSON.stringify(
                data.details.fieldErrors
              )}`
            : data.error || "Failed to save itinerary."
        );
      }

      setItinerary(data.itinerary || itinerary);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save itinerary."
      );
    } finally {
      setSaving(false);
    }
  }

  async function generateAI(
    type:
      | "description"
      | "highlights"
      | "day"
      | "improve"
      | "pricing"
      | "suggest"
  ) {
    if (!itinerary) return;

    try {
      setAiLoading(type);

      const response = await fetch(
        `/api/ai/${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itinerary,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "AI request failed."
        );
      }

      /*
       * AI endpoints can return different fields.
       * We apply whatever structured itinerary
       * changes are returned.
       */

      if (data.itinerary) {
        setItinerary(data.itinerary);
      } else if (data.description) {
        update("description", data.description);
      } else if (data.highlights) {
        update("highlights", data.highlights);
      } else if (data.suggestions) {
        console.log("AI suggestions:", data.suggestions);
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "AI generation failed."
      );
    } finally {
      setAiLoading(null);
    }
  }

  function toggleSection(section: string) {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  async function uploadHeroImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setImageUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result.file?.url) {
        throw new Error(result.error || "Unable to upload image.");
      }

      update("heroImage", result.file.url);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to upload image."
      );
    } finally {
      setImageUploading(false);
      event.target.value = "";
    }
  }

  function addHighlight() {
    if (!itinerary) return;

    update("highlights", [
      ...itinerary.highlights,
      {
        title: "",
        text: "",
      },
    ]);
  }

  function removeHighlight(index: number) {
    if (!itinerary) return;

    update(
      "highlights",
      itinerary.highlights.filter(
        (_, i) => i !== index
      )
    );
  }

  function addPhase() {
    if (!itinerary) return;

    update("phases", [
      ...itinerary.phases,
      {
        phaseTitle: `Phase ${
          itinerary.phases.length + 1
        }`,
        dayRangeLabel: "",
        days: [],
      },
    ]);
  }

  function addDay(phaseIndex: number) {
    if (!itinerary) return;

    const phases = [...itinerary.phases];

    const phase = phases[phaseIndex];

    phase.days.push({
      dayLabel: `Day ${phase.days.length + 1}`,
      title: "",
      description: "",
      distance: "",
      altitude: "",
      overnight: "",
    });

    update("phases", phases);
  }

  function removeDay(
    phaseIndex: number,
    dayIndex: number
  ) {
    if (!itinerary) return;

    const phases = [...itinerary.phases];

    phases[phaseIndex].days = phases[
      phaseIndex
    ].days.filter((_, index) => index !== dayIndex);

    update("phases", phases);
  }

  function addPricingItem() {
    if (!itinerary) return;

    const lineItems = [
      ...itinerary.pricing.lineItems,
      {
        label: "",
        amount: 0,
      },
    ];

    const total = lineItems.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    update("pricing", {
      ...itinerary.pricing,
      lineItems,
      totalPerPerson: total,
    });
  }

  function removePricingItem(index: number) {
    if (!itinerary) return;

    const lineItems =
      itinerary.pricing.lineItems.filter(
        (_, i) => i !== index
      );

    const total = lineItems.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    update("pricing", {
      ...itinerary.pricing,
      lineItems,
      totalPerPerson: total,
    });
  }

  function updatePricing(
    index: number,
    field: keyof PricingItem,
    value: string | number
  ) {
    if (!itinerary) return;

    const lineItems = [
      ...itinerary.pricing.lineItems,
    ];

    lineItems[index] = {
      ...lineItems[index],
      [field]:
        field === "amount"
          ? Number(value)
          : value,
    };

    const total = lineItems.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    update("pricing", {
      ...itinerary.pricing,
      lineItems,
      totalPerPerson: total,
    });
  }

  if (loading || !itinerary) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading builder...
        </div>
      </main>
    );
  }

  return (
    <EnhanceContext.Provider
      value={{
        tripTitle: itinerary.tripName,
        destination: itinerary.destination,
      }}
    >
    <main className="min-h-screen bg-[#090909] text-white">
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#242424] bg-[#0D0D0D]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-3">
          <button
            onClick={() => router.push("/itineraries")}
            className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={17} />
            Itineraries
          </button>

          <div className="hidden text-center md:block">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              Itinerary Builder
            </p>

            <p className="text-sm font-black">
              {itinerary.tripName ||
                "Untitled Expedition"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                router.push(
                  `/itineraries/${id}/preview`
                )
              }
              className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:border-zinc-500 hover:text-white"
            >
              <Eye size={15} />
              Preview
            </button>

            <button
              onClick={saveItinerary}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2 text-xs font-black uppercase tracking-wider text-black hover:bg-[#F29420] disabled:opacity-60"
            >
              {saving ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Save size={15} />
              )}

              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* BUILDER */}

          <div className="space-y-5">
            {/* BASIC INFORMATION */}

            <BuilderSection
              title="Trip Information"
              number="01"
              open={openSections.basics}
              onToggle={() =>
                toggleSection("basics")
              }
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Trip Name"
                  value={itinerary.tripName}
                  onChange={(value) =>
                    update("tripName", value)
                  }
                  placeholder="Western Ghats Expedition"
                />

                <Field
                  label="Destination"
                  value={itinerary.destination}
                  onChange={(value) =>
                    update("destination", value)
                  }
                  placeholder="Coorg, Karnataka"
                />

                <Field
                  label="Tagline"
                  value={itinerary.tagline}
                  onChange={(value) =>
                    update("tagline", value)
                  }
                  placeholder="A slower way into the mountains"
                />

                <Field
                  label="Hero Image URL"
                  value={itinerary.heroImage || ""}
                  onChange={(value) =>
                    update("heroImage", value)
                  }
                  placeholder="https://..."
                />

                <div className="md:col-span-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#E8820C]/40 bg-[#E8820C]/10 px-3 py-2.5 text-xs font-black text-[#E8820C] transition hover:bg-[#E8820C]/20">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={uploadHeroImage}
                        disabled={imageUploading}
                        className="sr-only"
                      />
                      {imageUploading ? "Uploading..." : "Choose image"}
                    </label>

                    {itinerary.heroImage && (
                      <button
                        type="button"
                        onClick={() => update("heroImage", "")}
                        className="text-xs font-bold text-zinc-500 hover:text-red-400"
                      >
                        Remove image
                      </button>
                    )}
                  </div>

                  {itinerary.heroImage && (
                    <img
                      src={itinerary.heroImage}
                      alt="Hero preview"
                      className="mt-4 h-40 w-full rounded-lg border border-[#2A2A2A] object-cover sm:w-72"
                    />
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <NumberField
                  label="Duration (Days)"
                  value={itinerary.durationDays}
                  onChange={(value) =>
                    update("durationDays", value)
                  }
                />

                <Field
                  label="Maximum Altitude"
                  value={itinerary.maxAltitude}
                  onChange={(value) =>
                    update("maxAltitude", value)
                  }
                  placeholder="1,750 m"
                />

                <Field
                  label="Temperature"
                  value={itinerary.tempRange}
                  onChange={(value) =>
                    update("tempRange", value)
                  }
                  placeholder="14°C – 24°C"
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <Field
                  label="Start Point"
                  value={itinerary.startPoint}
                  onChange={(value) =>
                    update("startPoint", value)
                  }
                  placeholder="Bengaluru"
                />

                <Field
                  label="End Point"
                  value={itinerary.endPoint}
                  onChange={(value) =>
                    update("endPoint", value)
                  }
                  placeholder="Bengaluru"
                />

                <NumberField
                  label="Total Distance (KM)"
                  value={itinerary.totalDistanceKm}
                  onChange={(value) =>
                    update("totalDistanceKm", value)
                  }
                />
              </div>
            </BuilderSection>

            {/* DESCRIPTION */}

            <BuilderSection
              title="Overview"
              number="02"
              open={openSections.overview}
              onToggle={() =>
                toggleSection("overview")
              }
              action={
                <AIButton
                  loading={aiLoading === "description"}
                  onClick={() =>
                    generateAI("description")
                  }
                >
                  Improve with AI
                </AIButton>
              }
            >
              <TextArea
                label="Description"
                value={itinerary.description}
                onChange={(value) =>
                  update("description", value)
                }
                placeholder="Describe the journey, its pace, character and what makes it different..."
                rows={8}
              />

              <div className="mt-5">
                <TextArea
                  label="Philosophy Introduction"
                  value={itinerary.philosophyIntro}
                  onChange={(value) =>
                    update("philosophyIntro", value)
                  }
                  placeholder="Explain the philosophy behind this expedition..."
                  rows={5}
                />
              </div>
            </BuilderSection>

            {/* HIGHLIGHTS */}

            <BuilderSection
              title="Highlights"
              number="03"
              open={openSections.highlights}
              onToggle={() =>
                toggleSection("highlights")
              }
              action={
                <div className="flex gap-2">
                  <AIButton
                    loading={
                      aiLoading === "highlights"
                    }
                    onClick={() =>
                      generateAI("highlights")
                    }
                  >
                    <Sparkles size={14} />
                    AI Suggest
                  </AIButton>

                  <button
                    onClick={addHighlight}
                    className="flex items-center gap-1 rounded-lg border border-[#333] px-3 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500 hover:text-white"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                {itinerary.highlights.map(
                  (highlight, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-[#2A2A2A] bg-[#151515] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <Field
                            label={`Highlight ${
                              index + 1
                            }`}
                            value={highlight.title}
                            onChange={(value) => {
                              const highlights = [
                                ...itinerary.highlights,
                              ];

                              highlights[index] = {
                                ...highlights[index],
                                title: value,
                              };

                              update(
                                "highlights",
                                highlights
                              );
                            }}
                            placeholder="Rainforest immersion"
                          />

                          <TextArea
                            label="Description"
                            value={highlight.text}
                            onChange={(value) => {
                              const highlights = [
                                ...itinerary.highlights,
                              ];

                              highlights[index] = {
                                ...highlights[index],
                                text: value,
                              };

                              update(
                                "highlights",
                                highlights
                              );
                            }}
                            placeholder="Describe the highlight..."
                            rows={3}
                          />
                        </div>

                        <button
                          onClick={() =>
                            removeHighlight(index)
                          }
                          className="mt-7 text-zinc-600 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )
                )}

                {itinerary.highlights.length ===
                  0 && (
                  <EmptyState>
                    Add highlights or let AI
                    suggest them.
                  </EmptyState>
                )}
              </div>
            </BuilderSection>

            {/* PHILOSOPHY */}

            <BuilderSection
              title="Travel Philosophy"
              number="04"
              open={openSections.philosophy}
              onToggle={() =>
                toggleSection("philosophy")
              }
            >
              <div className="space-y-4">
                {itinerary.pillars.map(
                  (pillar, index) => (
                    <div
                      key={index}
                      className="grid gap-4 md:grid-cols-[220px_1fr]"
                    >
                      <Field
                        label={`Pillar ${
                          index + 1
                        }`}
                        value={pillar.title}
                        onChange={(value) => {
                          const pillars = [
                            ...itinerary.pillars,
                          ];

                          pillars[index] = {
                            ...pillars[index],
                            title: value,
                          };

                          update(
                            "pillars",
                            pillars
                          );
                        }}
                        placeholder="Small groups"
                      />

                      <TextArea
                        label="Explanation"
                        value={pillar.text}
                        onChange={(value) => {
                          const pillars = [
                            ...itinerary.pillars,
                          ];

                          pillars[index] = {
                            ...pillars[index],
                            text: value,
                          };

                          update(
                            "pillars",
                            pillars
                          );
                        }}
                        placeholder="Explain this principle..."
                        rows={3}
                      />
                    </div>
                  )
                )}

                <button
                  onClick={() =>
                    update("pillars", [
                      ...itinerary.pillars,
                      {
                        title: "",
                        text: "",
                      },
                    ])
                  }
                  className="flex items-center gap-2 text-xs font-bold text-[#E8820C]"
                >
                  <Plus size={14} />
                  Add philosophy pillar
                </button>
              </div>
            </BuilderSection>

            {/* DAY BY DAY */}

            <BuilderSection
              title="Day-by-Day Itinerary"
              number="05"
              open={openSections.itinerary}
              onToggle={() =>
                toggleSection("itinerary")
              }
              action={
                <div className="flex gap-2">
                  <AIButton
                    loading={aiLoading === "day"}
                    onClick={() =>
                      generateAI("day")
                    }
                  >
                    <Sparkles size={14} />
                    AI Suggest
                  </AIButton>

                  <button
                    onClick={addPhase}
                    className="flex items-center gap-1 rounded-lg border border-[#333] px-3 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500"
                  >
                    <Plus size={14} />
                    Phase
                  </button>
                </div>
              }
            >
              <div className="space-y-8">
                {itinerary.phases.map(
                  (phase, phaseIndex) => (
                    <div key={phaseIndex}>
                      <div className="mb-4 grid gap-4 md:grid-cols-2">
                        <Field
                          label="Phase Title"
                          value={phase.phaseTitle}
                          onChange={(value) => {
                            const phases = [
                              ...itinerary.phases,
                            ];

                            phases[phaseIndex] = {
                              ...phases[phaseIndex],
                              phaseTitle: value,
                            };

                            update(
                              "phases",
                              phases
                            );
                          }}
                          placeholder="Arrival & Forest Entry"
                        />

                        <Field
                          label="Day Range"
                          value={phase.dayRangeLabel}
                          onChange={(value) => {
                            const phases = [
                              ...itinerary.phases,
                            ];

                            phases[phaseIndex] = {
                              ...phases[phaseIndex],
                              dayRangeLabel: value,
                            };

                            update(
                              "phases",
                              phases
                            );
                          }}
                          placeholder="Days 1–2"
                        />
                      </div>

                      <div className="space-y-4">
                        {phase.days.map(
                          (day, dayIndex) => (
                            <div
                              key={dayIndex}
                              className="rounded-xl border border-[#2A2A2A] bg-[#151515] p-5"
                            >
                              <div className="mb-5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
                                  {day.dayLabel}
                                </span>

                                <button
                                  onClick={() =>
                                    removeDay(
                                      phaseIndex,
                                      dayIndex
                                    )
                                  }
                                  className="text-zinc-600 hover:text-red-400"
                                >
                                  <Trash2
                                    size={15}
                                  />
                                </button>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <Field
                                  label="Day Label"
                                  value={
                                    day.dayLabel
                                  }
                                  onChange={(value) => {
                                    const phases =
                                      [
                                        ...itinerary.phases,
                                      ];

                                    phases[
                                      phaseIndex
                                    ].days[
                                      dayIndex
                                    ].dayLabel =
                                      value;

                                    update(
                                      "phases",
                                      phases
                                    );
                                  }}
                                  placeholder="Day 1"
                                />

                                <Field
                                  label="Title"
                                  value={
                                    day.title
                                  }
                                  onChange={(value) => {
                                    const phases =
                                      [
                                        ...itinerary.phases,
                                      ];

                                    phases[
                                      phaseIndex
                                    ].days[
                                      dayIndex
                                    ].title =
                                      value;

                                    update(
                                      "phases",
                                      phases
                                    );
                                  }}
                                  placeholder="Arrival in the Western Ghats"
                                />
                              </div>

                              <div className="mt-4">
                                <TextArea
                                  label="Description"
                                  value={
                                    day.description
                                  }
                                  onChange={(value) => {
                                    const phases =
                                      [
                                        ...itinerary.phases,
                                      ];

                                    phases[
                                      phaseIndex
                                    ].days[
                                      dayIndex
                                    ].description =
                                      value;

                                    update(
                                      "phases",
                                      phases
                                    );
                                  }}
                                  placeholder="Write the day narrative..."
                                  rows={5}
                                />
                              </div>

                              <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <Field
                                  label="Distance"
                                  value={
                                    day.distance ||
                                    ""
                                  }
                                  onChange={(value) => {
                                    const phases =
                                      [
                                        ...itinerary.phases,
                                      ];

                                    phases[
                                      phaseIndex
                                    ].days[
                                      dayIndex
                                    ].distance =
                                      value;

                                    update(
                                      "phases",
                                      phases
                                    );
                                  }}
                                  placeholder="8 km"
                                />

                                <Field
                                  label="Altitude"
                                  value={
                                    day.altitude ||
                                    ""
                                  }
                                  onChange={(value) => {
                                    const phases =
                                      [
                                        ...itinerary.phases,
                                      ];

                                    phases[
                                      phaseIndex
                                    ].days[
                                      dayIndex
                                    ].altitude =
                                      value;

                                    update(
                                      "phases",
                                      phases
                                    );
                                  }}
                                  placeholder="1,200 m"
                                />

                                <Field
                                  label="Overnight"
                                  value={
                                    day.overnight ||
                                    ""
                                  }
                                  onChange={(value) => {
                                    const phases =
                                      [
                                        ...itinerary.phases,
                                      ];

                                    phases[
                                      phaseIndex
                                    ].days[
                                      dayIndex
                                    ].overnight =
                                      value;

                                    update(
                                      "phases",
                                      phases
                                    );
                                  }}
                                  placeholder="Forest Lodge"
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        onClick={() =>
                          addDay(phaseIndex)
                        }
                        className="mt-4 flex items-center gap-2 text-xs font-bold text-[#E8820C]"
                      >
                        <Plus size={14} />
                        Add day
                      </button>
                    </div>
                  )
                )}
              </div>
            </BuilderSection>

            {/* PRICING */}

            <BuilderSection
              title="Pricing"
              number="06"
              open={openSections.pricing}
              onToggle={() =>
                toggleSection("pricing")
              }
              action={
                <div className="flex gap-2">
                  <AIButton
                    loading={aiLoading === "pricing"}
                    onClick={() =>
                      generateAI("pricing")
                    }
                  >
                    <Sparkles size={14} />
                    AI Pricing
                  </AIButton>

                  <button
                    onClick={addPricingItem}
                    className="flex items-center gap-1 rounded-lg border border-[#333] px-3 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500"
                  >
                    <Plus size={14} />
                    Add Cost
                  </button>
                </div>
              }
            >
              <div className="mb-5 grid gap-4 md:grid-cols-3">
                <Field
                  label="Currency"
                  value={itinerary.pricing.currency}
                  onChange={(value) =>
                    update("pricing", {
                      ...itinerary.pricing,
                      currency: value,
                    })
                  }
                  placeholder="INR"
                />
              </div>

              <div className="space-y-3">
                {itinerary.pricing.lineItems.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_160px_40px] items-end gap-3"
                    >
                      <Field
                        label={
                          index === 0
                            ? "Cost Item"
                            : ""
                        }
                        value={item.label}
                        onChange={(value) =>
                          updatePricing(
                            index,
                            "label",
                            value
                          )
                        }
                        placeholder="Accommodation"
                      />

                      <NumberField
                        label={
                          index === 0
                            ? "Amount"
                            : ""
                        }
                        value={item.amount}
                        onChange={(value) =>
                          updatePricing(
                            index,
                            "amount",
                            value
                          )
                        }
                      />

                      <button
                        onClick={() =>
                          removePricingItem(index)
                        }
                        className="mb-2 text-zinc-600 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#2A2A2A] pt-5">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                  Total per person
                </span>

                <span className="text-2xl font-black text-[#E8820C]">
                  {itinerary.pricing.currency}{" "}
                  {itinerary.pricing.totalPerPerson.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="mt-5">
                <TextArea
                  label="Pricing Disclaimer"
                  value={
                    itinerary.pricing.disclaimer
                  }
                  onChange={(value) =>
                    update("pricing", {
                      ...itinerary.pricing,
                      disclaimer: value,
                    })
                  }
                  placeholder="Prices may change based on..."
                  rows={3}
                />
              </div>
            </BuilderSection>

            {/* INCLUSIONS */}

            <BuilderSection
              title="Inclusions & Exclusions"
              number="07"
              open={openSections.inclusions}
              onToggle={() =>
                toggleSection("inclusions")
              }
            >
              <div className="grid gap-8 md:grid-cols-2">
                <StringListEditor
                  title="Included"
                  items={itinerary.inclusions}
                  onChange={(items) =>
                    update("inclusions", items)
                  }
                />

                <StringListEditor
                  title="Not Included"
                  items={itinerary.exclusions}
                  onChange={(items) =>
                    update("exclusions", items)
                  }
                />
              </div>
            </BuilderSection>
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="lg:sticky lg:top-[82px] lg:h-fit">
            <div className="space-y-5">
              {/* QUICK SUMMARY */}

              <div className="rounded-xl border border-[#2A2A2A] bg-[#121212] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.25em]">
                    Expedition Summary
                  </h3>

                  <Sparkles
                    size={15}
                    className="text-[#E8820C]"
                  />
                </div>

                <div className="space-y-3">
                  <SummaryRow
                    label="Destination"
                    value={
                      itinerary.destination ||
                      "Not set"
                    }
                  />

                  <SummaryRow
                    label="Duration"
                    value={`${itinerary.durationDays} days`}
                  />

                  <SummaryRow
                    label="Distance"
                    value={`${itinerary.totalDistanceKm || 0} km`}
                  />

                  <SummaryRow
                    label="Price"
                    value={`${itinerary.pricing.currency} ${itinerary.pricing.totalPerPerson.toLocaleString(
                      "en-IN"
                    )}`}
                  />
                </div>
              </div>

              {/* AI ASSISTANT */}

              <div className="rounded-xl border border-[#2A2A2A] bg-[#121212] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8820C] text-black">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black">
                      AI Co-Builder
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      AI can suggest descriptions,
                      days, highlights and pricing.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    onClick={() =>
                      generateAI("suggest")
                    }
                    disabled={!!aiLoading}
                    className="w-full rounded-lg border border-[#333] px-3 py-3 text-left text-xs font-bold text-zinc-300 hover:border-[#E8820C] hover:text-white disabled:opacity-50"
                  >
                    Get suggestions
                  </button>

                  <button
                    onClick={() =>
                      generateAI("improve")
                    }
                    disabled={!!aiLoading}
                    className="w-full rounded-lg border border-[#333] px-3 py-3 text-left text-xs font-bold text-zinc-300 hover:border-[#E8820C] hover:text-white disabled:opacity-50"
                  >
                    Improve current itinerary
                  </button>
                </div>
              </div>

              {/* PREVIEW */}

              <div className="rounded-xl border border-[#2A2A2A] bg-[#121212] p-5">
                <h3 className="text-xs font-black uppercase tracking-[0.25em]">
                  Final Document
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Preview the final A4 itinerary and
                  generate the PDF.
                </p>

                <button
                  onClick={async () => {
                    await saveItinerary();

                    router.push(
                      `/itineraries/${id}/preview`
                    );
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8820C] px-4 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-[#F29420]"
                >
                  <Eye size={15} />
                  Open Preview
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
    </EnhanceContext.Provider>
  );
}

/* -------------------------------------------------- */
/* UI COMPONENTS                                      */
/* -------------------------------------------------- */

function BuilderSection({
  title,
  number,
  open,
  onToggle,
  action,
  children,
}: {
  title: string;
  number: string;
  open: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#242424] bg-[#111111]">
      <div className="flex items-center justify-between gap-4 border-b border-[#242424] px-5 py-4">
        <button
          onClick={onToggle}
          className="flex min-w-0 items-center gap-4 text-left"
        >
          <span className="text-[10px] font-black tracking-[0.25em] text-[#E8820C]">
            {number}
          </span>

          <span className="truncate text-sm font-black uppercase tracking-wide">
            {title}
          </span>

          {open ? (
            <ChevronUp
              size={15}
              className="text-zinc-600"
            />
          ) : (
            <ChevronDown
              size={15}
              className="text-zinc-600"
            />
          )}
        </button>

        {action}
      </div>

      {open && (
        <div className="p-5">
          {children}
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </span>
      )}

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </span>
      )}

      <input
        type="number"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-3 py-3 text-sm text-white outline-none focus:border-[#E8820C]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  enhance = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  enhance?: boolean;
}) {
  const fieldId = useId();

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={fieldId}
          className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </label>
      )}

      <textarea
        id={fieldId}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-lg border border-[#2A2A2A] bg-[#181818] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]"
      />

      {enhance && (
        <EnhanceBar
          label={label}
          value={value}
          onAccept={onChange}
        />
      )}
    </div>
  );
}

function AIButton({
  children,
  loading,
  onClick,
}: {
  children: React.ReactNode;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border border-[#E8820C]/40 bg-[#E8820C]/10 px-3 py-2 text-xs font-bold text-[#E8820C] hover:bg-[#E8820C]/20 disabled:opacity-50"
    >
      {loading ? (
        <Loader2
          size={14}
          className="animate-spin"
        />
      ) : (
        <Sparkles size={14} />
      )}

      {loading ? "Thinking..." : children}
    </button>
  );
}

function EmptyState({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[#333] px-5 py-8 text-center text-xs text-zinc-600">
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#222] pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] uppercase tracking-wider text-zinc-600">
        {label}
      </span>

      <span className="text-xs font-bold text-zinc-300">
        {value}
      </span>
    </div>
  );
}

function StringListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  function add() {
    onChange([...items, ""]);
  }

  function remove(index: number) {
    onChange(
      items.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function update(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">
          {title}
        </h3>

        <button
          onClick={add}
          className="text-[#E8820C]"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-2"
          >
            <input
              value={item}
              onChange={(event) =>
                update(index, event.target.value)
              }
              placeholder="Add item..."
              className="min-w-0 flex-1 rounded-lg border border-[#2A2A2A] bg-[#181818] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]"
            />

            <button
              onClick={() => remove(index)}
              className="px-2 text-zinc-600 hover:text-red-400"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <EmptyState>
            Nothing added yet.
          </EmptyState>
        )}
      </div>
    </div>
  );
}
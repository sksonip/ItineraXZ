"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  Menu,
  Save,
  Sparkles,
} from "lucide-react";

import BuilderHeader from "@/components/builder/builder-header";
import BuilderSidebar, {
  type BuilderSection,
} from "@/components/builder/builder-sider";

import TripDetails, {
  type TripDetailsData,
} from "@/components/itinerary/sections/trip-details";

import Pricing, {
  type PricingData,
} from "@/components/itinerary/sections/pricing";

import Safety, {
  type SafetyItem,
} from "@/components/itinerary/sections/safety";

/* ================================================== */
/* TYPES                                              */
/* ================================================== */

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

  const [data, setData] =
    useState<ItineraryData>(() => ({
      ...defaultData,
      ...initialData,
      tripDetails: {
        ...defaultData.tripDetails,
        ...initialData?.tripDetails,
      },
      overview: {
        ...defaultData.overview,
        ...initialData?.overview,
      },
      pricing: {
        ...defaultData.pricing,
        ...initialData?.pricing,
      },
    }));

  const [activeSection, setActiveSection] =
    useState<BuilderSection>(
      "trip-details"
    );

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [dirty, setDirty] =
    useState(false);

  /* ================================================== */
  /* UPDATE DATA                                       */
  /* ================================================== */

  const updateData = useCallback(
    <K extends keyof ItineraryData>(
      key: K,
      value: ItineraryData[K]
    ) => {
      setData((current) => ({
        ...current,
        [key]: value,
      }));

      setDirty(true);
      setSaved(false);
    },
    []
  );

  /* ================================================== */
  /* COMPLETED SECTIONS                                */
  /* ================================================== */

  const completedSections =
    useMemo<BuilderSection[]>(() => {
      const completed: BuilderSection[] = [];

      const trip = data.tripDetails;

      if (
        trip.destination &&
        trip.duration > 0
      ) {
        completed.push("trip-details");
      }

      if (
        data.overview.title &&
        data.overview.description
      ) {
        completed.push("overview");
      }

      if (data.days.length > 0) {
        completed.push("days");
      }

      if (data.inclusions.length > 0) {
        completed.push("inclusions");
      }

      if (data.exclusions.length > 0) {
        completed.push("exclusions");
      }

      if (data.accommodations.length > 0) {
        completed.push("accommodations");
      }

      if (data.advantages.length > 0) {
        completed.push("advantages");
      }

      if (data.philosophy.trim()) {
        completed.push("philosophy");
      }

      if (data.pricing.basePrice > 0) {
        completed.push("pricing");
      }

      if (data.safety.length > 0) {
        completed.push("safety");
      }

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
        itineraryId
          ? `/api/itineraries/${itineraryId}`
          : "/api/itineraries",
        {
          method: itineraryId
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save itinerary"
        );
      }

      const result =
        await response.json();

      setSaved(true);
      setDirty(false);

      /*
       * If this was a new itinerary and
       * the API returned an ID, update
       * the browser URL.
       */

      if (
        !itineraryId &&
        result?.id
      ) {
        router.replace(
          `/itineraries/${result.id}`
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save itinerary."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================================== */
  /* AI SUGGESTION                                     */
  /* ================================================== */

  const handleAiSuggest =
    async () => {
      if (aiLoading) return;

      setAiLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/ai/suggest",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              tripDetails:
                data.tripDetails,

              overview:
                data.overview,

              days: data.days,

              pricing:
                data.pricing,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "AI suggestion failed"
          );
        }

        const result =
          await response.json();

        /*
         * AI should suggest changes.
         * It does NOT directly overwrite
         * the whole itinerary.
         */

        if (result?.overview) {
          setData((current) => ({
            ...current,

            overview: {
              ...current.overview,
              ...result.overview,
            },
          }));

          setDirty(true);
          setSaved(false);
        }

        if (result?.days) {
          setData((current) => ({
            ...current,

            days: result.days,
          }));

          setDirty(true);
          setSaved(false);
        }
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "AI suggestion failed."
        );
      } finally {
        setAiLoading(false);
      }
    };

  /* ================================================== */
  /* AI PRICING                                       */
  /* ================================================== */

  const handleAiPricing =
    async () => {
      if (aiLoading) return;

      setAiLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/ai/pricing",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              tripDetails:
                data.tripDetails,

              days: data.days,

              accommodations:
                data.accommodations,

              currentPricing:
                data.pricing,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Pricing suggestion failed"
          );
        }

        const result =
          await response.json();

        if (
          typeof result?.adjustment ===
          "number"
        ) {
          updateData("pricing", {
            ...data.pricing,
            adjustment:
              result.adjustment,
          });
        }
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to calculate pricing."
        );
      } finally {
        setAiLoading(false);
      }
    };

  /* ================================================== */
  /* SECTION NAVIGATION                                */
  /* ================================================== */

  const scrollToSection = (
    section: BuilderSection
  ) => {
    setActiveSection(section);
    setSidebarOpen(false);

    document
      .getElementById(section)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /* ================================================== */
  /* RENDER                                            */
  /* ================================================== */

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <div className="flex min-h-screen">
        {/* SIDEBAR */}

        <BuilderSidebar
          activeSection={activeSection}
          completedSections={
            completedSections
          }
          open={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
          onSectionChange={
            scrollToSection
          }
          aiEnabled
        />

        {/* MAIN */}

        <main className="min-w-0 flex-1">
          {/* HEADER */}

          <BuilderHeader
            title={
              data.overview.title ||
              "Itinerary Builder"
            }
            subtitle={
              data.tripDetails
                .destination ||
              "Build your travel experience"
            }
            dirty={dirty}
            saving={saving}
            onBack={() =>
              router.back()
            }
            onSave={handleSave}
            onPreview={() => {
              if (itineraryId) {
                router.push(
                  `/itineraries/${itineraryId}/preview`
                );
              }
            }}
            onAiSuggest={
              handleAiSuggest
            }
          />

          {/* MOBILE TOOLBAR */}

          <div className="sticky top-[68px] z-30 border-b border-[#292929] bg-[#0D0D0D] px-4 py-2 lg:hidden">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="flex items-center gap-2 rounded-lg border border-[#292929] bg-[#151515] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-zinc-500"
            >
              <Menu size={13} />
              Sections
            </button>
          </div>

          {/* CONTENT */}

          <div className="mx-auto w-full max-w-[1100px] space-y-5 p-4 md:p-6 lg:p-8">
            {/* ERROR */}

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-[10px] font-bold text-red-400">
                {error}
              </div>
            )}

            {/* SAVED */}

            {saved && !dirty && (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/15 bg-green-500/5 px-4 py-3 text-[10px] font-bold text-green-400">
                <Check size={13} />
                Itinerary saved successfully.
              </div>
            )}

            {/* ======================================== */}
            {/* TRIP DETAILS                            */}
            {/* ======================================== */}

            <BuilderSection
              id="trip-details"
              title="Trip Details"
            >
              <TripDetails
                tripDetails={
                  data.tripDetails
                }
                onChange={(value) =>
                  updateData(
                    "tripDetails",
                    value
                  )
                }
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* OVERVIEW                                */}
            {/* ======================================== */}

            <BuilderSection
              id="overview"
              title="Overview"
            >
              <OverviewEditor
                value={data.overview}
                onChange={(value) =>
                  updateData(
                    "overview",
                    value
                  )
                }
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* DAYS                                    */}
            {/* ======================================== */}

            <BuilderSection
              id="days"
              title="Itinerary"
            >
              <DaysEditor
                days={data.days}
                onChange={(value) =>
                  updateData(
                    "days",
                    value
                  )
                }
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* INCLUSIONS                              */}
            {/* ======================================== */}

            <BuilderSection
              id="inclusions"
              title="Inclusions"
            >
              <ListEditor
                title="What's included"
                items={data.inclusions}
                onChange={(value) =>
                  updateData(
                    "inclusions",
                    value
                  )
                }
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* EXCLUSIONS                              */}
            {/* ======================================== */}

            <BuilderSection
              id="exclusions"
              title="Exclusions"
            >
              <ListEditor
                title="What's not included"
                items={data.exclusions}
                onChange={(value) =>
                  updateData(
                    "exclusions",
                    value
                  )
                }
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* ACCOMMODATIONS                          */}
            {/* ======================================== */}

            <BuilderSection
              id="accommodations"
              title="Accommodations"
            >
              <AccommodationEditor
                accommodations={
                  data.accommodations
                }
                onChange={(value) =>
                  updateData(
                    "accommodations",
                    value
                  )
                }
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* ADVANTAGES                              */}
            {/* ======================================== */}

            <BuilderSection
              id="advantages"
              title="Advantages"
            >
              <ListEditor
                title="Why choose this itinerary"
                items={data.advantages}
                onChange={(value) =>
                  updateData(
                    "advantages",
                    value
                  )
                }
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* PHILOSOPHY                              */}
            {/* ======================================== */}

            <BuilderSection
              id="philosophy"
              title="Travel Philosophy"
            >
              <textarea
                value={data.philosophy}
                onChange={(event) =>
                  updateData(
                    "philosophy",
                    event.target.value
                  )
                }
                placeholder="Describe the philosophy behind this journey..."
                rows={6}
                className={textareaClass}
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* PRICING                                 */}
            {/* ======================================== */}

            <BuilderSection
              id="pricing"
              title="Pricing"
            >
              <Pricing
                pricing={data.pricing}
                onChange={(value) =>
                  updateData(
                    "pricing",
                    value
                  )
                }
                onSuggestPrice={
                  handleAiPricing
                }
                aiLoading={aiLoading}
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* SAFETY                                  */}
            {/* ======================================== */}

            <BuilderSection
              id="safety"
              title="Safety"
            >
              <Safety
                safety={data.safety}
                onChange={(value) =>
                  updateData(
                    "safety",
                    value
                  )
                }
              />
            </BuilderSection>

            {/* ======================================== */}
            {/* BOTTOM SAVE                             */}
            {/* ======================================== */}

            <div className="flex items-center justify-between border-t border-[#292929] pt-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-700">
                  Builder status
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  {dirty
                    ? "You have unsaved changes."
                    : "All changes are saved."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving || !dirty
                }
                className="flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black transition hover:bg-[#F28F19] disabled:cursor-not-allowed disabled:opacity-30"
              >
                {saving ? (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={13} />
                )}

                {saving
                  ? "Saving..."
                  : "Save itinerary"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================================================== */
/* BUILDER SECTION                                    */
/* ================================================== */

function BuilderSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28"
    >
      {children}
    </section>
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
  onChange: (
    value: ItineraryOverview
  ) => void;
}) {
  return (
    <div className="rounded-xl border border-[#292929] bg-[#111111] p-5 md:p-6">
      <div className="space-y-5">
        <div>
          <label className={labelClass}>
            Title
          </label>

          <input
            value={value.title}
            onChange={(event) =>
              onChange({
                ...value,
                title:
                  event.target.value,
              })
            }
            placeholder="7 Days in Kerala"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Description
          </label>

          <textarea
            value={value.description}
            onChange={(event) =>
              onChange({
                ...value,
                description:
                  event.target.value,
              })
            }
            placeholder="Describe the overall journey..."
            rows={6}
            className={textareaClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Highlights
          </label>

          <textarea
            value={value.highlights.join(
              "\n"
            )}
            onChange={(event) =>
              onChange({
                ...value,
                highlights:
                  event.target.value
                    .split("\n")
                    .map((item) =>
                      item.trim()
                    )
                    .filter(Boolean),
              })
            }
            placeholder={
              "Backwater cruise\nTea plantations\nPrivate transfers"
            }
            rows={5}
            className={textareaClass}
          />

          <p className={hintClass}>
            Add one highlight per line.
          </p>
        </div>
      </div>
    </div>
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
  onChange: (
    days: ItineraryDay[]
  ) => void;
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

  function updateDay(
    id: string,
    updates: Partial<ItineraryDay>
  ) {
    onChange(
      days.map((day) =>
        day.id === id
          ? {
              ...day,
              ...updates,
            }
          : day
      )
    );
  }

  function removeDay(id: string) {
    onChange(
      days
        .filter((day) => day.id !== id)
        .map((day, index) => ({
          ...day,
          day: index + 1,
        }))
    );
  }

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <div
          key={day.id}
          className="rounded-xl border border-[#292929] bg-[#111111] p-5 md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#E8820C]">
                Day {day.day}
              </p>

              <p className="mt-1 text-[9px] text-zinc-700">
                Build the activities for this day.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                removeDay(day.id)
              }
              className="text-[9px] font-black uppercase tracking-wider text-zinc-700 hover:text-red-400"
            >
              Remove
            </button>
          </div>

          <div className="space-y-4">
            <input
              value={day.title}
              onChange={(event) =>
                updateDay(day.id, {
                  title:
                    event.target.value,
                })
              }
              placeholder="Day title"
              className={inputClass}
            />

            <input
              value={day.location || ""}
              onChange={(event) =>
                updateDay(day.id, {
                  location:
                    event.target.value,
                })
              }
              placeholder="Location"
              className={inputClass}
            />

            <textarea
              value={day.description}
              onChange={(event) =>
                updateDay(day.id, {
                  description:
                    event.target.value,
                })
              }
              placeholder="Describe the day's experience..."
              rows={5}
              className={textareaClass}
            />

            <textarea
              value={(
                day.activities || []
              ).join("\n")}
              onChange={(event) =>
                updateDay(day.id, {
                  activities:
                    event.target.value
                      .split("\n")
                      .map((item) =>
                        item.trim()
                      )
                      .filter(Boolean),
                })
              }
              placeholder={
                "Breakfast\nVisit tea plantation\nSunset viewpoint"
              }
              rows={4}
              className={textareaClass}
            />

            <p className={hintClass}>
              Add one activity per line.
            </p>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addDay}
        className="w-full rounded-lg border border-dashed border-[#292929] py-3 text-[9px] font-black uppercase tracking-wider text-zinc-600 hover:border-[#E8820C] hover:text-[#E8820C]"
      >
        + Add day
      </button>
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
  onChange: (
    items: ItineraryListItem[]
  ) => void;
}) {
  function addItem() {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        text: "",
      },
    ]);
  }

  function updateItem(
    id: string,
    text: string
  ) {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              text,
            }
          : item
      )
    );
  }

  function removeItem(id: string) {
    onChange(
      items.filter(
        (item) => item.id !== id
      )
    );
  }

  return (
    <div className="rounded-xl border border-[#292929] bg-[#111111] p-5 md:p-6">
      <div className="mb-5">
        <h3 className="text-xs font-black text-white">
          {title}
        </h3>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2"
          >
            <span className="w-6 text-center text-[9px] font-black text-zinc-700">
              {index + 1}
            </span>

            <input
              value={item.text}
              onChange={(event) =>
                updateItem(
                  item.id,
                  event.target.value
                )
              }
              placeholder="Enter item..."
              className={inputClass}
            />

            <button
              type="button"
              onClick={() =>
                removeItem(item.id)
              }
              className="px-2 text-zinc-700 hover:text-red-400"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-4 w-full rounded-lg border border-dashed border-[#292929] py-3 text-[9px] font-black uppercase tracking-wider text-zinc-600 hover:border-[#E8820C] hover:text-[#E8820C]"
      >
        + Add item
      </button>
    </div>
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
  onChange: (
    accommodations: Accommodation[]
  ) => void;
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

  function updateAccommodation(
    id: string,
    updates: Partial<Accommodation>
  ) {
    onChange(
      accommodations.map(
        (accommodation) =>
          accommodation.id === id
            ? {
                ...accommodation,
                ...updates,
              }
            : accommodation
      )
    );
  }

  function removeAccommodation(
    id: string
  ) {
    onChange(
      accommodations.filter(
        (item) => item.id !== id
      )
    );
  }

  return (
    <div className="space-y-4">
      {accommodations.map(
        (accommodation, index) => (
          <div
            key={accommodation.id}
            className="rounded-xl border border-[#292929] bg-[#111111] p-5 md:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">
                Stay {index + 1}
              </p>

              <button
                type="button"
                onClick={() =>
                  removeAccommodation(
                    accommodation.id
                  )
                }
                className="text-[9px] font-black uppercase tracking-wider text-zinc-700 hover:text-red-400"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={accommodation.name}
                onChange={(event) =>
                  updateAccommodation(
                    accommodation.id,
                    {
                      name:
                        event.target.value,
                    }
                  )
                }
                placeholder="Hotel / property name"
                className={inputClass}
              />

              <input
                value={
                  accommodation.location
                }
                onChange={(event) =>
                  updateAccommodation(
                    accommodation.id,
                    {
                      location:
                        event.target.value,
                    }
                  )
                }
                placeholder="Location"
                className={inputClass}
              />

              <input
                type="number"
                min={1}
                value={
                  accommodation.nights
                }
                onChange={(event) =>
                  updateAccommodation(
                    accommodation.id,
                    {
                      nights: Math.max(
                        1,
                        Number(
                          event.target
                            .value
                        ) || 1
                      ),
                    }
                  )
                }
                placeholder="Nights"
                className={inputClass}
              />

              <input
                value={
                  accommodation.roomType ||
                  ""
                }
                onChange={(event) =>
                  updateAccommodation(
                    accommodation.id,
                    {
                      roomType:
                        event.target.value,
                    }
                  )
                }
                placeholder="Room type"
                className={inputClass}
              />
            </div>
          </div>
        )
      )}

      <button
        type="button"
        onClick={addAccommodation}
        className="w-full rounded-lg border border-dashed border-[#292929] py-3 text-[9px] font-black uppercase tracking-wider text-zinc-600 hover:border-[#E8820C] hover:text-[#E8820C]"
      >
        + Add accommodation
      </button>
    </div>
  );
}

/* ================================================== */
/* STYLES                                             */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]";

const textareaClass =
  "w-full resize-none rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-medium leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]";

const labelClass =
  "mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600";

const hintClass =
  "mt-1.5 text-[9px] leading-4 text-zinc-700";
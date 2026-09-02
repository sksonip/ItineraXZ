"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  MapPin,
  CalendarDays,
  Users,
  IndianRupee,
  Mountain,
} from "lucide-react";

type FormData = {
  tripName: string;
  destination: string;
  durationDays: number;
  startPoint: string;
  endPoint: string;
  travellers: number;
  budget: number;
  style: string;
  description: string;
};

const initialForm: FormData = {
  tripName: "",
  destination: "",
  durationDays: 5,
  startPoint: "",
  endPoint: "",
  travellers: 2,
  budget: 0,
  style: "Adventure",
  description: "",
};

const travelStyles = [
  "Adventure",
  "Luxury",
  "Relaxed",
  "Family",
  "Wellness",
  "Cultural",
  "Nature",
  "Photography",
];

export default function NewItineraryPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>(initialForm);
  const [creating, setCreating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function getAISuggestion() {
    if (!form.destination.trim()) {
      setError(
        "Enter a destination first so Gemini has something useful to work with."
      );
      return;
    }

    try {
      setError("");
      setAiLoading(true);

      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: form.destination,
          durationDays: form.durationDays,
          travellers: form.travellers,
          budget: form.budget,
          style: form.style,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate suggestions."
        );
      }

      /*
       * Support a few common response shapes so the page
       * doesn't break if the suggest API returns:
       *
       * { suggestion: "..." }
       * { description: "..." }
       * { suggestions: { description: "..." } }
       */

      const suggestion =
        typeof data.suggestion === "string"
          ? data.suggestion
          : typeof data.description === "string"
            ? data.description
            : typeof data.suggestions?.description === "string"
              ? data.suggestions.description
              : "";

      if (suggestion) {
        updateField("description", suggestion);
      }

      if (typeof data.tripName === "string") {
        updateField("tripName", data.tripName);
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
  }

  async function createItinerary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.tripName.trim()) {
      setError("Trip name is required.");
      return;
    }

    if (!form.destination.trim()) {
      setError("Destination is required.");
      return;
    }

    if (form.durationDays < 1) {
      setError("Duration must be at least 1 day.");
      return;
    }

    try {
      setError("");
      setCreating(true);

      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripName: form.tripName.trim(),
          destination: form.destination.trim(),
          durationDays: form.durationDays,
          startPoint: form.startPoint.trim(),
          endPoint: form.endPoint.trim(),
          travellers: form.travellers,
          budget: form.budget,
          style: form.style,
          description: form.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create itinerary."
        );
      }

      const createdId =
        data.itinerary?.id ||
        data.id ||
        data.itineraryId;

      if (!createdId) {
        throw new Error(
          "Itinerary was created but no ID was returned by the API."
        );
      }

      router.push(`/itineraries/${createdId}`);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create itinerary."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* HEADER */}

      <header className="border-b border-[#242424] bg-[#0D0D0D]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={() => router.push("/itineraries")}
            className="flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to itineraries
          </button>

          <div className="hidden text-center sm:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              Itinerary Builder
            </p>

            <p className="text-sm font-black">
              New Expedition
            </p>
          </div>

          <div className="w-[130px]" />
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#E8820C]">
            Start building
          </p>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Create an itinerary.
          </h1>

          <p className="mt-4 text-sm leading-6 text-zinc-500 md:text-base">
            Give us the basic shape of the trip. You can
            refine every day, description and price in the
            builder afterwards.
          </p>
        </div>

        <form
          onSubmit={createItinerary}
          className="grid gap-6 lg:grid-cols-[1fr_300px]"
        >
          {/* MAIN FORM */}

          <div className="space-y-5">
            {/* TRIP BASICS */}

            <section className="rounded-xl border border-[#242424] bg-[#111111] p-5 md:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
                  01
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Trip basics
                </h2>
              </div>

              <div className="space-y-5">
                <Input
                  label="Trip name"
                  placeholder="Coorg Monsoon Expedition"
                  value={form.tripName}
                  onChange={(value) =>
                    updateField("tripName", value)
                  }
                  required
                />

                <Input
                  label="Destination"
                  placeholder="Coorg, Karnataka"
                  value={form.destination}
                  onChange={(value) =>
                    updateField("destination", value)
                  }
                  required
                  icon={<MapPin size={15} />}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <NumberInput
                    label="Duration"
                    suffix="days"
                    value={form.durationDays}
                    min={1}
                    onChange={(value) =>
                      updateField("durationDays", value)
                    }
                    icon={<CalendarDays size={15} />}
                  />

                  <NumberInput
                    label="Travellers"
                    suffix="people"
                    value={form.travellers}
                    min={1}
                    onChange={(value) =>
                      updateField("travellers", value)
                    }
                    icon={<Users size={15} />}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Starting point"
                    placeholder="Bengaluru"
                    value={form.startPoint}
                    onChange={(value) =>
                      updateField("startPoint", value)
                    }
                  />

                  <Input
                    label="End point"
                    placeholder="Bengaluru"
                    value={form.endPoint}
                    onChange={(value) =>
                      updateField("endPoint", value)
                    }
                  />
                </div>
              </div>
            </section>

            {/* TRAVEL STYLE */}

            <section className="rounded-xl border border-[#242424] bg-[#111111] p-5 md:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
                  02
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Travel style
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                  This helps Gemini make better suggestions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {travelStyles.map((style) => {
                  const selected =
                    form.style === style;

                  return (
                    <button
                      type="button"
                      key={style}
                      onClick={() =>
                        updateField("style", style)
                      }
                      className={`rounded-lg border px-3 py-3 text-xs font-bold transition ${
                        selected
                          ? "border-[#E8820C] bg-[#E8820C]/10 text-[#E8820C]"
                          : "border-[#292929] bg-[#171717] text-zinc-500 hover:border-[#444] hover:text-white"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* BUDGET */}

            <section className="rounded-xl border border-[#242424] bg-[#111111] p-5 md:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
                  03
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Budget
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                  Optional. The builder can adjust pricing
                  later.
                </p>
              </div>

              <NumberInput
                label="Target budget per person"
                suffix="INR"
                value={form.budget}
                min={0}
                onChange={(value) =>
                  updateField("budget", value)
                }
                icon={<IndianRupee size={15} />}
              />
            </section>

            {/* DESCRIPTION */}

            <section className="rounded-xl border border-[#242424] bg-[#111111] p-5 md:p-7">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
                    04
                  </p>

                  <h2 className="mt-1 text-lg font-black">
                    Describe the trip
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Tell Gemini what you want. Rough notes
                    are completely fine.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={getAISuggestion}
                  disabled={aiLoading}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E8820C]/40 bg-[#E8820C]/10 px-3 py-2.5 text-xs font-black text-[#E8820C] transition hover:bg-[#E8820C]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {aiLoading ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={14} />
                  )}

                  {aiLoading
                    ? "Gemini thinking..."
                    : "AI suggest"}
                </button>
              </div>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Example: I want a slow 5-day trip through Coorg with forests, local food, waterfalls, short hikes and comfortable stays. Avoid tourist traps..."
                rows={8}
                className="w-full resize-y rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C]"
              />

              <p className="mt-2 text-right text-[10px] text-zinc-700">
                {form.description.length} characters
              </p>
            </section>

            {/* ERROR */}

            {error && (
              <div className="rounded-lg border border-red-900/60 bg-red-950/20 px-4 py-3 text-xs leading-5 text-red-400">
                {error}
              </div>
            )}

            {/* CREATE */}

            <button
              type="submit"
              disabled={creating}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#E8820C] px-5 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-[#F29420] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating itinerary...
                </>
              ) : (
                <>
                  Create itinerary
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* SIDEBAR */}

          <aside className="space-y-5">
            <div className="rounded-xl border border-[#242424] bg-[#111111] p-5 lg:sticky lg:top-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8820C] text-black">
                  <Sparkles size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-black">
                    Gemini co-builder
                  </h3>

                  <p className="text-[10px] text-zinc-600">
                    AI-assisted planning
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-5 text-zinc-500">
                <Feature
                  title="Descriptions"
                  text="Turn rough notes into polished itinerary copy."
                />

                <Feature
                  title="Day plans"
                  text="Suggest realistic activities and pacing."
                />

                <Feature
                  title="Highlights"
                  text="Find the strongest selling points of the trip."
                />

                <Feature
                  title="Pricing"
                  text="Adjust costs up or down while you build."
                />
              </div>

              <div className="mt-6 border-t border-[#242424] pt-5">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  <Mountain size={13} />
                  No login required
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

/* -------------------------------------------------- */
/* INPUT COMPONENTS                                   */
/* -------------------------------------------------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
        {icon}
        {label}
        {required && (
          <span className="text-[#E8820C]">*</span>
        )}
      </span>

      <input
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-[#E8820C]"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  suffix,
  icon,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  suffix?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
        {icon}
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) =>
            onChange(
              Math.max(
                min,
                Number(event.target.value)
              )
            )
          }
          className="w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 pr-20 text-sm text-white outline-none transition focus:border-[#E8820C]"
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-zinc-600">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Feature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="font-bold text-zinc-300">
        {title}
      </p>

      <p className="mt-1">
        {text}
      </p>
    </div>
  );
}
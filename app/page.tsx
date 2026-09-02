"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Compass,
  Map,
  Plus,
  Settings,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles size={18} />,
    title: "AI-assisted planning",
    description:
      "Use Gemini Flash to turn rough travel ideas into useful itinerary suggestions.",
  },
  {
    icon: <CalendarDays size={18} />,
    title: "Day-by-day builder",
    description:
      "Build every day with activities, descriptions, timings, locations and pricing.",
  },
  {
    icon: <WandSparkles size={18} />,
    title: "Improve as you build",
    description:
      "Regenerate descriptions, highlights and activities whenever something feels weak.",
  },
  {
    icon: <Map size={18} />,
    title: "Flexible pricing",
    description:
      "Increase or decrease individual costs and keep the complete trip price under control.",
  },
];

export default function HomePage() {
  const router = useRouter();

  function createItinerary() {
    router.push("/itineraries/new");
  }

  function openItineraries() {
    router.push("/itineraries");
  }

  function openSettings() {
    router.push("/settings");
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* NAVBAR */}

      <header className="border-b border-[#242424] bg-[#0D0D0D]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          {/* LOGO */}

          <button
            type="button"
            onClick={() => router.push("/")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8820C] text-black transition group-hover:rotate-3">
              <Compass size={19} strokeWidth={2.5} />
            </div>

            <div className="text-left">
              <p className="text-sm font-black tracking-tight">
                ItineraXZ
              </p>

              <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-700">
                Itinerary Builder
              </p>
            </div>
          </button>

          {/* NAV */}

          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={openItineraries}
              className="hidden rounded-lg px-4 py-2.5 text-xs font-bold text-zinc-500 transition hover:bg-[#181818] hover:text-white sm:block"
            >
              Itineraries
            </button>

            <button
              type="button"
              onClick={openSettings}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-[#181818] hover:text-white"
              aria-label="Settings"
            >
              <Settings size={17} />
            </button>

            <button
              type="button"
              onClick={createItinerary}
              className="flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-xs font-black text-black transition hover:bg-[#F29420]"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">
                New itinerary
              </span>
              <span className="sm:hidden">
                New
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-[#242424]">
        {/* Background grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <div className="max-w-4xl">
            {/* LABEL */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E8820C]/25 bg-[#E8820C]/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8820C]" />

              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
                AI itinerary builder
              </span>
            </div>

            {/* TITLE */}

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-8xl">
              Build trips
              <br />
              <span className="text-[#E8820C]">
                that make sense.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base md:leading-8">
              Create complete travel itineraries from a
              simple idea. Let AI help with descriptions,
              activities and highlights while you control
              the route, schedule and pricing.
            </p>

            {/* ACTIONS */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={createItinerary}
                className="group flex items-center justify-center gap-3 rounded-lg bg-[#E8820C] px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-black transition hover:bg-[#F29420]"
              >
                Start building
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={openItineraries}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#292929] px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-zinc-400 transition hover:border-[#444] hover:text-white"
              >
                View itineraries
                <ChevronRight size={15} />
              </button>
            </div>

            {/* NO LOGIN */}

            <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-zinc-700">
              No account required · Start immediately
            </p>
          </div>
        </div>
      </section>

      {/* QUICK CREATE */}

      <section className="border-b border-[#242424]">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-3 md:grid-cols-3">
            <QuickCard
              number="01"
              title="Describe your trip"
              text="Destination, duration, travellers and the kind of experience you want."
            />

            <QuickCard
              number="02"
              title="Build with AI"
              text="Use Gemini to generate and improve descriptions, days and highlights."
            />

            <QuickCard
              number="03"
              title="Tune the numbers"
              text="Adjust activities and pricing until the itinerary actually works."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#E8820C]">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              More than a trip generator.
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-600">
              ItineraXZ is designed around the actual
              itinerary-building workflow rather than
              dumping an AI-generated wall of text on you.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border border-[#292929] bg-[#292929] md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#111111] p-7 transition hover:bg-[#141414]"
              >
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-[#E8820C]">
                  {feature.icon}
                </div>

                <h3 className="text-sm font-black">
                  {feature.title}
                </h3>

                <p className="mt-3 max-w-md text-xs leading-6 text-zinc-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="border-t border-[#242424]">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="relative overflow-hidden rounded-2xl border border-[#E8820C]/20 bg-[#111111] p-7 md:p-10">
            <div className="relative z-10 max-w-2xl">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#E8820C]">
                Ready?
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Turn the idea into an itinerary.
              </h2>

              <p className="mt-4 text-sm leading-6 text-zinc-600">
                Start with rough notes. You can change
                almost everything later.
              </p>

              <button
                type="button"
                onClick={createItinerary}
                className="mt-7 flex items-center gap-3 rounded-lg bg-[#E8820C] px-5 py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
              >
                Create itinerary
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Decorative element */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#E8820C]/10" />

            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#E8820C]/10" />
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-[#242424]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[10px] text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-black uppercase tracking-[0.2em]">
            ItineraXZ
          </span>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={openItineraries}
              className="transition hover:text-zinc-400"
            >
              Itineraries
            </button>

            <button
              type="button"
              onClick={openSettings}
              className="transition hover:text-zinc-400"
            >
              Settings
            </button>

            <span>
              No account required
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ================================================== */
/* QUICK CARD                                         */
/* ================================================== */

function QuickCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-[#292929] bg-[#111111] p-6">
      <p className="text-[9px] font-black tracking-[0.25em] text-[#E8820C]">
        {number}
      </p>

      <h3 className="mt-4 text-sm font-black">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-zinc-600">
        {text}
      </p>
    </div>
  );
}
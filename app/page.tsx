"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  MapPin,
  Mountain,
  Settings,
  Sparkles,
} from "lucide-react";


export default function HomePage() {
  const router = useRouter();

  function createJourney() {
    router.push("/itineraries/new");
  }

  function openJourneys() {
    router.push("/itineraries");
  }

  function openSettings() {
    router.push("/settings");
  }

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#f4f0e8] text-[#1d211c]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <header className="relative z-10 border-b border-[#1d211c]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="group flex items-center gap-3 text-left"
            aria-label="Bettadajeeva home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d211c] text-[#f4f0e8] transition-transform duration-300 group-hover:-rotate-12">
              <Mountain size={19} strokeWidth={1.8} />
            </span>

            <span>
              <span className="block text-[15px] font-semibold tracking-[-0.04em]">
                Bettadajeeva
              </span>

              <span className="block text-[8px] font-medium uppercase tracking-[0.28em] text-[#1d211c]/50">
                Travel, thoughtfully
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.16em] text-[#1d211c]/60 md:flex">
            <button
              type="button"
              onClick={openJourneys}
              className="transition-colors hover:text-[#b85d35]"
            >
              Journeys
            </button>

            <a
              href="#philosophy"
              className="transition-colors hover:text-[#b85d35]"
            >
              Our approach
            </a>

            <a
              href="#escapes"
              className="transition-colors hover:text-[#b85d35]"
            >
              Escapes
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSettings}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1d211c]/10 text-[#1d211c]/60 transition hover:border-[#1d211c]/30 hover:text-[#1d211c]"
              aria-label="Settings"
            >
              <Settings size={16} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={createJourney}
              className="group flex items-center gap-2 rounded-full bg-[#b85d35] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#974729]"
            >
              Plan a journey

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24 lg:px-12">
        <div className="pointer-events-none absolute -right-28 -top-24 h-[32rem] w-[32rem] rounded-full border border-[#b85d35]/15" />

        <div className="pointer-events-none absolute -right-12 top-0 h-[22rem] w-[22rem] rounded-full border border-[#b85d35]/10" />

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="relative z-[1]">
            <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b85d35]">
              <span className="h-px w-9 bg-[#b85d35]" />
              A Bettadajeeva original
            </div>

            <h1 className="max-w-3xl text-[3.7rem] font-medium leading-[0.93] tracking-[-0.075em] sm:text-7xl lg:text-[6.7rem]">
              Go where the day
              <span className="block font-light italic text-[#b85d35]">
                feels longer.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-[15px] leading-7 text-[#1d211c]/65">
              Beautifully paced journeys for people who want to notice more:
              the warm cup, the unmarked road, the view that was worth taking
              the long way for.
            </p>

            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={createJourney}
                className="group flex items-center gap-4 rounded-full bg-[#1d211c] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f4f0e8] transition hover:bg-[#b85d35]"
              >
                Begin your journey

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f0e8]/15">
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={openJourneys}
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1d211c]/60 underline decoration-[#b85d35]/50 underline-offset-8 transition hover:text-[#b85d35]"
              >
                See your journeys
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[29rem] lg:mr-4">
            <div className="absolute -left-7 top-14 h-28 w-28 rounded-full bg-[#d9a36f]/35 blur-2xl" />

            <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] bg-[#26372f] p-7 text-[#f4f0e8] shadow-[0_24px_80px_rgba(29,33,28,0.14)] sm:min-h-[32rem] sm:p-9">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(244,240,232,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(244,240,232,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />

              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border border-[#d9a36f]/35" />

              <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full border border-[#d9a36f]/25" />

              <div className="relative flex items-start justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#f4f0e8]/60">
                  The next chapter
                </span>

                <Compass
                  size={22}
                  strokeWidth={1.2}
                  className="text-[#d9a36f]"
                />
              </div>

              <div className="relative mt-28">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#d9a36f]">
                  Suggested escape
                </p>

                <h2 className="mt-3 max-w-xs text-4xl font-light leading-[0.98] tracking-[-0.06em] sm:text-5xl">
                  The hills are calling softly.
                </h2>
              </div>

              <div className="relative mt-12 flex items-end justify-between border-t border-[#f4f0e8]/15 pt-5">
                <div>
                  <div className="flex items-center gap-2 text-sm text-[#f4f0e8]/85">
                    <MapPin size={14} className="text-[#d9a36f]" />
                    Coorg, Karnataka
                  </div>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#f4f0e8]/45">
                    Long weekend · monsoon air
                  </p>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f4f0e8]/20">
                  <ArrowUpRight size={17} strokeWidth={1.5} />
                </span>
              </div>
            </div>

            <p className="mt-4 pl-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1d211c]/40">
              Make room for the unexpected.
            </p>
          </div>
        </div>
      </section>

      <section
        id="philosophy"
        className="border-y border-[#1d211c]/10 bg-[#e9e3d8]"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b85d35]">
              The Bettadajeeva way
            </p>

            <h2 className="mt-5 max-w-sm text-4xl font-medium leading-[0.98] tracking-[-0.06em] md:text-5xl">
              Travel is better when it leaves a little room.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-xl font-light leading-8 tracking-[-0.025em] text-[#1d211c]/75 md:text-2xl md:leading-9">
              Bettadajeeva turns a feeling into a considered route. No
              crowded checklists. No racing from one landmark to the next.
              Just enough structure to help you wander well.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#1d211c]/15 pt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d211c]/55">
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#b85d35]" />
                Thoughtful pacing
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-[#b85d35]" />
                Places with character
              </span>

              <span className="flex items-center gap-2">
                <Compass size={14} className="text-[#b85d35]" />
                Space to explore
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="escapes"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24 lg:px-12"
      >
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b85d35]">
              Places to begin
            </p>

            <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] md:text-5xl">
              Find your kind of far.
            </h2>
          </div>

          <button
            type="button"
            onClick={openJourneys}
            className="group flex items-center gap-2 self-start text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1d211c]/60 transition hover:text-[#b85d35] sm:self-auto"
          >
            View all journeys

            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        
      </section>

      <section className="px-5 pb-16 sm:px-8 md:pb-24 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#b85d35] px-6 py-14 text-[#fff8ee] sm:px-12 md:py-20">
          <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border border-white/20" />

          <div className="absolute -right-2 -top-10 h-52 w-52 rounded-full border border-white/15" />

          <div className="relative max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">
              Your next story starts here
            </p>

            <h2 className="mt-5 text-4xl font-medium leading-[0.98] tracking-[-0.06em] md:text-6xl">
              Bring the feeling.
              <span className="block font-light italic">
                We&apos;ll find the way.
              </span>
            </h2>

            <button
              type="button"
              onClick={createJourney}
              className="group mt-9 flex items-center gap-3 rounded-full bg-[#fff8ee] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1d211c] transition hover:bg-[#1d211c] hover:text-[#fff8ee]"
            >
              Create a Bettadajeeva journey

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1d211c]/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-[10px] font-medium uppercase tracking-[0.18em] text-[#1d211c]/45 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span className="font-semibold tracking-[0.08em] text-[#1d211c]">
            Bettadajeeva
          </span>

          <span>Thoughtful travel, one journey at a time.</span>

          <button
            type="button"
            onClick={openSettings}
            className="self-start transition hover:text-[#b85d35] sm:self-auto"
          >
            Settings
          </button>
        </div>
      </footer>
    </main>
  );
}
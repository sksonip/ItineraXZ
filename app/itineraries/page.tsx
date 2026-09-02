"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Loader2,
  MapPin,
  Menu,
  Mountain,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ItinerarySummary = {
  id: string;
  title: string;
  tripName?: string;
  destination: string;
  duration?: string;
  durationDays?: number;
  updatedAt: string;
};

const navItems = ["Journeys", "Our approach", "Escapes"];

export default function ItinerariesPage() {
  const router = useRouter();
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadItineraries() {
      try {
        const response = await fetch("/api/itineraries", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load itineraries.");
        }

        setItineraries(data.itineraries || []);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Failed to load itineraries."
        );
      } finally {
        setLoading(false);
      }
    }

    loadItineraries();
  }, []);

  async function deleteItinerary(itinerary: ItinerarySummary) {
    const name = itinerary.tripName || itinerary.title || "this itinerary";

    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(itinerary.id);
      setError("");

      const response = await fetch(`/api/itineraries/${itinerary.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete itinerary.");
      }

      setItineraries((current) =>
        current.filter((item) => item.id !== itinerary.id)
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Failed to delete itinerary."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#171b18]">
      <header className="relative z-20 border-b border-[#e4dfd5] bg-[#f4f1ea]/95">
        <div className="mx-auto flex h-[92px] max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              aria-label="Go to Bettada Jeeva home page"
              className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#17201b] text-[#f4f1ea] shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c46138]"
            >
              <Mountain size={25} strokeWidth={1.4} />
            </button>

            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#b96139]">
                Bettada Jeeva
              </p>
              <h1 className="mt-1.5 text-xl font-bold tracking-[-0.04em] sm:text-2xl">
                Itineraries
              </h1>
            </div>
          </div>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#68716c] transition-colors hover:text-[#bd5b33]"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/itineraries/new")}
              className="group hidden items-center gap-3 rounded-full bg-[#c46138] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#a94d2c] sm:flex"
            >
              <Plus size={16} strokeWidth={2.2} />
              New itinerary
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ded9cf] text-[#17201b] sm:hidden"
            >
              {menuOpen ? <X size={19} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#e4dfd5] bg-[#f4f1ea] px-6 py-5 sm:hidden">
            <nav className="flex flex-col gap-5">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs font-bold uppercase tracking-[0.17em] text-[#68716c]"
                >
                  {item}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/itineraries/new");
                }}
                className="flex w-fit items-center gap-2 rounded-full bg-[#c46138] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white"
              >
                <Plus size={15} strokeWidth={2.2} />
                New itinerary
              </button>
            </nav>
          </div>
        )}
      </header>

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -right-56 top-4 h-[420px] w-[420px] rounded-full border border-[#e8d8c9] opacity-70" />
        <div className="pointer-events-none absolute -right-12 top-20 h-[300px] w-[300px] rounded-full border border-[#eaded3] opacity-70" />

        <div className="relative z-10 mb-14">
          <div className="mb-5 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#be6039]">
            <span className="h-px w-10 bg-[#be6039]" />
            Saved journeys
          </div>
          <h2 className="text-[clamp(2.6rem,6vw,4.5rem)] font-medium leading-[0.92] tracking-[-0.08em] text-[#171b18]">
            Your itineraries
          </h2>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-sm text-[#68716c]">
            <Loader2 size={18} className="animate-spin text-[#c46138]" />
            Loading itineraries...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-[#e2c4b6] bg-[#f7e3d9] px-5 py-4 text-sm text-[#9a3d1f]">
            {error}
          </div>
        )}

        {!loading && !error && itineraries.length === 0 && (
          <div className="relative z-10 rounded-[32px] border border-dashed border-[#cfc8bc] bg-[#ebe7de] px-8 py-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#17201b] text-[#f4f1ea]">
              <Mountain size={28} strokeWidth={1.3} />
            </div>
            <h3 className="text-2xl font-medium tracking-[-0.04em] text-[#171b18]">
              No itineraries yet
            </h3>
            <p className="mx-auto mt-3 max-w-[400px] text-sm leading-6 text-[#68716c]">
              Start with the Eastern Bhutan template or create a blank trip.
            </p>
            <button
              type="button"
              onClick={() => router.push("/itineraries/new")}
              className="group mt-8 inline-flex items-center gap-5 rounded-full bg-[#17201b] py-2 pl-7 pr-2 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#26372d]"
            >
              Create first itinerary
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c46138] transition group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </button>
          </div>
        )}

        {!loading && itineraries.length > 0 && (
          <div className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <article
                key={itinerary.id}
                className="group relative overflow-hidden rounded-[28px] bg-[#1c332a] p-7 text-[#f1ede3] shadow-[0_18px_60px_rgba(24,34,28,0.14)] transition hover:shadow-[0_24px_80px_rgba(24,34,28,0.22)]"
              >
                <div
                  className="absolute inset-0 opacity-[0.18]"
                  style={{
                    backgroundImage:
                      "linear-gradient(#829285 1px, transparent 1px), linear-gradient(90deg, #829285 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                  }}
                />
                <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full border border-[#d89059]/40" />
                <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full border border-[#d89059]/20" />

                <div className="relative flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/itineraries/${itinerary.id}`)}
                    className="min-w-0 text-left text-xl font-medium leading-tight tracking-[-0.04em] transition hover:text-[#d89059]"
                  >
                    {itinerary.tripName ||
                      itinerary.title ||
                      "Untitled Expedition"}
                  </button>
                  <div className="flex shrink-0 items-center gap-3">
                    <ArrowUpRight
                      size={18}
                      className="text-[#d89059] transition-transform group-hover:rotate-45"
                    />
                    <button
                      type="button"
                      onClick={() => deleteItinerary(itinerary)}
                      disabled={deletingId === itinerary.id}
                      aria-label={`Delete ${
                        itinerary.tripName || itinerary.title
                      }`}
                      title="Delete itinerary"
                      className="rounded-full p-2 text-[#9ca89c] transition hover:bg-[#3a4d42] hover:text-[#e8a06a] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === itinerary.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative mt-8 flex items-center gap-2 text-sm font-medium text-[#c3ccc4]">
                  <MapPin size={15} className="text-[#d89059]" />
                  {itinerary.destination || "Destination not set"}
                </div>

                <p className="relative mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a988e]">
                  {itinerary.durationDays ||
                    itinerary.duration ||
                    "Flexible duration"}
                  {itinerary.durationDays ? " days" : ""}
                </p>

                <div className="relative mt-7 border-t border-[#76877b]/50 pt-5">
                  <button
                    type="button"
                    onClick={() => router.push(`/itineraries/${itinerary.id}`)}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d89059] transition hover:text-[#e8a06a]"
                  >
                    Open itinerary →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

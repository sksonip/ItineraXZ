"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Loader2,
  MapPin,
  Plus,
  Trash2,
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

export default function ItinerariesPage() {
  const router = useRouter();
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    <main className="min-h-screen bg-[#090909] text-white">
      <header className="border-b border-[#242424] bg-[#0D0D0D]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              aria-label="Go to Bettada Jeeva home page"
              className="group shrink-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8820C]"
            >
              <img
                src="/brand/bettada-jeeva-logo.svg"
                alt="Bettada Jeeva home"
                className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
              />
            </button>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E8820C]">
                Bettada Jeeva
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight">
                Itineraries
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/itineraries/new")}
            className="flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
          >
            <Plus size={16} />
            New itinerary
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {loading && (
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <Loader2 size={18} className="animate-spin" />
            Loading itineraries...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-900/60 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && itineraries.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#333] bg-[#111] px-6 py-16 text-center">
            <h2 className="text-xl font-black">No itineraries yet</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Start with the Eastern Bhutan template or create a blank trip.
            </p>
            <button
              type="button"
              onClick={() => router.push("/itineraries/new")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#E8820C] px-4 py-3 text-xs font-black uppercase tracking-wider text-[#E8820C]"
            >
              Create first itinerary
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {!loading && itineraries.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <article
                key={itinerary.id}
                className="group rounded-xl border border-[#292929] bg-[#111] p-5 transition hover:border-[#E8820C]"
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/itineraries/${itinerary.id}`)}
                    className="min-w-0 text-left text-lg font-black hover:text-[#E8820C]"
                  >
                    {itinerary.tripName || itinerary.title || "Untitled Expedition"}
                  </button>
                  <div className="flex shrink-0 items-center gap-3">
                    <ArrowRight
                      size={17}
                      className="text-[#E8820C] transition-transform group-hover:translate-x-1"
                    />
                    <button
                      type="button"
                      onClick={() => deleteItinerary(itinerary)}
                      disabled={deletingId === itinerary.id}
                      aria-label={`Delete ${itinerary.tripName || itinerary.title}`}
                      title="Delete itinerary"
                      className="rounded-md p-1.5 text-zinc-600 transition hover:bg-red-950/40 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === itinerary.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-zinc-500">
                  <MapPin size={14} className="text-[#E8820C]" />
                  {itinerary.destination || "Destination not set"}
                </div>
                <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-zinc-700">
                  {itinerary.durationDays || itinerary.duration || "Flexible duration"}
                  {itinerary.durationDays ? " days" : ""}
                </p>
                <button
                  type="button"
                  onClick={() => router.push(`/itineraries/${itinerary.id}`)}
                  className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 hover:text-[#E8820C]"
                >
                  Open itinerary
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

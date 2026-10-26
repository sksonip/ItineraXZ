"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Check, Loader2, RotateCcw, Sparkles, Undo2, X } from "lucide-react";

/* -------------------------------------------------- */
/* CONTEXT                                            */
/* -------------------------------------------------- */

export type EnhanceContextValue = {
  tripTitle?: string;
  destination?: string;
  travelStyle?: string;
};

export const EnhanceContext = createContext<EnhanceContextValue>({});

/* -------------------------------------------------- */
/* TYPES                                              */
/* -------------------------------------------------- */

type Variant = {
  type: string;
  title: string;
  text: string;
};

const MIN_CHARS = 30;
const NUDGE_AFTER_MS = 1500;

/* -------------------------------------------------- */
/* COMPONENT                                          */
/* -------------------------------------------------- */

/**
 * Sits under a paragraph field. Once the user has written a paragraph it
 * offers an "Enhance" action, shows AI rewrites next to the original and
 * only changes the field when the user clicks Accept.
 */
export function EnhanceBar({
  label,
  value,
  onAccept,
}: {
  label?: string;
  value: string;
  onAccept: (text: string) => void;
}) {
  const context = useContext(EnhanceContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<Variant[] | null>(null);
  const [selected, setSelected] = useState(0);
  const [previous, setPrevious] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const text = value?.trim() ?? "";
  const canEnhance = text.length >= MIN_CHARS;

  // Draw attention to the button once the user pauses after writing a paragraph.
  useEffect(() => {
    setNudge(false);

    if (!canEnhance || variants || previous) return;

    const timer = setTimeout(() => setNudge(true), NUDGE_AFTER_MS);

    return () => clearTimeout(timer);
  }, [value, canEnhance, variants, previous]);

  // The suggestions belong to the text they were generated from.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function enhance() {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setPrevious(null);

    try {
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          context: label ? `Field: ${label}` : undefined,
          ...context,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not enhance this text.");
      }

      const list: Variant[] = (data.suggestions ?? []).filter(
        (item: Variant) => typeof item?.text === "string" && item.text.trim()
      );

      if (list.length === 0) {
        throw new Error("No suggestions were returned.");
      }

      setVariants(list);
      setSelected(0);
    } catch (err) {
      if (controller.signal.aborted) return;

      setError(
        err instanceof Error ? err.message : "Could not enhance this text."
      );
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }

  function accept() {
    if (!variants) return;

    setPrevious(value);
    onAccept(variants[selected].text);
    setVariants(null);
  }

  function undo() {
    if (previous === null) return;

    onAccept(previous);
    setPrevious(null);
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        {!variants && (
          <button
            type="button"
            onClick={enhance}
            disabled={!canEnhance || loading}
            title={
              canEnhance
                ? "Rewrite this paragraph with AI"
                : `Write at least ${MIN_CHARS} characters to enable`
            }
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              nudge
                ? "animate-pulse border-[#E8820C] bg-[#E8820C]/20 text-[#E8820C]"
                : "border-[#E8820C]/40 bg-[#E8820C]/10 text-[#E8820C] hover:bg-[#E8820C]/20"
            }`}
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Sparkles size={13} />
            )}
            {loading ? "Enhancing..." : "Enhance with AI"}
          </button>
        )}

        {previous !== null && !variants && (
          <button
            type="button"
            onClick={undo}
            className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-2.5 py-1.5 text-[11px] font-bold text-zinc-400 hover:text-white"
          >
            <Undo2 size={13} />
            Undo
          </button>
        )}

        {error && (
          <span role="alert" className="text-[11px] font-medium text-red-400">
            {error}
          </span>
        )}
      </div>

      {variants && (
        <div className="mt-3 rounded-xl border border-[#2A2A2A] bg-[#111] p-3">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {variants.map((variant, index) => (
              <button
                key={`${variant.type}-${index}`}
                type="button"
                onClick={() => setSelected(index)}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${
                  index === selected
                    ? "border-[#E8820C] bg-[#E8820C]/15 text-[#E8820C]"
                    : "border-[#2A2A2A] text-zinc-500 hover:text-white"
                }`}
              >
                {variant.type}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
                Your text
              </p>
              <p className="whitespace-pre-wrap text-xs leading-5 text-zinc-500">
                {value}
              </p>
            </div>

            <div>
              <p className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#E8820C]">
                {variants[selected].title || "Suggestion"}
              </p>
              <p className="whitespace-pre-wrap text-xs leading-5 text-white">
                {variants[selected].text}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={accept}
              className="flex items-center gap-1.5 rounded-lg bg-[#E8820C] px-3 py-1.5 text-[11px] font-bold text-black hover:bg-[#f09020]"
            >
              <Check size={13} />
              Accept
            </button>

            <button
              type="button"
              onClick={() => setVariants(null)}
              className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-3 py-1.5 text-[11px] font-bold text-zinc-400 hover:text-white"
            >
              <X size={13} />
              Reject
            </button>

            <button
              type="button"
              onClick={enhance}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-3 py-1.5 text-[11px] font-bold text-zinc-400 hover:text-white disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <RotateCcw size={13} />
              )}
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

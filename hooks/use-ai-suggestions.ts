"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

/* ========================================== */
/* TYPES                                      */
/* ========================================== */

export type AISuggestionType =
  | "day"
  | "description"
  | "highlights"
  | "improve"
  | "suggest";

export type AISuggestion = {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  type?: string;
  reason?: string;
  [key: string]: unknown;
};

type RequestOptions = {
  type: AISuggestionType;
  payload?: Record<string, unknown>;
};

type UseAISuggestionsReturn = {
  suggestion: AISuggestion | null;
  suggestions: AISuggestion[];
  loading: boolean;
  error: string | null;

  generate: (
    options: RequestOptions
  ) => Promise<AISuggestion | null>;

  generateMany: (
    options: RequestOptions
  ) => Promise<AISuggestion[]>;

  clear: () => void;
  cancel: () => void;
};

/* ========================================== */
/* API ROUTES                                 */
/* ========================================== */

const API_ROUTES: Record<
  AISuggestionType,
  string
> = {
  day: "/api/ai/day",
  description: "/api/ai/description",
  highlights: "/api/ai/highlights",
  improve: "/api/ai/improve",
  suggest: "/api/ai/suggest",
};

/* ========================================== */
/* HOOK                                       */
/* ========================================== */

export function useAISuggestions(): UseAISuggestionsReturn {
  const [suggestion, setSuggestion] =
    useState<AISuggestion | null>(null);

  const [suggestions, setSuggestions] =
    useState<AISuggestion[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  /* ====================================== */
  /* CANCEL                                  */
  /* ====================================== */

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();

    abortControllerRef.current = null;

    setLoading(false);
  }, []);

  /* ====================================== */
  /* GENERATE                               */
  /* ====================================== */

  const generate = useCallback(
    async ({
      type,
      payload = {},
    }: RequestOptions) => {
      // Cancel previous request.
      abortControllerRef.current?.abort();

      const controller =
        new AbortController();

      abortControllerRef.current =
        controller;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          API_ROUTES[type],
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              data?.message ||
              `AI request failed (${response.status})`
          );
        }

        /*
         * Support APIs returning either:
         *
         * { suggestion: {...} }
         * { data: {...} }
         * {...}
         */

        const result =
          data?.suggestion ??
          data?.data ??
          data;

        const normalized: AISuggestion =
          typeof result === "string"
            ? {
                content: result,
              }
            : result;

        setSuggestion(normalized);
        setSuggestions([normalized]);

        return normalized;
      } catch (err) {
        // Abort is intentional.
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return null;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Failed to generate AI suggestion.";

        setError(message);

        return null;
      } finally {
        if (
          abortControllerRef.current ===
          controller
        ) {
          abortControllerRef.current =
            null;

          setLoading(false);
        }
      }
    },
    []
  );

  /* ====================================== */
  /* GENERATE MANY                           */
  /* ====================================== */

  const generateMany = useCallback(
    async ({
      type,
      payload = {},
    }: RequestOptions) => {
      abortControllerRef.current?.abort();

      const controller =
        new AbortController();

      abortControllerRef.current =
        controller;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          API_ROUTES[type],
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              data?.message ||
              `AI request failed (${response.status})`
          );
        }

        const result =
          data?.suggestions ??
          data?.data ??
          data;

        const normalized: AISuggestion[] =
          Array.isArray(result)
            ? result.map((item) =>
                typeof item === "string"
                  ? {
                      content: item,
                    }
                  : item
              )
            : [
                typeof result === "string"
                  ? {
                      content: result,
                    }
                  : result,
              ];

        setSuggestions(normalized);

        setSuggestion(
          normalized[0] ?? null
        );

        return normalized;
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return [];
        }

        const message =
          err instanceof Error
            ? err.message
            : "Failed to generate AI suggestions.";

        setError(message);

        return [];
      } finally {
        if (
          abortControllerRef.current ===
          controller
        ) {
          abortControllerRef.current =
            null;

          setLoading(false);
        }
      }
    },
    []
  );

  /* ====================================== */
  /* CLEAR                                   */
  /* ====================================== */

  const clear = useCallback(() => {
    setSuggestion(null);
    setSuggestions([]);
    setError(null);
  }, []);

  /* ====================================== */
  /* RETURN                                  */
  /* ====================================== */

  return {
    suggestion,
    suggestions,
    loading,
    error,

    generate,
    generateMany,

    clear,
    cancel,
  };
}

export default useAISuggestions;
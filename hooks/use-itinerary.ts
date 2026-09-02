"use client";

import { useCallback } from "react";

import useAutosave from "@/hooks/use-autosave";
import type { Itinerary } from "@/types/itinerary";

type UseItineraryOptions = {
  delay?: number;
  enabled?: boolean;
};

export default function useItinerary(
  itinerary: Itinerary | null,
  { delay = 1200, enabled = true }: UseItineraryOptions = {}
) {
  const onSave = useCallback(async (latestItinerary: Itinerary | null) => {
    if (!latestItinerary?.id) {
      return;
    }

    const response = await fetch(
      `/api/itineraries/${latestItinerary.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(latestItinerary),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save itinerary.");
    }
  }, []);

  return useAutosave({
    value: itinerary,
    delay,
    enabled: enabled && itinerary !== null,
    onSave,
  });
}

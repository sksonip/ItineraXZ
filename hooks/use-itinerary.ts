import useAutosave from "@/hooks/use-autosave";

const {
  status,
  isSaving,
  isSaved,
  hasError,
  error,
  saveNow,
} = useAutosave({
  value: itinerary,

  delay: 1200,

  onSave: async (latestItinerary) => {
    const response = await fetch(
      `/api/itineraries/${latestItinerary.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          latestItinerary
        ),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to save itinerary."
      );
    }
  },
});
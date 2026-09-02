import { create } from "zustand";
import type {
  Itinerary,
  ItineraryDay,
  ItineraryPhase,
  ItineraryPricing,
} from "@/lib/itinerary/default";
import { createDefaultItinerary } from "@/lib/itinerary/default";

type ItineraryStore = {
  itinerary: Itinerary;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;

  setItinerary: (
    itinerary: Itinerary
  ) => void;

  updateItinerary: (
    updates: Partial<Itinerary>
  ) => void;

  updateDay: (
    dayId: string,
    updates: Partial<ItineraryDay>
  ) => void;

  addDay: () => void;

  removeDay: (
    dayId: string
  ) => void;

  updatePhase: (
    phaseId: string,
    updates: Partial<ItineraryPhase>
  ) => void;

  addPhase: () => void;

  removePhase: (
    phaseId: string
  ) => void;

  updatePricing: (
    pricing: ItineraryPricing
  ) => void;

  reset: () => void;

  markSaving: (
    saving: boolean
  ) => void;

  markSaved: () => void;
};

export const useItineraryStore =
  create<ItineraryStore>((set) => ({
    itinerary:
      createDefaultItinerary(),

    isDirty: false,

    isSaving: false,

    lastSavedAt: null,

    setItinerary: (
      itinerary
    ) =>
      set({
        itinerary,
        isDirty: false,
      }),

    updateItinerary: (
      updates
    ) =>
      set((state) => ({
        itinerary: {
          ...state.itinerary,
          ...updates,
        },
        isDirty: true,
      })),

    updateDay: (
      dayId,
      updates
    ) =>
      set((state) => ({
        itinerary: {
          ...state.itinerary,

          days:
            state.itinerary.days.map(
              (day) =>
                day.id === dayId
                  ? {
                      ...day,
                      ...updates,
                    }
                  : day
            ),
        },

        isDirty: true,
      })),

    addDay: () =>
      set((state) => {
        const nextDayNumber =
          state.itinerary.days.length +
          1;

        const newDay: ItineraryDay = {
          id: `day-${Date.now()}`,
          day: nextDayNumber,
          title: `Day ${nextDayNumber}`,
          location: "",
          description: "",
          activities: [],
          meals: {
            breakfast: "",
            lunch: "",
            dinner: "",
          },
          accommodation: {
            name: "",
            description: "",
          },
          notes: [],
        };

        return {
          itinerary: {
            ...state.itinerary,

            duration:
              Math.max(
                state.itinerary.duration,
                nextDayNumber
              ),

            days: [
              ...state.itinerary.days,
              newDay,
            ],
          },

          isDirty: true,
        };
      }),

    removeDay: (
      dayId
    ) =>
      set((state) => {
        const days =
          state.itinerary.days
            .filter(
              (day) =>
                day.id !== dayId
            )
            .map(
              (day, index) => ({
                ...day,
                day: index + 1,
              })
            );

        return {
          itinerary: {
            ...state.itinerary,
            duration:
              Math.max(
                1,
                days.length
              ),
            days,
          },

          isDirty: true,
        };
      }),

    updatePhase: (
      phaseId,
      updates
    ) =>
      set((state) => ({
        itinerary: {
          ...state.itinerary,

          phases:
            state.itinerary.phases.map(
              (phase) =>
                phase.id === phaseId
                  ? {
                      ...phase,
                      ...updates,
                    }
                  : phase
            ),
        },

        isDirty: true,
      })),

    addPhase: () =>
      set((state) => {
        const phaseNumber =
          state.itinerary.phases.length +
          1;

        const newPhase: ItineraryPhase = {
          id: `phase-${Date.now()}`,
          title: `Phase ${phaseNumber}`,
          description: "",
          days: [],
        };

        return {
          itinerary: {
            ...state.itinerary,

            phases: [
              ...state.itinerary.phases,
              newPhase,
            ],
          },

          isDirty: true,
        };
      }),

    removePhase: (
      phaseId
    ) =>
      set((state) => ({
        itinerary: {
          ...state.itinerary,

          phases:
            state.itinerary.phases.filter(
              (phase) =>
                phase.id !== phaseId
            ),
        },

        isDirty: true,
      })),

    updatePricing: (
      pricing
    ) =>
      set((state) => ({
        itinerary: {
          ...state.itinerary,
          pricing,
        },

        isDirty: true,
      })),

    reset: () =>
      set({
        itinerary:
          createDefaultItinerary(),

        isDirty: false,

        isSaving: false,

        lastSavedAt: null,
      }),

    markSaving: (
      saving
    ) =>
      set({
        isSaving: saving,
      }),

    markSaved: () =>
      set({
        isDirty: false,
        isSaving: false,
        lastSavedAt: new Date(),
      }),
  }));

export default useItineraryStore;
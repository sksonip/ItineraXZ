export type DayActivity = {
  id: string;
  time: string;
  title: string;
  description: string;
  duration?: string;
};

export type DayMeals = {
  breakfast: string;
  lunch: string;
  dinner: string;
};

export type DayAccommodation = {
  name: string;
  description: string;
};

export type ItineraryDay = {
  id: string;
  day: number;
  title: string;
  location: string;
  description: string;
  activities: DayActivity[];
  meals: DayMeals;
  accommodation: DayAccommodation;
  notes: string[];
};

export type DayInput = Omit<
  ItineraryDay,
  "id"
>;

export type DayUpdate = Partial<
  Omit<ItineraryDay, "id" | "day">
>;

export type DaySuggestion = {
  title: string;
  description: string;
  activities: string[];
  highlights: string[];
};

export type DayField =
  | "title"
  | "location"
  | "description"
  | "meals"
  | "accommodation"
  | "notes";

export type DayEditorState = {
  day: ItineraryDay;
  isDirty: boolean;
  isSaving: boolean;
};

export const defaultDay: Omit<
  ItineraryDay,
  "id" | "day"
> = {
  title: "",
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
export type Phase = {
  id: string;
  title: string;
  description: string;
  days: number[];
};

export type PhaseInput = Omit<
  Phase,
  "id"
>;

export type PhaseUpdate = Partial<
  PhaseInput
>;

export type PhaseField =
  | "title"
  | "description"
  | "days";

export type PhaseEditorState = {
  phase: Phase;
  isDirty: boolean;
  isSaving: boolean;
};

export type PhaseDayRange = {
  startDay: number;
  endDay: number;
};

export const defaultPhase: PhaseInput = {
  title: "",
  description: "",
  days: [],
};
export type AIProvider =
  | "gemini"
  | "openai"
  | "anthropic";

export type AIRequest = {
  prompt: string;
  context?: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
};

export type AIResponse<T = string> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AISuggestion = {
  id: string;
  type:
    | "description"
    | "highlight"
    | "activity"
    | "improvement"
    | "general";
  title: string;
  content: string;
  confidence?: number;
};

export type AISuggestionsResponse = {
  suggestions: AISuggestion[];
};

export type DaySuggestionInput = {
  day: number;
  title: string;
  location: string;
  description: string;
  activities?: string[];
};

export type DaySuggestion = {
  title: string;
  description: string;
  activities: string[];
  highlights: string[];
};

export type DescriptionInput = {
  title: string;
  destination: string;
  duration?: number;
  travelStyle?: string;
  existingDescription?: string;
};

export type DescriptionResponse = {
  description: string;
};

export type HighlightInput = {
  title: string;
  destination: string;
  overview?: string;
  days?: DaySuggestionInput[];
};

export type HighlightResponse = {
  highlights: string[];
};

export type ImproveInput = {
  content: string;
  type:
    | "description"
    | "overview"
    | "activity"
    | "highlight"
    | "general";
  context?: string;
};

export type ImproveResponse = {
  improved: string;
};

export type SuggestInput = {
  itineraryTitle?: string;
  destination?: string;
  duration?: number;
  travelStyle?: string;
  content?: string;
};

export type SuggestResponse = {
  suggestions: AISuggestion[];
};

export type AIGenerationResult<T = unknown> = {
  data: T;
  provider: AIProvider;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
};
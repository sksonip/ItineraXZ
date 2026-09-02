import { GoogleGenerativeAI } from "@google/generative-ai";

/* ========================================== */
/* TYPES                                      */
/* ========================================== */

export type DaySuggestionInput = {
  destination?: string;
  dayNumber?: number;
  title?: string;
  overview?: string;

  date?: string;

  location?: string;

  activities?: string[];
  meals?: string[];
  accommodations?: string[];

  previousDays?: unknown[];

  travelStyle?: string;
  travelers?: number;

  additionalInstructions?: string;
};

export type DaySuggestion = {
  title: string;
  overview: string;

  activities: {
    time?: string;
    title: string;
    description: string;
    duration?: string;
  }[];

  meals: {
    type: string;
    description: string;
  }[];

  accommodation?: {
    name: string;
    description: string;
  };

  tips: string[];
};

/* ========================================== */
/* GEMINI                                     */
/* ========================================== */

const apiKey =
  process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is not configured."
  );
}

const genAI =
  new GoogleGenerativeAI(apiKey);

/*
 * Keep the model configurable so you can
 * change it through .env without touching
 * application code.
 */

const modelName =
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash";

const model = genAI.getGenerativeModel({
  model: modelName,
});

/* ========================================== */
/* PROMPT                                     */
/* ========================================== */

function buildPrompt(
  input: DaySuggestionInput
) {
  const {
    destination,
    dayNumber,
    title,
    overview,
    date,
    location,
    activities,
    meals,
    accommodations,
    previousDays,
    travelStyle,
    travelers,
    additionalInstructions,
  } = input;

  return `
You are an expert travel itinerary planner.

Create or improve ONE day of a travel itinerary.

DESTINATION:
${destination || "Not specified"}

DAY:
${dayNumber || "Not specified"}

DATE:
${date || "Not specified"}

CURRENT LOCATION:
${location || "Not specified"}

CURRENT TITLE:
${title || "Not specified"}

CURRENT OVERVIEW:
${overview || "Not specified"}

CURRENT ACTIVITIES:
${JSON.stringify(
  activities || [],
  null,
  2
)}

CURRENT MEALS:
${JSON.stringify(
  meals || [],
  null,
  2
)}

CURRENT ACCOMMODATION:
${JSON.stringify(
  accommodations || [],
  null,
  2
)}

PREVIOUS DAYS:
${JSON.stringify(
  previousDays || [],
  null,
  2
)}

TRAVEL STYLE:
${travelStyle || "Balanced"}

NUMBER OF TRAVELERS:
${travelers || "Not specified"}

ADDITIONAL INSTRUCTIONS:
${additionalInstructions || "None"}

REQUIREMENTS:

1. Make the day realistic and geographically sensible.
2. Do not schedule impossible travel times.
3. Avoid unnecessary backtracking.
4. Include a reasonable number of activities.
5. Keep descriptions useful and concise.
6. Respect the destination's character and local culture.
7. Do not invent highly specific facts unless reasonably certain.
8. Do not duplicate activities already present.
9. If existing content is good, improve it instead of replacing it unnecessarily.
10. Consider meals and rest time.
11. Keep the itinerary practical for real travelers.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "string",
  "overview": "string",
  "activities": [
    {
      "time": "string",
      "title": "string",
      "description": "string",
      "duration": "string"
    }
  ],
  "meals": [
    {
      "type": "Breakfast | Lunch | Dinner",
      "description": "string"
    }
  ],
  "accommodation": {
    "name": "string",
    "description": "string"
  },
  "tips": [
    "string"
  ]
}
`;
}

/* ========================================== */
/* JSON EXTRACTION                            */
/* ========================================== */

function extractJson(
  text: string
): unknown {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    /*
     * Gemini occasionally returns additional
     * text around otherwise valid JSON.
     */

    const start =
      cleaned.indexOf("{");

    const end =
      cleaned.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1 ||
      end <= start
    ) {
      throw new Error(
        "AI returned invalid JSON."
      );
    }

    return JSON.parse(
      cleaned.slice(
        start,
        end + 1
      )
    );
  }
}

/* ========================================== */
/* NORMALIZATION                              */
/* ========================================== */

function normalizeSuggestion(
  data: any
): DaySuggestion {
  return {
    title:
      typeof data?.title === "string"
        ? data.title
        : "Day itinerary",

    overview:
      typeof data?.overview === "string"
        ? data.overview
        : "",

    activities:
      Array.isArray(data?.activities)
        ? data.activities.map(
            (activity: any) => ({
              time:
                typeof activity?.time ===
                "string"
                  ? activity.time
                  : undefined,

              title:
                typeof activity?.title ===
                "string"
                  ? activity.title
                  : "Activity",

              description:
                typeof activity?.description ===
                "string"
                  ? activity.description
                  : "",

              duration:
                typeof activity?.duration ===
                "string"
                  ? activity.duration
                  : undefined,
            })
          )
        : [],

    meals:
      Array.isArray(data?.meals)
        ? data.meals.map(
            (meal: any) => ({
              type:
                typeof meal?.type ===
                "string"
                  ? meal.type
                  : "Meal",

              description:
                typeof meal?.description ===
                "string"
                  ? meal.description
                  : "",
            })
          )
        : [],

    accommodation:
      data?.accommodation &&
      typeof data.accommodation ===
        "object"
        ? {
            name:
              typeof data.accommodation
                .name === "string"
                ? data.accommodation.name
                : "",

            description:
              typeof data.accommodation
                .description === "string"
                ? data.accommodation
                    .description
                : "",
          }
        : undefined,

    tips:
      Array.isArray(data?.tips)
        ? data.tips.filter(
            (tip: unknown) =>
              typeof tip === "string"
          )
        : [],
  };
}

/* ========================================== */
/* GENERATE DAY                               */
/* ========================================== */

export async function generateDay(
  input: DaySuggestionInput
): Promise<DaySuggestion> {
  const prompt = buildPrompt(input);

  try {
    const result =
      await model.generateContent(
        prompt
      );

    const response =
      result.response;

    const text =
      response.text();

    if (!text?.trim()) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    const parsed =
      extractJson(text);

    return normalizeSuggestion(
      parsed
    );
  } catch (error) {
    console.error(
      "Failed to generate day itinerary:",
      error
    );

    if (error instanceof Error) {
      throw new Error(
        `Failed to generate day itinerary: ${error.message}`
      );
    }

    throw new Error(
      "Failed to generate day itinerary."
    );
  }
}

export default generateDay;
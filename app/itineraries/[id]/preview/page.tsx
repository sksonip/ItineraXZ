"use client";

import {
  ArrowLeft,
  Download,
  Edit3,
  Loader2,
  MapPin,
  Mountain,
  Route,
  Thermometer,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type Highlight = { title?: string; text?: string };
type Pillar = { title?: string; text?: string };
type Day = {
  dayLabel?: string;
  title?: string;
  distance?: string;
  altitude?: string;
  overnight?: string;
  description?: string;
};
type Phase = {
  phaseTitle?: string;
  dayRangeLabel?: string;
  days?: Day[];
};
type Advantage = { title?: string; bullets?: string[] };
type PricingItem = { label?: string; amount?: number };
type PaymentSchedule = {
  label?: string;
  note?: string;
  amount?: number;
};

type Itinerary = {
  id?: string;
  tripName?: string;
  title?: string;
  tagline?: string;
  heroImage?: string;
  durationDays?: number;
  maxAltitude?: string;
  tempRange?: string;
  startPoint?: string;
  endPoint?: string;
  totalDistanceKm?: number;
  description?: string;
  highlights?: Highlight[];
  stayPreference?: { title?: string; text?: string };
  foodPreference?: { title?: string; text?: string };
  travelCadence?: string[];
  quote?: { text?: string; attribution?: string };
  philosophyIntro?: string;
  pillars?: Pillar[];
  itinerary?: Phase[];
  phases?: Phase[];
  pricing?: {
    currency?: string;
    lineItems?: PricingItem[];
    totalPerPerson?: number;
    paymentSchedule?: PaymentSchedule[];
    disclaimer?: string;
  };
  inclusions?: string[];
  exclusions?: string[];
  advantages?: Advantage[];
  accommodationComfort?: {
    bullets?: string[];
    closingStatement?: string;
  };
  safetyTeam?: {
    bullets?: string[];
    closingStatement?: string;
  };
};

const PAPER = "#080808";
const ORANGE = "#F47C20";
const CARD = "#1C1C1C";

/* Replace these temporary image URLs with the final logo URLs. */
const AFFILIATION_IMAGES = {
  government: [
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80",
  ],
  membership: [
    "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&w=500&q=80",
  ],
  partners: [
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1518005020951-eccd494ad742?auto=format&fit=crop&w=500&q=80",
  ],
};

/*
 * Stable online stock-image URLs. The first image is used when an itinerary
 * has no heroImage; the others are available for future itinerary records.
 */
const STOCK_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85",
];
const DEFAULT_HERO_IMAGE_URL = STOCK_IMAGE_URLS[0];

const CONTOUR_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='460' height='460' viewBox='0 0 460 460'%3E%3Cg fill='none' stroke='%23353535' stroke-width='1'%3E%3Cpath d='M-35 122C42 52 105 94 143 49s84-76 143-30 66 20 116-25'/%3E%3Cpath d='M-20 149c79-67 126-17 167-59s92-70 144-20 94 27 182-36'/%3E%3Cpath d='M-44 185c76-65 129-18 167-56s89-52 139-15 107 39 212-39'/%3E%3Cpath d='M-27 222c70-51 129-28 176-61 44-31 79-19 129 9 53 30 112 24 196-37'/%3E%3Cpath d='M-42 265c67-38 126-26 178-53 54-28 97-17 145 18 52 38 118 36 204-11'/%3E%3Cpath d='M-24 305c83-40 134-4 185-34 60-35 100-17 148 19 49 37 111 45 186 15'/%3E%3Cpath d='M-56 348c80-50 138-18 190 7 54 26 102 9 153-26 47-32 105-34 190 20'/%3E%3Cpath d='M-31 393c65-40 122-41 176-14 67 33 111 15 159-21 44-33 103-24 179 36'/%3E%3Cpath d='M46 456c30-34 76-44 127-19 58 29 104 20 158-17 51-35 89-23 135 14'/%3E%3C/g%3E%3C/svg%3E\")";

const PRINT_STYLES = `
  * { box-sizing: border-box; }
  html, body {
    background: ${PAPER};
    font-family: Arial, Helvetica, sans-serif;
  }
  @page {
    size: A4;
    margin: 0;
  }
  @media print {
    html, body {
      width: 210mm;
      background: ${PAPER} !important;
      color: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .pdf-toolbar, .screen-only { display: none !important; }
    #pdf-content {
      width: 210mm !important;
      max-width: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .pdf-page {
      width: 210mm !important;
      height: 297mm !important;
      min-height: 297mm !important;
      max-height: 297mm !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      box-shadow: none !important;
      break-after: page;
      page-break-after: always;
    }
    .closing-page {
      padding-bottom: 112px !important;
    }
    .pdf-page:last-child {
      break-after: auto;
      page-break-after: auto;
    }
    .avoid-break, article, .pdf-card, .timeline-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    a {
      color: inherit !important;
      text-decoration: none !important;
    }
  }
  .contour-bg {
    background-repeat: repeat;
    background-size: 460px 460px;
  }
  .timeline-card-left::after,
  .timeline-card-right::after {
    content: "";
    position: absolute;
    top: 52px;
    width: 34px;
    height: 2px;
    background: ${ORANGE};
  }
  .timeline-card-left::after { right: -34px; }
  .timeline-card-right::after { left: -34px; }
  .closing-footer {
    min-height: 112px;
    height: 112px;
  }
  @media (max-width: 767px) {
    .timeline-card-left::after,
    .timeline-card-right::after { display: none; }
  }
`;

const OVERVIEW_TEXT =
  "A carefully curated journey designed around meaningful places, local experiences, and the freedom to travel at a considered pace. Every route is shaped to balance memorable highlights with enough space to explore, pause, and experience each destination properly.\n\nFrom the first arrival to the final departure, the journey combines practical planning with the character of the destination — thoughtful stays, scenic routes, local food, and experiences that go beyond a standard checklist.";

const PHILOSOPHY_TEXT =
  "This is not a journey of checklists; it is a thoughtfully paced itinerary built around immersion. The route prioritizes local discovery, intentional exploration, and active presence over rushed transit. With the right balance of movement and open space, travellers can experience the gradual evolution of each landscape at a human pace.";

const DEFAULT_HIGHLIGHTS: Highlight[] = [
  {
    title: "Signature Landscapes",
    text: "Move through the destination’s most memorable natural settings, scenic routes, and viewpoints.",
  },
  {
    title: "Living Culture",
    text: "Meet local makers, communities, and traditions that give each place its character.",
  },
  {
    title: "Local Flavours",
    text: "Make room for regional food, thoughtful stays, and the small details that make a trip personal.",
  },
  {
    title: "Room to Explore",
    text: "A considered rhythm leaves time for detours, conversations, rest, and unexpected discoveries.",
  },
];

const DEFAULT_INCLUSIONS = [
  "Ground transportation throughout the itinerary",
  "Arrival and departure transfers at the agreed locations",
  "Accommodation in selected hotels, lodges, or homestays",
  "Daily breakfast and included meals as specified",
  "Local guide, host, or experience support where listed",
  "Permits, entrance fees, and local taxes where specified",
  "A dedicated trip coordinator for the journey",
  "Basic first-aid and essential travel support",
  "A curated route with pre-arranged stops and experiences",
  "Travel assistance before and during the itinerary",
  "Travel insurance or activity coverage where specified",
  "A keepsake or welcome amenity where included",
];

const DEFAULT_EXCLUSIONS = [
  "Personal travel costs to and from the starting point",
  "Personal expenses and meals not listed as included",
  "Optional activities, upgrades, or additional entrance fees",
  "Laundry, room service, and other incidental hotel charges",
  "Costs caused by changes outside the organiser’s control",
  "Emergency travel or changes requested for personal reasons",
  "Tips for guides, drivers, hosts, and local teams",
  "Bottled water and personal shopping during the journey",
  "Any item not specifically mentioned in the inclusions list",
];

const DEFAULT_COMFORT = [
  "Comfortable stays selected for location, character, and practicality",
  "Rooms with private or attached bathrooms where available",
  "Clean bedding, essential amenities, and reliable housekeeping",
  "Reliable power backup systems",
  "Wi-Fi availability subject to the region and property",
  "Fresh local and familiar meal options as planned",
  "Comfortable seating and sensible breaks during transfers",
];

const DEFAULT_SAFETY = [
  "Experienced trip leaders and local partners",
  "A clear route plan with practical travel guidance",
  "Trusted local guides, drivers, and hosts",
  "Dedicated support during the itinerary",
  "First-aid supplies and emergency contacts",
  "Contingency planning for weather and route changes",
];

const DEFAULT_ADVANTAGES: Advantage[] = [
  {
    title: "Distinctive Routes",
    bullets: ["Go beyond the obvious highlights", "Experience a route shaped around your trip."],
  },
  {
    title: "Local Character",
    bullets: ["Meet people who know the destination", "Make space for everyday local life."],
  },
  {
    title: "Scenic Transfers",
    bullets: ["Travel through memorable landscapes", "Turn the route itself into part of the trip."],
  },
  {
    title: "A Better Pace",
    bullets: ["Avoid an overpacked schedule", "Leave room for rest and spontaneity."],
  },
  {
    title: "Varied Experiences",
    bullets: ["Mix culture, nature, food, and discovery", "Keep every day feeling different."],
  },
  {
    title: "Made for Stories",
    bullets: ["Find moments worth remembering", "Perfect for curious, experience-led travellers."],
  },
];

const DEFAULT_DAYS: Day[] = [
  {
    dayLabel: "DAY - 1",
    title: "Day 1: Arrival & Welcome",
    distance: "Arrival day",
    altitude: "",
    overnight: "Arrival location",
    description: "Arrive, settle in, and get oriented with the destination. A relaxed first day creates space for local introductions, a gentle first walk, or a welcome experience.",
  },
  {
    dayLabel: "DAY - 2",
    title: "Day 2: First Impressions",
    distance: "Scenic transfer",
    altitude: "",
    overnight: "Night 2",
    description: "Begin exploring the character of the destination through its neighbourhoods, viewpoints, local food, and the first signature stops.",
  },
  {
    dayLabel: "DAY - 3",
    title: "Day 3: Local Discovery",
    distance: "Full-day experience",
    altitude: "",
    overnight: "Night 3",
    description: "Spend time with the places and people that make this itinerary distinctive. The day is shaped around a considered mix of guided discovery and free exploration.",
  },
  {
    dayLabel: "DAY 4 & 5",
    title: "Days 4 & 5: Deeper Into the Route",
    distance: "Multi-day experience",
    altitude: "",
    overnight: "Overnight stop",
    description: "Slow down for a deeper experience of the route, with time for a local activity, an unhurried meal, and the landscape between the main stops.",
  },
  {
    dayLabel: "DAY - 6",
    title: "Day 6: Scenic Transfer",
    distance: "Route day",
    altitude: "",
    overnight: "Night 6",
    description: "Travel onward through changing scenery, with well-timed stops and enough breathing room to enjoy the route instead of simply passing through it.",
  },
  {
    dayLabel: "DAY - 7",
    title: "Day 7: Heritage & Culture",
    distance: "Guided experience",
    altitude: "",
    overnight: "Night 7",
    description: "Discover the stories, architecture, craft, or heritage that shaped this part of the journey, with a local perspective guiding the day.",
  },
  {
    dayLabel: "DAY - 8",
    title: "Day 8: Open Exploration",
    distance: "Local excursions",
    altitude: "",
    overnight: "Night 8",
    description: "A flexible day for optional experiences, a local walk, a slower morning, or the discovery that naturally catches your attention.",
  },
  {
    dayLabel: "DAY - 9",
    title: "Day 9: A New Chapter",
    distance: "Scenic transfer",
    altitude: "",
    overnight: "Night 9",
    description: "Shift into the next part of the journey, taking in a new landscape, a different pace, and the details that make the route feel layered rather than repetitive.",
  },
  {
    dayLabel: "DAY - 10",
    title: "Day 10: Signature Experience",
    distance: "Full-day experience",
    altitude: "",
    overnight: "Night 10",
    description: "Spend the day on one of the itinerary’s defining experiences — a place, activity, meal, or meeting that deserves time rather than a quick stop.",
  },
  {
    dayLabel: "DAY - 11",
    title: "Day 11: Landscape & Leisure",
    distance: "Route day",
    altitude: "",
    overnight: "Night 11",
    description: "Continue through the changing landscape with thoughtful pauses for viewpoints, photography, conversation, and a comfortable arrival at the next stay.",
  },
  {
    dayLabel: "DAY - 12",
    title: "Day 12: Final Full Day",
    distance: "Local excursions",
    altitude: "",
    overnight: "Night 12",
    description: "Use the final full day to revisit a favourite style of experience, explore a nearby area, or simply enjoy the destination without rushing toward departure.",
  },
  {
    dayLabel: "DAY - 13",
    title: "Day 13: Return Journey",
    distance: "Departure transfer",
    altitude: "",
    overnight: "Final overnight",
    description: "Begin the return leg with a route planned for comfort, useful stops, and a final chance to enjoy the places between the main destinations.",
  },
  {
    dayLabel: "DAY - 14",
    title: "Day 14: Farewell",
    distance: "Departure day",
    altitude: "",
    overnight: "Journey end",
    description: "Complete the final transfer and depart with the practical details handled, the highlights remembered, and the journey brought to a smooth close.",
  },
];

const DEFAULT_PRICING_ITEMS: PricingItem[] = [
  { label: "Transportation", amount: 40000 },
  { label: "Accommodation", amount: 50000 },
  { label: "Meals", amount: 10000 },
  { label: "Taxes, permits & entry fees", amount: 15000 },
  { label: "Curation charges (including guide)", amount: 30000 },
  { label: "Trip operations & support", amount: 30000 },
  { label: "Miscellaneous, first aid & insurance", amount: 5000 },
];

function money(amount: number | undefined, currency = "INR") {
  if (amount === undefined || Number.isNaN(amount)) return "-";
  return `${currency === "INR" ? "₹" : currency} ${amount.toLocaleString("en-IN")}`;
}

function tripNameOf(itinerary: Itinerary) {
  return itinerary.tripName || itinerary.title || "Untitled Itinerary";
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toDay(day: any, index: number): Day {
  return {
    dayLabel: text(day?.dayLabel) || `DAY - ${day?.day || index + 1}`,
    title: text(day?.title),
    description: text(day?.description),
    distance: text(day?.distance),
    altitude: text(day?.altitude),
    overnight: text(day?.overnight) || text(day?.location),
  };
}

function normalizePreviewItinerary(source: Record<string, any>, id: string): Itinerary {
  const sourceDays = Array.isArray(source.days) && source.days.length
    ? source.days.map(toDay)
    : DEFAULT_DAYS;
  const sourcePhases = Array.isArray(source.phases) ? source.phases : [];
  const defaultTitles = [
    "Arrival & First Impressions",
    "Local Culture & Exploration",
    "Scenic Routes & Signature Experiences",
    "Return Journey & Farewell",
  ];
  const defaultRanges = sourceDays.length === 13
    ? [0, 4, 8, 11, 13]
    : sourceDays.length === 14
      ? [0, 5, 9, 12, 14]
      : Array.from({ length: Math.min(4, sourceDays.length) + 1 }, (_, index) =>
          Math.floor((index * sourceDays.length) / Math.min(4, sourceDays.length)));
  const defaultGroups = defaultTitles
    .map((phaseTitle, index) => ({
      phaseTitle,
      dayRangeLabel: `DAYS ${defaultRanges[index]} - ${Math.max(defaultRanges[index + 1] - 1, defaultRanges[index])}`,
      start: defaultRanges[index],
      end: defaultRanges[index + 1],
    }))
    .filter((group) => group.start < group.end);

  const phases: Phase[] = sourcePhases.length
    ? sourcePhases.map((phase: any) => ({
        phaseTitle: text(phase?.phaseTitle) || text(phase?.title),
        dayRangeLabel: text(phase?.dayRangeLabel),
        days: Array.isArray(phase?.days)
          ? phase.days
              .map((item: any) => typeof item === "number" ? sourceDays[item - 1] : item)
              .filter(Boolean)
              .map((day: any, index: number) => toDay(day, index))
          : [],
      }))
    : defaultGroups.map((group) => ({
        phaseTitle: group.phaseTitle,
        dayRangeLabel: group.dayRangeLabel,
        days: sourceDays.slice(group.start, group.end),
      }));

  const rawHighlights = source.highlightCards || source.highlights;
  const highlights: Highlight[] = Array.isArray(rawHighlights) && rawHighlights.length
    ? rawHighlights.map((item: any) => typeof item === "string"
        ? { title: item }
        : { title: text(item?.title), text: text(item?.text) })
    : DEFAULT_HIGHLIGHTS;

  const rawPricingItems = source.pricing?.lineItems || source.pricing?.items;
  const lineItems: PricingItem[] = Array.isArray(rawPricingItems) && rawPricingItems.length
    ? rawPricingItems.map((item: any) => ({
        label: text(item?.label) || text(item?.name),
        amount: Number(item?.amount ?? item?.unitPrice ?? 0),
      }))
    : DEFAULT_PRICING_ITEMS;
  const suppliedTotal = Number(source.pricing?.totalPerPerson);
  const totalPerPerson = Number.isFinite(suppliedTotal) && suppliedTotal > 0
    ? suppliedTotal
    : lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  return {
    ...source,
    id,
    tripName: text(source.tripName) || text(source.title) || "Untitled Itinerary",
    title: text(source.title) || text(source.tripName) || "Untitled Itinerary",
    tagline: text(source.tagline) || "Curated for explorers. Designed for stories.",
    heroImage: text(source.heroImage) || DEFAULT_HERO_IMAGE_URL,
    durationDays: Number(source.durationDays || source.duration || sourceDays.length || 14),
    maxAltitude: text(source.maxAltitude) || "—",
    tempRange: text(source.tempRange) || "—",
    startPoint: text(source.startPoint) || "Starting point",
    endPoint: text(source.endPoint) || "Final destination",
    totalDistanceKm: Number(source.totalDistanceKm) || undefined,
    description: text(source.description) || text(source.overview) || OVERVIEW_TEXT,
    highlights,
    quote: source.quote || {
      text: "We don’t just plan itineraries; we craft stories you’ll never forget.",
      attribution: "Your travel team",
    },
    philosophyIntro: text(source.philosophyIntro) || text(source.philosophy) || PHILOSOPHY_TEXT,
    pillars: Array.isArray(source.pillars) && source.pillars.length
      ? source.pillars
      : [
          { title: "A Considered Pace", text: "Balance planned experiences with enough time to pause, wander, and let each place reveal itself." },
          { title: "Local Immersion", text: "Step beyond the obvious route to meet local people, support local businesses, and experience everyday character." },
          { title: "Meaningful Details", text: "Build the journey around regional food, thoughtful stays, and experiences that feel specific to the destination." },
          { title: "Room to Breathe", text: "Keep enough open space for rest, conversation, weather, and the unexpected moments that become favourite memories." },
        ],
    phases,
    itinerary: phases,
    pricing: {
      currency: text(source.pricing?.currency) || "INR",
      lineItems,
      totalPerPerson,
      paymentSchedule: Array.isArray(source.pricing?.paymentSchedule) && source.pricing.paymentSchedule.length
        ? source.pricing.paymentSchedule
        : [
            { label: "Advance (20%)", note: "At the time of booking", amount: 30000 },
            { label: "Remaining (80%)", note: "15 Days before trip", amount: 150000 },
          ],
      disclaimer: text(source.pricing?.disclaimer) || "Prices are subject to change based on availability and season. Family curated and customised 1:1 trip costs vary.",
    },
    inclusions: Array.isArray(source.inclusions) && source.inclusions.length ? source.inclusions : DEFAULT_INCLUSIONS,
    exclusions: Array.isArray(source.exclusions) && source.exclusions.length ? source.exclusions : DEFAULT_EXCLUSIONS,
    advantages: Array.isArray(source.advantageCards) && source.advantageCards.length
      ? source.advantageCards
      : Array.isArray(source.advantages) && source.advantages.length
        ? source.advantages.map((item: any) => typeof item === "string" ? { title: item, bullets: [] } : item)
        : DEFAULT_ADVANTAGES,
    stayPreference: source.stayPreference || {
      title: "STAY PREFERENCE",
      text: "Comfortable hotels, lodges, or homestays selected for location, character, and practical amenities.",
    },
    foodPreference: source.foodPreference || {
      title: "FOOD PREFERENCE",
      text: "Fresh, hygienic meals with local and familiar options, planned around the route and your preferences.",
    },
    travelCadence: Array.isArray(source.travelCadence) && source.travelCadence.length
      ? source.travelCadence
      : [
          "Relaxed travel with ample time for exploration and local discovery.",
          "The journey prioritizes thoughtful pacing, cultural immersion, and real experiences.",
          "Comfortable transfers and arrival/departure support are included where specified.",
        ],
    accommodationComfort: source.accommodationComfort || {
      bullets: DEFAULT_COMFORT,
      closingStatement: "This level of comfort ensures Travellers remain focused, healthy, and productive throughout the expedition.",
    },
    safetyTeam: source.safetyTeam || {
      bullets: DEFAULT_SAFETY,
      closingStatement: "The itinerary is designed to balance safety, care, and a slower travel philosophy with the freedom to experience each destination properly.",
    },
  };
}

function NumberHeading({ number, children }: { number: string; children: ReactNode }) {
  return (
    <h2 className="mb-3 text-[19px] font-black uppercase leading-none tracking-[-0.03em] text-white">
      <span className="text-[#F47C20]">{number}.</span> {children}
    </h2>
  );
}

function PdfPage({
  children,
  className = "",
  footer = true,
}: {
  children: ReactNode;
  className?: string;
  footer?: boolean;
}) {
  return (
    <section className={`pdf-page relative mx-auto mb-6 min-h-[1123px] w-full max-w-[794px] overflow-hidden bg-[#080808] shadow-2xl md:mb-8 ${className}`}>
      <div className="contour-bg pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: CONTOUR_PATTERN }} />
      <div className="relative z-10 h-full">{children}</div>
      {footer && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F47C20]" />
          <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.09em] text-[#777] md:left-7 md:right-7">
            <span>A JOURNEY DESIGNED FOR STORIES</span>
            <span>BETTADA JEEVA</span>
          </div>
        </>
      )}
    </section>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-[#333] bg-[#1C1C1C] px-2 py-2 text-center">
      <div className="text-[15px] font-black leading-none text-[#F47C20]">{value}</div>
      <div className="mt-1 text-[7px] uppercase tracking-[0.05em] text-[#D5D5D5]">{label}</div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-[55px] items-center gap-3 border border-[#303030] bg-[#1A1A1A] px-3 py-2">
      <div className="text-[#F47C20]">{icon}</div>
      <div className="min-w-0">
        <div className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#777]">{label}</div>
        <div className="mt-1 break-words text-[10px] font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

function BulletList({ items, positive = true }: { items: string[]; positive?: boolean }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2 text-[8px] leading-[1.35] text-[#D0D0D0]">
          <span className={`shrink-0 font-black ${positive ? "text-[#F47C20]" : "text-[#D43D43]"}`}>
            {positive ? "✓" : "×"}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CoverPage({ itinerary }: { itinerary: Itinerary }) {
  return (
    <PdfPage footer={false} className="p-0">
      <div className="grid h-full grid-cols-[220px_1fr]">
        <aside className="relative flex h-full flex-col bg-[#151515] px-3 pb-12 pt-7">
          <div className="flex h-[59px] w-[59px] items-center justify-center border border-white bg-[#080808] text-center text-[9px] font-black uppercase leading-[0.9] text-white">
            ಬೆಟ್ಟದ<br />ಜೀವ
          </div>
          <div className="mt-4 border-b border-[#454545] pb-3">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-[#F47C20]">BETTADA JEEVA</div>
            <div className="mt-1 text-[6px] uppercase tracking-[0.08em] text-[#777]">EXPERIENCES BEYOND LIMITS</div>
          </div>
          <div className="mt-3 text-[7px] font-black uppercase tracking-[0.09em] text-[#F47C20]">
            {itinerary.durationDays} DAYS <span className="text-white">Custom Itinerary</span>
          </div>
          <h1 className="mt-5 break-words text-[23px] font-black italic leading-[0.9] tracking-[-0.06em] text-[#F47C20]">
            {tripNameOf(itinerary)}
          </h1>
          <p className="mt-4 max-w-[170px] text-[8px] leading-[1.35] text-[#D5D5D5]">
            Curated for explorers.<br />Designed for stories.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-1">
            <MiniStat value={`${itinerary.durationDays}`} label="Days" />
            <MiniStat value={itinerary.maxAltitude || "3000M"} label="Max Altitude" />
            <MiniStat value={itinerary.tempRange || "15 to 22 °C"} label="Weather" />
          </div>
          <img
            src={itinerary.heroImage || DEFAULT_HERO_IMAGE_URL}
            alt={`${tripNameOf(itinerary)} landscape`}
            className="mt-3 h-[127px] w-full object-cover"
          />
          <div className="mt-auto text-[7px] uppercase tracking-[0.06em] text-[#777]">
            {itinerary.startPoint} → {itinerary.endPoint}
          </div>
        </aside>

        <div className="relative px-5 pb-10 pt-7">
          <div className="mb-8 text-[8px] font-bold uppercase tracking-[0.18em] text-[#C8C8C8]">OVERVIEW</div>
          <NumberHeading number="1">About the Expedition</NumberHeading>
          <p className="whitespace-pre-line text-[9px] leading-[1.45] text-[#D1D1D1]">{itinerary.description}</p>

          <div className="mt-5 grid grid-cols-[1.1fr_1fr] gap-5">
            <div>
              <NumberHeading number="2">Journey Highlights</NumberHeading>
              <div className="space-y-3">
                {itinerary.highlights?.slice(0, 4).map((highlight, index) => (
                  <div key={index}>
                    <h3 className="text-[9px] font-black text-white">{highlight.title}</h3>
                    <p className="mt-1 text-[8px] leading-[1.35] text-[#BEBEBE]">{highlight.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <NumberHeading number="3">Stay & Food Preference</NumberHeading>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="border border-[#373737] bg-[#1B1B1B] p-2">
                  <h3 className="text-[7px] font-black uppercase text-[#F47C20]">Stay Preference</h3>
                  <p className="mt-2 text-[7px] leading-[1.35] text-[#CBCBCB]">{itinerary.stayPreference?.text}</p>
                </div>
                <div className="border border-[#373737] bg-[#1B1B1B] p-2">
                  <h3 className="text-[7px] font-black uppercase text-[#F47C20]">Food Preference</h3>
                  <p className="mt-2 text-[7px] leading-[1.35] text-[#CBCBCB]">{itinerary.foodPreference?.text}</p>
                </div>
              </div>
              <h3 className="mt-4 text-[8px] font-black uppercase tracking-[0.1em] text-white">Travel Cadence</h3>
              <ul className="mt-2 space-y-1 text-[7px] leading-[1.35] text-[#C8C8C8]">
                {itinerary.travelCadence?.map((item, index) => <li key={index}>• {item}</li>)}
              </ul>
              {itinerary.quote?.text && (
                <div className="mt-3 border border-[#F47C20] bg-[#181818] px-2 py-2 text-center text-[7px] italic leading-[1.3] text-[#E8E8E8]">
                  “{itinerary.quote.text}”
                  <span className="mt-1 block not-italic font-bold text-[#F47C20]">— {itinerary.quote.attribution}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-7">
            <NumberHeading number="4">Itinerary Focus and Philosophy</NumberHeading>
            <p className="whitespace-pre-line text-[8px] leading-[1.4] text-[#C8C8C8]">{itinerary.philosophyIntro}</p>
            <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2">
              {itinerary.pillars?.map((pillar, index) => (
                <div key={index} className="flex gap-2 text-[7px] leading-[1.35] text-[#C8C8C8]">
                  <span className="text-[#F47C20]">●</span>
                  <span><strong className="text-white">{pillar.title}:</strong> {pillar.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <NumberHeading number="5">Inclusions & Exclusions</NumberHeading>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#353535] bg-[#1A1A1A] p-2.5">
                <h3 className="mb-2 text-[8px] font-black uppercase text-[#F47C20]">Package Inclusions</h3>
                <BulletList items={itinerary.inclusions || []} />
              </div>
              <div className="border border-[#353535] bg-[#1A1A1A] p-2.5">
                <h3 className="mb-2 text-[8px] font-black uppercase text-[#D43D43]">Package Exclusions</h3>
                <BulletList items={itinerary.exclusions || []} positive={false} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F47C20]" />
        </div>
      </div>
    </PdfPage>
  );
}

function TimelineCard({ day, side }: { day: Day; side: "left" | "right" }) {
  return (
    <article className={`timeline-card relative overflow-visible border border-[#555] bg-[#222] shadow-[0_2px_0_#090909] ${side === "left" ? "timeline-card-left" : "timeline-card-right"}`}>
      <div className="bg-[#F47C20] px-3 py-2 text-center text-[13px] font-bold uppercase leading-none text-white">{day.dayLabel}</div>
      <div className="p-3">
        <h3 className="text-[11px] font-bold leading-[1.2] text-white">{day.title}</h3>
        <div className="mt-2 text-[8px] font-bold leading-[1.4] text-[#E6E6E6]">
          {day.distance}{day.distance && day.altitude ? " | " : ""}{day.altitude}{day.overnight ? " | Overnight: " : ""}{day.overnight}
        </div>
        <p className="mt-2 text-[8px] leading-[1.4] text-[#D0D0D0]">{day.description}</p>
      </div>
    </article>
  );
}

function TimelinePage({ phase, index, itinerary, isLast }: { phase: Phase; index: number; itinerary: Itinerary; isLast: boolean }) {
  const days = phase.days || [];
  return (
    <PdfPage className="px-4 pb-12 pt-7 md:px-4 md:pt-7">
      <div className="text-[16px] font-black leading-none text-white">
        {index === 1 ? "6" : `6.${index - 1}`} <span className="text-white">Your </span><span className="text-[#F47C20]">Day-by-Day</span> Itinerary
      </div>
      <p className="mt-2 max-w-[670px] text-[8px] leading-[1.4] text-[#D2D2D2]">
        A curated {itinerary.durationDays}-day journey from {itinerary.startPoint} to {itinerary.endPoint} — through the places, experiences, and landscapes that make this itinerary distinct. Every detail is managed for a seamless journey.
      </p>
      <div className="mt-5 inline-block rounded bg-[#F47C20] px-2.5 py-2 text-[10px] font-black uppercase leading-none text-white">
        {phase.dayRangeLabel || `DAYS ${index === 1 ? "1 - 5" : ""}`}
      </div>
      <h1 className="mt-6 max-w-[660px] text-[27px] font-bold leading-[1.08] tracking-[-0.03em] text-white">
        {phase.phaseTitle || "Your Day-by-Day Itinerary"}
      </h1>
      <div className="relative mt-10">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-[5px] -translate-x-1/2 rounded bg-[#F47C20] md:block" />
        <div className="space-y-8 md:space-y-0">
          {days.map((day, dayIndex) => {
            const right = dayIndex % 2 === 1;
            return (
              <div key={dayIndex} className={`relative grid md:min-h-[168px] md:grid-cols-2 md:gap-x-[68px] ${dayIndex > 0 ? "md:mt-[-2px]" : ""}`}>
                <div className={`${right ? "md:col-start-2 md:row-start-1 md:mt-[76px]" : "md:col-start-1 md:row-start-1 md:mt-0"} px-0`}>
                  <TimelineCard day={day} side={right ? "right" : "left"} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isLast && (
        <div className="mt-6 rounded bg-[#F47C20] px-3 py-3 text-[10px] font-bold leading-[1.3] text-white">
          This {itinerary.durationDays}-day curated itinerary covers {itinerary.totalDistanceKm ? `approximately ${itinerary.totalDistanceKm} km` : "the planned route"} from {itinerary.startPoint} to {itinerary.endPoint}, bringing together the journey’s most memorable places and experiences.
        </div>
      )}
    </PdfPage>
  );
}

function ProvisionTable({ itinerary }: { itinerary: Itinerary }) {
  const pricing = itinerary.pricing;
  return (
    <div>
      <NumberHeading number="7">Itinerary Provision</NumberHeading>
      <div className="border border-[#252525]">
        <div className="grid grid-cols-[1fr_76px] bg-[#232323] px-2 py-1 text-[7px] font-black uppercase text-[#F47C20]">
          <span>Description</span><span className="text-right">Cost (Per Person)</span>
        </div>
        {pricing?.lineItems?.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_76px] border-t border-[#303030] px-2 py-[3px] text-[7px] leading-[1.2] text-[#C9C9C9]">
            <span>{item.label}</span><span className="text-right text-white">{money(item.amount, pricing.currency)}</span>
          </div>
        ))}
        <div className="grid grid-cols-[1fr_76px] bg-[#F47C20] px-2 py-2 text-[8px] font-black uppercase text-white">
          <span>Total Package Cost (Per Person)</span><span className="text-right text-[12px]">{money(pricing?.totalPerPerson, pricing?.currency)}</span>
        </div>
      </div>
      <h3 className="mt-3 text-[8px] font-black uppercase text-[#F47C20]">Payment Breakdown</h3>
      <div className="mt-1 border border-[#303030]">
        {pricing?.paymentSchedule?.map((payment, index) => (
          <div key={index} className="flex items-center justify-between gap-3 border-t border-[#303030] bg-[#191919] px-2 py-2 first:border-t-0">
            <div>
              <div className="text-[8px] font-bold text-white">{payment.label}</div>
              <div className="text-[7px] text-[#999]">{payment.note}</div>
            </div>
            <div className="text-[10px] font-black text-[#F47C20]">{money(payment.amount, pricing.currency)}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[6px] leading-[1.35] text-[#777]">*{pricing?.disclaimer}</p>
    </div>
  );
}

function Advantages({ advantages }: { advantages: Advantage[] }) {
  return (
    <div>
      <NumberHeading number="8">Advantages</NumberHeading>
      <div className="grid grid-cols-2 gap-1.5">
        {advantages.slice(0, 6).map((advantage, index) => (
          <div key={index} className="border-t-[4px] border-[#F47C20] bg-[#1A1A1A] px-2 py-2">
            <h3 className="text-[8px] font-black leading-[1.1] text-white">{advantage.title}</h3>
            <ul className="mt-2 space-y-1 text-[7px] leading-[1.25] text-[#C6C6C6]">
              {advantage.bullets?.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactPanel({ title, bullets, closingStatement }: { title: string; bullets?: string[]; closingStatement?: string }) {
  return (
    <div className="border border-[#303030] bg-[#181818] px-3 py-2.5">
      <h3 className="text-[10px] font-black uppercase text-white">{title}</h3>
      <ul className="mt-2 space-y-1 text-[7px] leading-[1.35] text-[#C9C9C9]">
        {bullets?.map((bullet, index) => <li key={index} className="flex gap-2"><span className="text-[#F47C20]">•</span><span>{bullet}</span></li>)}
      </ul>
      {closingStatement && <p className="mt-2 border-t border-[#303030] pt-2 text-[7px] italic leading-[1.35] text-[#F47C20]">{closingStatement}</p>}
    </div>
  );
}

function Recognitions() {
  const groups = [
    { title: "Recognitions by Government", images: AFFILIATION_IMAGES.government },
    { title: "Membership", images: AFFILIATION_IMAGES.membership },
    { title: "Partners", images: AFFILIATION_IMAGES.partners },
  ];

  return (
    <div className="mt-4 text-center">
      {groups.map((group) => (
        <div key={group.title} className="mb-4 last:mb-0">
          <div className="text-[11px] font-bold text-[#F47C20]">{group.title}</div>
          <div className="mx-auto mt-2 flex flex-wrap items-center justify-center gap-2">
            {group.images.map((imageUrl, index) => (
              <div
                key={`${group.title}-${index}`}
                className="flex h-[43px] w-[76px] items-center justify-center rounded-[7px] border-2 border-[#F47C20] bg-white p-1"
              >
                <img
                  src={imageUrl}
                  alt={`${group.title} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-1 text-[6px] uppercase tracking-[0.12em] text-[#777]">
        Replace the temporary image URLs in AFFILIATION_IMAGES
      </div>
    </div>
  );
}

function ClosingPage({ itinerary }: { itinerary: Itinerary }) {
  return (
    <PdfPage footer={false} className="closing-page px-2 pb-[112px] pt-7 md:px-2 md:pt-7">
      <div className="grid grid-cols-[1.08fr_0.92fr] gap-4">
        <ProvisionTable itinerary={itinerary} />
        <Advantages advantages={itinerary.advantages || []} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <CompactPanel
          title="9. Stay and Field Comfort"
          bullets={itinerary.accommodationComfort?.bullets}
          closingStatement={itinerary.accommodationComfort?.closingStatement}
        />
        <CompactPanel
          title="10. Safety, Team & Local Expertise"
          bullets={itinerary.safetyTeam?.bullets}
          closingStatement={itinerary.safetyTeam?.closingStatement}
        />
      </div>
      <Recognitions />
      <div className="closing-footer absolute bottom-0 left-0 right-0 border-t-[4px] border-[#F47C20] bg-[#090909] px-4 pb-3 pt-3">
        <div className="flex items-end justify-between gap-5">
          <div>
            <div className="text-[24px] font-black leading-none text-white">TRAVEL. SLOWER. BETTER</div>
            <div className="mt-2 text-[18px] font-black italic text-[#F47C20]">#slowtravelling</div>
            <div className="mt-2 text-[6px] text-[#888]">© 2026 BETTADA JEEVA. ALL RIGHTS RESERVED.</div>
          </div>
          <div className="text-right">
            <div className="mb-2 font-serif text-[16px] italic text-[#F47C20]">See you on the journey!</div>
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[6px] text-[#4D8BC7]">
              <span>Expedition Essentials</span><span>Cancellation Policy</span><span>Safety Standards</span>
              <span>Terms and Condition</span><span>Sustainability</span><span>Map your Trip</span>
            </div>
          </div>
        </div>
      </div>
    </PdfPage>
  );
}

export default function ItineraryPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPdf, setSavingPdf] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const itineraryId = Array.isArray(id) ? id[0] : id;
    if (!itineraryId) return;
    let cancelled = false;

    async function loadItinerary() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/itineraries/${itineraryId}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load itinerary.");
        if (!cancelled) setItinerary(normalizePreviewItinerary(data.itinerary || {}, itineraryId));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load itinerary.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadItinerary();
    return () => { cancelled = true; };
  }, [id]);

  const phases = useMemo(() => itinerary?.itinerary || itinerary?.phases || [], [itinerary]);

  async function downloadPdf() {
    if (!itinerary || typeof window === "undefined") return;
    setSavingPdf(true);
    const oldTitle = document.title;
    const filename = tripNameOf(itinerary).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "itinerary";
    try {
      await Promise.all(
        Array.from(document.querySelectorAll<HTMLImageElement>("#pdf-content img"))
          .filter((image) => !image.complete)
          .map((image) => new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          })),
      );
      if (document.fonts?.ready) await document.fonts.ready;
      document.title = filename;
      window.print();
    } finally {
      window.setTimeout(() => {
        document.title = oldTitle;
        setSavingPdf(false);
      }, 800);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-400"><Loader2 className="h-5 w-5 animate-spin" />Loading itinerary...</div>
      </main>
    );
  }

  if (error || !itinerary) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black uppercase">Itinerary unavailable</h1>
          <p className="mt-3 text-sm text-zinc-500">{error || "The itinerary could not be found."}</p>
          <button onClick={() => router.back()} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F47C20] px-5 py-3 text-sm font-bold text-black">
            <ArrowLeft size={16} />Go Back
          </button>
        </div>
      </main>
    );
  }

  const tripName = tripNameOf(itinerary);

  return (
    <main className="min-h-screen bg-[#090909] text-white print:bg-[#080808]">
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div className="pdf-toolbar sticky top-0 z-50 border-b border-[#242424] bg-[#0D0D0D]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:text-white">
            <ArrowLeft size={16} />Back
          </button>
          <div className="hidden text-center sm:block">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">Preview</p>
            <p className="text-sm font-bold">{tripName}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => router.push(`/itineraries/${id}`)} className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white">
              <Edit3 size={14} />Edit
            </button>
            <button onClick={downloadPdf} disabled={savingPdf} title="Open the print dialog, then choose Save to PDF" className="inline-flex items-center gap-2 rounded-lg bg-[#F47C20] px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#FF963D] disabled:cursor-not-allowed disabled:opacity-60">
              {savingPdf ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {savingPdf ? "Preparing..." : "Save PDF"}
            </button>
          </div>
        </div>
      </div>

      <div id="pdf-content" className="mx-auto max-w-[900px] px-3 py-6 md:px-8 md:py-12">
        <CoverPage itinerary={itinerary} />
        {phases.map((phase, index) => (
          <TimelinePage key={index} phase={phase} index={index + 1} itinerary={itinerary} isLast={index === phases.length - 1} />
        ))}
        <ClosingPage itinerary={itinerary} />
      </div>
    </main>
  );
}
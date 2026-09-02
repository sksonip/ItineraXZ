export type StoredItinerary = {
  id: string;
  title: string;
  destination: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  travellers?: number;
  travelStyle?: string;
  description?: string;
  highlights?: string[];
  philosophy?: string;
  phases?: unknown[];
  pricing?: unknown;
  [key: string]: unknown;
  createdAt: string;
  updatedAt: string;
};

const globalForItineraries = globalThis as typeof globalThis & {
  itineraries?: Map<string, StoredItinerary>;
};

export const itineraries =
  globalForItineraries.itineraries ?? new Map<string, StoredItinerary>();

globalForItineraries.itineraries = itineraries;

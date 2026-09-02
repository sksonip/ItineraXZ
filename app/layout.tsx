import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ItineraXZ — AI Itinerary Builder",
    template: "%s | ItineraXZ",
  },

  description:
    "Build, customize and share intelligent travel itineraries with AI-assisted planning.",

  keywords: [
    "itinerary builder",
    "travel planner",
    "AI itinerary",
    "trip planner",
    "travel itinerary",
    "Gemini AI",
  ],

  applicationName: "ItineraXZ",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "ItineraXZ — AI Itinerary Builder",
    description:
      "Build and customize complete travel itineraries with AI-assisted planning.",
    type: "website",
    siteName: "ItineraXZ",
  },

  twitter: {
    card: "summary_large_image",
    title: "ItineraXZ — AI Itinerary Builder",
    description:
      "Build and customize complete travel itineraries with AI-assisted planning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
    >
      <body className="min-h-screen bg-[#090909] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
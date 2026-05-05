import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import CityTravelHighlightsPage from "@/components/travel-highlights/CityTravelHighlightsPage";

const cityDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-city-display",
});

const cityBody = Manrope({
  subsets: ["latin"],
  variable: "--font-city-body",
});

export const metadata: Metadata = {
  title: "Travel Highlights City | Ryan Deame",
  description:
    "City-themed travel highlights preview with blue-steel palettes, glass surfaces, and an urban archive grid.",
};

export default function CityTravelHighlightsRoute() {
  return (
    <div className={`${cityDisplay.variable} ${cityBody.variable} min-h-screen bg-[#111316]`}>
      <CityTravelHighlightsPage />
    </div>
  );
}

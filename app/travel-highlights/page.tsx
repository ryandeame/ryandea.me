import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";

import TravelHighlightsPage from "@/components/travel-highlights/TravelHighlightsPage";

const travelDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-travel-display",
});

const travelBody = Manrope({
  subsets: ["latin"],
  variable: "--font-travel-body",
});

export const metadata: Metadata = {
  title: "Travel Highlights | Ryan Deame",
  description:
    "A curated travel page highlighting featured experiences and every destination in Ryan Deame's photo archive.",
};

export default function TravelHighlightsRoute() {
  return (
    <div
      className={`${travelDisplay.variable} ${travelBody.variable} min-h-screen bg-[#f6f2ea] text-[#203040]`}
    >
      <TravelHighlightsPage />
    </div>
  );
}

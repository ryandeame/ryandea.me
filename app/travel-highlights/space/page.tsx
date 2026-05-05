import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import SpaceTravelHighlightsPage from "@/components/travel-highlights/SpaceTravelHighlightsPage";

const spaceDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-display",
});

const spaceBody = Manrope({
  subsets: ["latin"],
  variable: "--font-space-body",
});

export const metadata: Metadata = {
  title: "Travel Highlights Space | Ryan Deame",
  description:
    "Space-themed travel highlights preview with galaxy colors, luminous featured cards, and a cosmic archive grid.",
};

export default function SpaceTravelHighlightsRoute() {
  return (
    <div className={`${spaceDisplay.variable} ${spaceBody.variable} min-h-screen bg-[#0c0e12]`}>
      <SpaceTravelHighlightsPage />
    </div>
  );
}

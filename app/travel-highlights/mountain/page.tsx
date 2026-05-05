import type { Metadata } from "next";
import { Epilogue, Plus_Jakarta_Sans } from "next/font/google";

import MountainTravelHighlightsPage from "@/components/travel-highlights/MountainTravelHighlightsPage";

const mountainDisplay = Epilogue({
  subsets: ["latin"],
  variable: "--font-mountain-display",
});

const mountainBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-mountain-body",
});

export const metadata: Metadata = {
  title: "Travel Highlights Mountain | Ryan Deame",
  description:
    "Mountain-themed travel highlights preview with terrain-inspired layouts, wildlife mood, and an alpine archive grid.",
};

export default function MountainTravelHighlightsRoute() {
  return (
    <div className={`${mountainDisplay.variable} ${mountainBody.variable} min-h-screen bg-[#f7faf9]`}>
      <MountainTravelHighlightsPage />
    </div>
  );
}

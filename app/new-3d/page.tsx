import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import New3DPageClient from "@/components/new-3d/New3DPageClient";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-new-3d-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-new-3d-serif",
});

export const metadata: Metadata = {
  title: "Ryan Deame - 3D Portfolio",
  description:
    "The professional 3D developer portfolio of Ryan Deame, featuring parallax scrolling and immersive Three.js visuals.",
};

export default function New3DPage() {
  return (
    <New3DPageClient
      className={`${inter.variable} ${playfairDisplay.variable}`}
    />
  );
}

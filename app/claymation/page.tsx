import type { Metadata } from "next";

import { ClaymationPage } from "@/components/claymation";

export const metadata: Metadata = {
  title: "Claymation Direction | Ryan Deame",
  description: "A claymation-inspired visual direction study for a warmer, more personal site experience.",
};

export default function ClaymationRoutePage() {
  return <ClaymationPage />;
}

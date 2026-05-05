import type { Metadata } from "next";

import { BeenToBoxPage } from "@/components/been-to";

export const metadata: Metadata = {
  title: "Been-To-Box | Ryan Deame",
  description:
    "A flat 2D bento-box inspired travel archive built from Ryan Deame's destination photos.",
};

export default function Page() {
  return <BeenToBoxPage />;
}

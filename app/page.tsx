import type { Metadata } from "next";

import { ClaymationPage } from "@/components/claymation";

export const metadata: Metadata = {
  title: "Ryan Deame | Software Land",
  description:
    "A claymation-inspired software shop and product world by Ryan Deame.",
};

export default function Home() {
  return <ClaymationPage />;
}

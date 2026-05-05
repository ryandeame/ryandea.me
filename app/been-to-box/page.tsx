import type { Metadata } from "next";

import { BeenToBoxSplashPage } from "@/components/been-to";

export const metadata: Metadata = {
  title: "Been-To-Box | Ryan Deame",
  description:
    "A colorful travel bento app for turning places, photos, and global memories into a shareable profile.",
};

export default function Page() {
  return <BeenToBoxSplashPage />;
}

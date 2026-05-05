import type { Metadata } from "next";

import { BeenToBoxPage } from "@/components/been-to";
import BeenToBoxCityPage from "@/components/been-to/BeenToBoxCityPage";
import { getPublicBeenToBoxProfile } from "@/lib/public-profiles";

export const runtime = "nodejs";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicBeenToBoxProfile(slug);

  if (!profile) {
    return {
      title: "Been-To-Box Gallery | Ryan Deame",
    };
  }

  return {
    title: `${profile.displayName} (@${profile.username}) | Been-To-Box`,
    description: `View ${profile.displayName}'s Been-To-Box travel profile.`,
  };
}

export default async function BeenToBoxDynamicRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getPublicBeenToBoxProfile(slug);

  if (profile) {
    return <BeenToBoxPage profile={profile} />;
  }

  return <BeenToBoxCityPage />;
}

import type { Metadata } from "next";

import BeenToBoxCityPage from "@/components/been-to/BeenToBoxCityPage";
import { getPublicBeenToBoxProfile } from "@/lib/public-profiles";

export const runtime = "nodejs";

type PageProps = {
  params: Promise<{
    locationSlug: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, slug } = await params;
  const profile = await getPublicBeenToBoxProfile(slug);

  return {
    title: profile
      ? `${profile.displayName} | ${locationSlug} | Been-To-Box`
      : "Been-To-Box Gallery | Ryan Deame",
  };
}

export default async function BeenToBoxProfileLocationPage({ params }: PageProps) {
  const { locationSlug, slug } = await params;
  const profile = await getPublicBeenToBoxProfile(slug);

  if (!profile) {
    return <BeenToBoxCityPage locationSlug={locationSlug} />;
  }

  return (
    <BeenToBoxCityPage
      backHref={`/been-to-box/${profile.username}`}
      locationSlug={locationSlug}
      profileUid={profile.uid}
    />
  );
}

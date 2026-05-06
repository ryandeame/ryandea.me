import type { Metadata } from "next";

import BeenToBoxProfileLocationRoutePage from "@/components/been-to/BeenToBoxProfileLocationRoutePage";

type PageProps = {
  params: Promise<{
    locationSlug: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, slug } = await params;

  return {
    title: `${slug} | ${locationSlug} | Been-To-Box`,
  };
}

export default async function BeenToBoxProfileLocationPage({ params }: PageProps) {
  const { locationSlug, slug } = await params;

  return (
    <BeenToBoxProfileLocationRoutePage
      locationSlug={locationSlug}
      slug={slug}
    />
  );
}

import type { Metadata } from "next";

import BeenToBoxProfileRoutePage from "@/components/been-to/BeenToBoxProfileRoutePage";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug} | Been-To-Box`,
    description: "Open a shared Been-To-Box travel profile.",
  };
}

export default async function BeenToBoxDynamicRoutePage({ params }: PageProps) {
  const { slug } = await params;

  return <BeenToBoxProfileRoutePage slug={slug} />;
}

"use client";

import dynamic from "next/dynamic";

type New3DPageClientProps = {
  className?: string;
};

const New3DPortfolioPage = dynamic(
  () => import("@/components/new-3d/New3DPortfolioPage"),
  {
    ssr: false,
    loading: () => <main className="min-h-screen bg-[#050505] text-white" />,
  },
);

export default function New3DPageClient({
  className,
}: New3DPageClientProps) {
  return <New3DPortfolioPage className={className} />;
}

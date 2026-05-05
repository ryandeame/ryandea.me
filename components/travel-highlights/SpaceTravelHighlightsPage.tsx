"use client";

import Link from "next/link";
import { ArrowRight, Orbit, Rocket, Sparkles, Stars } from "lucide-react";

import VariantPreviewNav from "@/components/travel-highlights/VariantPreviewNav";
import {
  buildLocationMeta,
  formatCoordinatePair,
  toTitleCase,
  useTravelHighlightsData,
} from "@/components/travel-highlights/useTravelHighlightsData";

const sectorCopy = [
  {
    eyebrow: "Orbital Drift",
    description:
      "A gallery that feels less like a stop on the map and more like a shift in how the planet is perceived.",
    accent: "#6dddff",
    shell: "from-[#00d2fd]/55 via-[#27103d]/30 to-[#0c0e12]/80",
    chip: "bg-[#00d2fd]/15 text-[#8de9ff] ring-1 ring-[#00d2fd]/35",
  },
  {
    eyebrow: "Nebula Trace",
    description:
      "Vivid streets, strange light, and a sense of momentum that reads like a constellation in motion.",
    accent: "#ffabf3",
    shell: "from-[#ff00d4]/45 via-[#2c113f]/35 to-[#0c0e12]/85",
    chip: "bg-[#ff00d4]/15 text-[#ffc8ff] ring-1 ring-[#ff00d4]/35",
  },
  {
    eyebrow: "Starfall Quiet",
    description:
      "A destination where the archive expands outward and the smallest details begin to feel planetary.",
    accent: "#ffe792",
    shell: "from-[#ffd709]/38 via-[#201a0b]/35 to-[#0c0e12]/85",
    chip: "bg-[#ffd709]/15 text-[#ffeeb6] ring-1 ring-[#ffd709]/35",
  },
];

const nodePalette = [
  {
    bg: "bg-[#101418]/75",
    ring: "ring-[#434850]",
    accent: "text-[#8de9ff]",
    glow: "shadow-[0_0_0_1px_rgba(109,221,255,0.08),0_18px_45px_rgba(0,0,0,0.35)]",
  },
  {
    bg: "bg-[#16121b]/80",
    ring: "ring-[#3f2b4d]",
    accent: "text-[#ffb8f6]",
    glow: "shadow-[0_0_0_1px_rgba(255,171,243,0.08),0_18px_45px_rgba(0,0,0,0.35)]",
  },
  {
    bg: "bg-[#16140f]/80",
    ring: "ring-[#5a4b21]",
    accent: "text-[#ffe792]",
    glow: "shadow-[0_0_0_1px_rgba(255,231,146,0.08),0_18px_45px_rgba(0,0,0,0.35)]",
  },
];

export default function SpaceTravelHighlightsPage() {
  const { error, featuredLocations, loading, locations, stats } = useTravelHighlightsData();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0e12] font-[family-name:var(--font-space-body)] text-[#e1e6ef]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#432069_0%,rgba(12,14,18,0.2)_28%,transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(109,221,255,0.22),transparent_22%),radial-gradient(circle_at_65%_45%,rgba(255,0,212,0.18),transparent_24%),radial-gradient(circle_at_40%_80%,rgba(255,215,9,0.12),transparent_20%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(25deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:90px_90px]" />
        <div className="absolute left-[-8rem] top-[8rem] h-[32rem] w-[32rem] rounded-full border border-[#6dddff]/10" />
        <div className="absolute left-[14%] top-[5rem] h-[56rem] w-[56rem] rounded-full border border-[#6dddff]/8" />
        <div className="absolute right-[-12rem] top-[22rem] h-[34rem] w-[34rem] rounded-full border border-[#ffabf3]/10" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 pb-18 pt-12 md:px-10 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="mb-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.28em] text-[#8de9ff]">
          <span className="rounded-full bg-[#101418]/80 px-4 py-2 ring-1 ring-[#434850]">
            Celestial Highlights
          </span>
          <span className="rounded-full bg-[#181222]/80 px-4 py-2 text-[#ffc8ff] ring-1 ring-[#3f2b4d]">
            Galaxy Atlas
          </span>
        </div>
        <VariantPreviewNav
          className="mb-10"
          chipClassName="rounded-full bg-[#101418]/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#a7abb4] ring-1 ring-[#434850] transition-colors hover:text-[#8de9ff] hover:ring-[#6dddff]/40"
          activeClassName="bg-[#121c22] text-[#8de9ff] ring-[#6dddff]/45"
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.42em] text-[#8de9ff]/80">
              Travel highlights from the orbital deck
            </p>
            <h1 className="max-w-4xl font-[family-name:var(--font-space-display)] text-5xl font-semibold leading-[0.88] tracking-[0.02em] text-white md:text-7xl">
              The world gets stranger,
              <span className="block bg-[linear-gradient(90deg,#6dddff,#ffabf3,#ffe792)] bg-clip-text text-transparent">
                wider, and more luminous.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#a7abb4]">
              A cosmic reading of the archive: featured sectors first, location nodes below,
              and a visual system shaped by nebula color, glass surfaces, and the feeling
              of looking back at Earth from a broader frame.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#top-experiences"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#00d2fd,#6dddff)] px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-[#08212b] transition-transform hover:-translate-y-0.5"
              >
                Enter top sectors
                <Rocket className="h-4 w-4" />
              </Link>
              <Link
                href="#all-locations"
                className="inline-flex items-center gap-2 rounded-full bg-[#101418]/85 px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-[#ffe792] ring-1 ring-[#434850] transition-colors hover:text-white"
              >
                Scan archive
                <Orbit className="h-4 w-4" />
              </Link>
              <Link
                href="/travel"
                className="inline-flex items-center gap-2 rounded-full bg-[#181222]/85 px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-[#ffc8ff] ring-1 ring-[#3f2b4d]"
              >
                Open globe
                <Stars className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.5rem] bg-[#101418]/85 p-6 ring-1 ring-[#434850] backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#8de9ff]">
                Nodes
              </p>
              <p className="mt-4 text-4xl font-black text-white">
                {loading ? "..." : stats.totalLocations}
              </p>
              <p className="mt-2 text-sm text-[#a7abb4]">Destinations charted in this atlas</p>
            </div>
            <div className="rounded-[1.5rem] bg-[#16121b]/85 p-6 ring-1 ring-[#3f2b4d] backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ffc8ff]">
                Captures
              </p>
              <p className="mt-4 text-4xl font-black text-white">
                {loading ? "..." : stats.totalPhotos}
              </p>
              <p className="mt-2 text-sm text-[#b8afc4]">Frames currently orbiting the archive</p>
            </div>
            <div className="rounded-[1.5rem] bg-[#16140f]/85 p-6 ring-1 ring-[#5a4b21] backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ffe792]">
                Horizons
              </p>
              <p className="mt-4 text-4xl font-black text-white">
                {loading ? "..." : stats.hemispheres}
              </p>
              <p className="mt-2 text-sm text-[#cbc1a0]">Planetary hemispheres represented</p>
            </div>
          </div>
        </div>
      </section>

      <section id="top-experiences" className="relative mx-auto max-w-7xl px-6 pb-16 md:px-10 lg:px-12 lg:pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-[#8de9ff]">
              Featured sectors
            </p>
            <h2 className="font-[family-name:var(--font-space-display)] text-4xl font-semibold tracking-[0.02em] text-white md:text-5xl">
              Top experiences with orbital pull
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#a7abb4]">
            Glowing cards for the most magnetic stops in the archive, inspired by the
            Celestial Navigator concept from Stitch.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredLocations.map((location, index) => {
            const sector = sectorCopy[index % sectorCopy.length];

            return (
              <article
                key={location.id}
                className="group overflow-hidden rounded-[1.8rem] bg-[#101418]/70 ring-1 ring-[#434850] backdrop-blur-xl"
              >
                <div className="relative h-80 overflow-hidden">
                  {location.heroImage ? (
                    <img
                      src={location.heroImage}
                      alt={location.name ?? "Travel highlight"}
                      className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#16121b] text-[#8de9ff]">
                      <Sparkles className="h-10 w-10" />
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-b ${sector.shell}`} />
                  <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em] ${sector.chip}`}>
                      {sector.eyebrow}
                    </span>
                    <span className="rounded-full bg-black/35 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-white/10">
                      {location.photoCount} captures
                    </span>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <p className="text-sm font-black uppercase tracking-[0.22em]" style={{ color: sector.accent }}>
                    {buildLocationMeta(location)}
                  </p>
                  <h3 className="font-[family-name:var(--font-space-display)] text-3xl font-semibold tracking-[0.02em] text-white">
                    {location.name ?? "Untitled node"}
                  </h3>
                  <p className="text-sm leading-7 text-[#a7abb4]">{sector.description}</p>
                  {location.slug ? (
                    <Link
                      href={`/travel/${location.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#8de9ff] transition-colors hover:text-white"
                    >
                      Open sector
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="all-locations" className="relative border-t border-[#1f242a] bg-[#0f1115]/95 px-6 py-16 md:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-[#ffe792]">
                Global node index
              </p>
              <h2 className="font-[family-name:var(--font-space-display)] text-4xl font-semibold tracking-[0.02em] text-white md:text-5xl">
                Every destination in the system
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#a7abb4]">
              Flatter location cards keep the scanability high while still holding the galaxy
              palette together.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-44 animate-pulse rounded-[1.5rem] bg-[#101418] ring-1 ring-[#1f242a]" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[1.5rem] bg-[#16121b] p-6 text-sm font-semibold text-[#ffc8ff] ring-1 ring-[#3f2b4d]">
              {error}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {locations.map((location, index) => {
                const style = nodePalette[index % nodePalette.length];
                const coordinateLabel = formatCoordinatePair(location.lat, location.lon);

                return (
                  <article
                    key={location.id}
                    className={`flex min-h-56 flex-col justify-between rounded-[1.5rem] p-5 ring-1 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 ${style.bg} ${style.ring} ${style.glow}`}
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className={`rounded-full bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${style.accent}`}>
                          {toTitleCase(location.continent ?? "Archive")}
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#7d838f]">
                          {location.photoCount} shots
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-space-display)] text-3xl font-semibold tracking-[0.02em] text-white">
                        {location.name ?? "Untitled node"}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#a7abb4]">
                        {buildLocationMeta(location)}
                      </p>
                      {coordinateLabel ? (
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-[#7d838f]">
                          {coordinateLabel}
                        </p>
                      ) : null}
                    </div>
                    {location.slug ? (
                      <div className="mt-6">
                        <Link
                          href={`/travel/${location.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#e1e6ef] transition-colors hover:text-[#8de9ff]"
                        >
                          View gallery
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

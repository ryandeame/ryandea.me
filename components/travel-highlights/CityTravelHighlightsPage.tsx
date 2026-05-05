"use client";

import Link from "next/link";
import { ArrowRight, Building2, Map, TrainFront, Waypoints } from "lucide-react";

import VariantPreviewNav from "@/components/travel-highlights/VariantPreviewNav";
import {
  buildLocationMeta,
  formatCoordinatePair,
  toTitleCase,
  useTravelHighlightsData,
} from "@/components/travel-highlights/useTravelHighlightsData";

const vectorCopy = [
  {
    eyebrow: "Tokyo Velocity",
    description:
      "Glass reflections, transit rhythm, and the feeling of stepping into a city already in motion.",
    accent: "#00f4fe",
    panel: "bg-[#1a1c1f]/95 ring-[#41474f]",
    chip: "bg-[#00f4fe]/15 text-[#9cfbff]",
  },
  {
    eyebrow: "London Steel",
    description:
      "Architecture, signal lines, and layered infrastructure reframed as a clean editorial travel moment.",
    accent: "#adcbdf",
    panel: "bg-[#1e2023]/95 ring-[#41474f]",
    chip: "bg-[#adcbdf]/14 text-[#d6e9f5]",
  },
  {
    eyebrow: "NYC Vertical",
    description:
      "Density, skyline drama, and sharp white highlights tuned into a sleek metropolitan pulse.",
    accent: "#e6feff",
    panel: "bg-[#16181b]/95 ring-[#41474f]",
    chip: "bg-[#e6feff]/14 text-[#f2feff]",
  },
];

const networkPalette = [
  { bg: "bg-[#1a1c1f]", border: "border-[#41474f]", accent: "text-[#00f4fe]" },
  { bg: "bg-[#1e2023]", border: "border-[#41474f]", accent: "text-[#adcbdf]" },
  { bg: "bg-[#141619]", border: "border-[#34383f]", accent: "text-[#e6feff]" },
  { bg: "bg-[#202327]", border: "border-[#4a515b]", accent: "text-[#c8e7fb]" },
];

export default function CityTravelHighlightsPage() {
  const { error, featuredLocations, loading, locations, stats } = useTravelHighlightsData();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#111316] font-[family-name:var(--font-city-body)] text-[#e2e2e6]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(173,203,223,0.16),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />
        <div className="absolute inset-x-0 top-0 h-[26rem] bg-[linear-gradient(180deg,rgba(173,203,223,0.14),transparent)]" />
        <div className="absolute inset-x-0 top-[24rem] h-[18rem] bg-[linear-gradient(to_top,rgba(0,0,0,0.28),transparent)] [clip-path:polygon(0_100%,0_56%,8%_56%,8%_42%,14%_42%,14%_64%,20%_64%,20%_34%,28%_34%,28%_58%,36%_58%,36%_24%,45%_24%,45%_67%,52%_67%,52%_38%,60%_38%,60%_72%,68%_72%,68%_28%,77%_28%,77%_61%,85%_61%,85%_45%,92%_45%,92%_70%,100%_70%,100%_100%)]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 pb-18 pt-12 md:px-10 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="mb-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.28em] text-[#adcbdf]">
          <span className="rounded-full bg-[#1a1c1f]/90 px-4 py-2 ring-1 ring-[#41474f]">
            Metropole Flux
          </span>
          <span className="rounded-full bg-[#16181b]/90 px-4 py-2 text-[#9cfbff] ring-1 ring-[#23444a]">
            Steel / Glass / Motion
          </span>
        </div>
        <VariantPreviewNav
          className="mb-10"
          chipClassName="rounded-full bg-[#1a1c1f]/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8b919a] ring-1 ring-[#41474f] transition-colors hover:text-[#e6feff]"
          activeClassName="bg-[#202327] text-[#9cfbff] ring-[#00f4fe]/30"
        />

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.38em] text-[#adcbdf]/80">
              The structural pulse
            </p>
            <h1 className="max-w-4xl font-[family-name:var(--font-city-display)] text-5xl font-semibold leading-[0.9] tracking-[-0.03em] text-white md:text-7xl">
              Travel through skylines,
              <span className="block text-[#9cfbff]">transit lines, and blue steel light.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1c7d0]">
              This version is metropolitan and kinetic: layered panels, glass reflections,
              architecture-led composition, and flatter location cards that still feel
              premium and fast to scan.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#top-experiences"
                className="inline-flex items-center gap-2 rounded-md bg-[linear-gradient(135deg,#7795a7,#adcbdf)] px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#153443] transition-transform hover:-translate-y-0.5"
              >
                Open city vectors
                <Waypoints className="h-4 w-4" />
              </Link>
              <Link
                href="#all-locations"
                className="inline-flex items-center gap-2 rounded-md bg-[#1a1c1f]/90 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#e6feff] ring-1 ring-[#41474f]"
              >
                View network nodes
                <Map className="h-4 w-4" />
              </Link>
              <Link
                href="/travel"
                className="inline-flex items-center gap-2 rounded-md bg-[#16181b]/90 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#9cfbff] ring-1 ring-[#23444a]"
              >
                Globe route
                <TrainFront className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.35rem] bg-[#1a1c1f]/95 p-6 ring-1 ring-[#41474f]">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#adcbdf]">
                Nodes
              </p>
              <p className="mt-4 text-4xl font-black text-white">
                {loading ? "..." : stats.totalLocations}
              </p>
              <p className="mt-2 text-sm text-[#c1c7d0]">Destinations in the global network</p>
            </div>
            <div className="rounded-[1.35rem] bg-[#1e2023]/95 p-6 ring-1 ring-[#41474f]">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#9cfbff]">
                Frames
              </p>
              <p className="mt-4 text-4xl font-black text-white">
                {loading ? "..." : stats.totalPhotos}
              </p>
              <p className="mt-2 text-sm text-[#c1c7d0]">Images currently in circulation</p>
            </div>
            <div className="rounded-[1.35rem] bg-[#141619]/95 p-6 ring-1 ring-[#34383f]">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e6feff]">
                Reach
              </p>
              <p className="mt-4 text-4xl font-black text-white">
                {loading ? "..." : stats.hemispheres}
              </p>
              <p className="mt-2 text-sm text-[#c1c7d0]">Hemispheres connected</p>
            </div>
          </div>
        </div>
      </section>

      <section id="top-experiences" className="relative mx-auto max-w-7xl px-6 pb-16 md:px-10 lg:px-12 lg:pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-[#adcbdf]">
              Top experiences
            </p>
            <h2 className="font-[family-name:var(--font-city-display)] text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              Urban highlights with momentum
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#c1c7d0]">
            A sharper, cosmopolitan reading of the archive inspired by the Metropole Flux
            Stitch concept.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredLocations.map((location, index) => {
            const vector = vectorCopy[index % vectorCopy.length];

            return (
              <article
                key={location.id}
                className={`group overflow-hidden rounded-[1.45rem] ring-1 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-md ${vector.panel}`}
              >
                <div className="relative h-80 overflow-hidden">
                  {location.heroImage ? (
                    <img
                      src={location.heroImage}
                      alt={location.name ?? "Travel highlight"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#202327] text-[#9cfbff]">
                      <Building2 className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,19,22,0.82),rgba(17,19,22,0.12)_55%,transparent)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.12)_46%,transparent_58%)] opacity-50" />
                  <div className="absolute left-5 top-5">
                    <span className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em] ${vector.chip}`}>
                      {vector.eyebrow}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.22em]" style={{ color: vector.accent }}>
                        {buildLocationMeta(location)}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-city-display)] text-3xl font-semibold tracking-[-0.03em] text-white">
                        {location.name ?? "Untitled city"}
                      </h3>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#c1c7d0] ring-1 ring-white/8">
                      {location.photoCount} shots
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-[#c1c7d0]">{vector.description}</p>
                  {location.slug ? (
                    <Link
                      href={`/travel/${location.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#e6feff] transition-colors hover:text-[#9cfbff]"
                    >
                      Open gallery
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="all-locations" className="relative border-t border-[#23282e] bg-[#0f1114]/95 px-6 py-16 md:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-[#9cfbff]">
                Global network
              </p>
              <h2 className="font-[family-name:var(--font-city-display)] text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                Every city node across the archive
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#c1c7d0]">
              These flatter cards keep the information clear while the blue-steel palette and
              glass-like contrast preserve the city mood.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-44 animate-pulse rounded-[1.35rem] bg-[#1a1c1f] ring-1 ring-[#23282e]" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[1.35rem] bg-[#1a1c1f] p-6 text-sm font-semibold text-[#9cfbff] ring-1 ring-[#23444a]">
              {error}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {locations.map((location, index) => {
                const style = networkPalette[index % networkPalette.length];
                const coordinateLabel = formatCoordinatePair(location.lat, location.lon);

                return (
                  <article
                    key={location.id}
                    className={`flex min-h-56 flex-col justify-between rounded-[1.35rem] border p-5 transition-transform duration-300 hover:-translate-y-1 ${style.bg} ${style.border}`}
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className={`rounded-full bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${style.accent}`}>
                          {toTitleCase(location.continent ?? "Archive")}
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8b919a]">
                          {location.photoCount} photos
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-city-display)] text-3xl font-semibold tracking-[-0.03em] text-white">
                        {location.name ?? "Untitled node"}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#c1c7d0]">
                        {buildLocationMeta(location)}
                      </p>
                      {coordinateLabel ? (
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-[#8b919a]">
                          {coordinateLabel}
                        </p>
                      ) : null}
                    </div>
                    {location.slug ? (
                      <div className="mt-6">
                        <Link
                          href={`/travel/${location.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#e6feff] transition-colors hover:text-[#9cfbff]"
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

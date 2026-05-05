"use client";

import Link from "next/link";
import { ArrowRight, Bird, Compass, Mountain, Trees } from "lucide-react";

import VariantPreviewNav from "@/components/travel-highlights/VariantPreviewNav";
import {
  buildLocationMeta,
  formatCoordinatePair,
  toTitleCase,
  useTravelHighlightsData,
} from "@/components/travel-highlights/useTravelHighlightsData";

const ridgeCopy = [
  {
    eyebrow: "Wildlife Passage",
    description:
      "A featured gallery with the energy of migration, weather, and animal movement across open terrain.",
    badge: "bg-[#dce6d0] text-[#404a39]",
    panel: "bg-[#f1f4f3]",
    accent: "#586150",
  },
  {
    eyebrow: "Granite Spine",
    description:
      "A place where the archive leans into altitude, hard edges, and the rhythm of long terrain lines.",
    badge: "bg-[#c7e8f5] text-[#1d3d47]",
    panel: "bg-[#eef4f5]",
    accent: "#1d3d47",
  },
  {
    eyebrow: "Glacial Blue",
    description:
      "A calm, elevated stop built around sky clarity, cold light, and the wider feeling of open ground.",
    badge: "bg-[#ffdbce] text-[#7f2b00]",
    panel: "bg-[#f8f1ee]",
    accent: "#672200",
  },
];

const terrainPalette = [
  { bg: "bg-[#ffffff]", border: "border-[#d7dbda]", accent: "text-[#1d3d47]" },
  { bg: "bg-[#f1f4f3]", border: "border-[#d7dbda]", accent: "text-[#586150]" },
  { bg: "bg-[#f7f3ef]", border: "border-[#ead5ca]", accent: "text-[#672200]" },
  { bg: "bg-[#eef4f5]", border: "border-[#d0e3ea]", accent: "text-[#2c4b55]" },
];

export default function MountainTravelHighlightsPage() {
  const { error, featuredLocations, loading, locations, stats } = useTravelHighlightsData();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7faf9] font-[family-name:var(--font-mountain-body)] text-[#181c1c]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(199,232,245,0.7),transparent_58%)]" />
        <div className="absolute inset-x-0 top-[16rem] h-[18rem] bg-[radial-gradient(circle_at_20%_30%,rgba(217,227,205,0.55),transparent_24%),radial-gradient(circle_at_75%_10%,rgba(255,181,152,0.28),transparent_20%)]" />
        <div className="absolute inset-x-0 top-[18rem] h-[34rem] opacity-35" style={{ backgroundImage: "repeating-linear-gradient(165deg, rgba(114,120,123,0.06) 0, rgba(114,120,123,0.06) 2px, transparent 2px, transparent 22px)" }} />
        <div className="absolute left-0 right-0 top-[24rem] h-[15rem] bg-[linear-gradient(to_top,#d7dbda_0%,#ebeeed_34%,transparent_100%)] [clip-path:polygon(0_100%,0_55%,14%_62%,28%_39%,42%_58%,57%_30%,73%_56%,86%_38%,100%_52%,100%_100%)]" />
        <div className="absolute left-0 right-0 top-[30rem] h-[13rem] bg-[linear-gradient(to_top,#c7ccc8_0%,#e1e6e1_40%,transparent_100%)] [clip-path:polygon(0_100%,0_62%,18%_48%,31%_72%,45%_44%,61%_68%,76%_41%,90%_63%,100%_46%,100%_100%)]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 pb-18 pt-12 md:px-10 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="mb-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.28em] text-[#1d3d47]">
          <span className="rounded-full bg-white/90 px-4 py-2 ring-1 ring-[#c1c7ca]">
            Alpine Odyssey
          </span>
          <span className="rounded-full bg-[#dce6d0] px-4 py-2 text-[#404a39] ring-1 ring-[#c0cab4]">
            Terrain & Wildlife
          </span>
        </div>
        <VariantPreviewNav
          className="mb-10"
          chipClassName="rounded-full bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#5a6266] ring-1 ring-[#d7dbda] transition-colors hover:text-[#1d3d47]"
          activeClassName="bg-[#eef4f5] text-[#1d3d47] ring-[#c7e8f5]"
        />

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.38em] text-[#44636e]">
              The spirit of the high ground
            </p>
            <h1 className="max-w-4xl font-[family-name:var(--font-mountain-display)] text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-[#032731] md:text-7xl">
              A cleaner archive
              <span className="block text-[#586150]">for altitude, land, and motion.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#41484a]">
              This direction leans into alpine air, contour rhythm, and a quieter premium
              outdoor feel. Featured experiences pull forward first, then the full location
              grid spreads across the page like a modern basecamp index.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#top-experiences"
                className="inline-flex items-center gap-2 rounded-md bg-[#032731] px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#1d3d47]"
              >
                Explore ridgelines
                <Mountain className="h-4 w-4" />
              </Link>
              <Link
                href="#all-locations"
                className="inline-flex items-center gap-2 rounded-md bg-white/85 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#1d3d47] ring-1 ring-[#c1c7ca]"
              >
                Browse basecamps
                <Compass className="h-4 w-4" />
              </Link>
              <Link
                href="/travel"
                className="inline-flex items-center gap-2 rounded-md bg-[#dce6d0] px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#404a39]"
              >
                Globe view
                <Trees className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.6rem] bg-white/90 p-6 ring-1 ring-[#d7dbda]">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#1d3d47]">
                Locations
              </p>
              <p className="mt-4 text-4xl font-black text-[#032731]">
                {loading ? "..." : stats.totalLocations}
              </p>
              <p className="mt-2 text-sm text-[#41484a]">Destinations in the terrain archive</p>
            </div>
            <div className="rounded-[1.6rem] bg-[#f1f4f3] p-6 ring-1 ring-[#d7dbda]">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#586150]">
                Photos
              </p>
              <p className="mt-4 text-4xl font-black text-[#404a39]">
                {loading ? "..." : stats.totalPhotos}
              </p>
              <p className="mt-2 text-sm text-[#535b56]">Moments carried back from the field</p>
            </div>
            <div className="rounded-[1.6rem] bg-[#f7f3ef] p-6 ring-1 ring-[#ead5ca]">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#672200]">
                Horizons
              </p>
              <p className="mt-4 text-4xl font-black text-[#672200]">
                {loading ? "..." : stats.hemispheres}
              </p>
              <p className="mt-2 text-sm text-[#7f2b00]">Hemispheres represented</p>
            </div>
          </div>
        </div>
      </section>

      <section id="top-experiences" className="relative mx-auto max-w-7xl px-6 pb-16 md:px-10 lg:px-12 lg:pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-[#44636e]">
              Top experiences
            </p>
            <h2 className="font-[family-name:var(--font-mountain-display)] text-4xl font-semibold tracking-[-0.04em] text-[#032731] md:text-5xl">
              Featured terrain stories
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#535b56]">
            The stitch direction translated into a lighter, more grounded page with contour
            energy, wildlife cues, and roomy premium cards.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          {featuredLocations.map((location, index) => {
            const ridge = ridgeCopy[index % ridgeCopy.length];

            return (
              <article
                key={location.id}
                className={`group overflow-hidden rounded-[1.8rem] ring-1 ring-[#d7dbda] ${ridge.panel}`}
              >
                <div className="relative h-80 overflow-hidden">
                  {location.heroImage ? (
                    <img
                      src={location.heroImage}
                      alt={location.name ?? "Travel highlight"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#1d3d47] text-white">
                      <Bird className="h-10 w-10 opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#032731]/65 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5">
                    <span className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em] ${ridge.badge}`}>
                      {ridge.eyebrow}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.22em]" style={{ color: ridge.accent }}>
                        {buildLocationMeta(location)}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-mountain-display)] text-3xl font-semibold tracking-[-0.04em] text-[#032731]">
                        {location.name ?? "Untitled basecamp"}
                      </h3>
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#535b56]">
                      {location.photoCount} frames
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-[#41484a]">{ridge.description}</p>
                  {location.slug ? (
                    <Link
                      href={`/travel/${location.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#032731] transition-colors hover:text-[#44636e]"
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

      <section id="all-locations" className="relative border-t border-[#d7dbda] bg-[#f1f4f3]/70 px-6 py-16 md:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-[#586150]">
                All locations
              </p>
              <h2 className="font-[family-name:var(--font-mountain-display)] text-4xl font-semibold tracking-[-0.04em] text-[#032731] md:text-5xl">
                Every destination across the ridge
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#535b56]">
              Flat cards across the page keep the archive readable while still carrying the
              mountain palette and land-based rhythm.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-44 animate-pulse rounded-[1.5rem] bg-white/80 ring-1 ring-[#d7dbda]" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[1.5rem] bg-[#ffdbce] p-6 text-sm font-semibold text-[#7f2b00] ring-1 ring-[#ead5ca]">
              {error}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {locations.map((location, index) => {
                const style = terrainPalette[index % terrainPalette.length];
                const coordinateLabel = formatCoordinatePair(location.lat, location.lon);

                return (
                  <article
                    key={location.id}
                    className={`flex min-h-56 flex-col justify-between rounded-[1.5rem] border p-5 transition-transform duration-300 hover:-translate-y-1 ${style.bg} ${style.border}`}
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className={`rounded-full bg-white/85 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${style.accent}`}>
                          {toTitleCase(location.continent ?? "Archive")}
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-[#72787b]">
                          {location.photoCount} photos
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-mountain-display)] text-3xl font-semibold tracking-[-0.04em] text-[#032731]">
                        {location.name ?? "Untitled location"}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#41484a]">
                        {buildLocationMeta(location)}
                      </p>
                      {coordinateLabel ? (
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-[#72787b]">
                          {coordinateLabel}
                        </p>
                      ) : null}
                    </div>
                    {location.slug ? (
                      <div className="mt-6">
                        <Link
                          href={`/travel/${location.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#032731] transition-colors hover:text-[#44636e]"
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

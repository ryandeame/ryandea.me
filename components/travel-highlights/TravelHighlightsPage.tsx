"use client";

import Link from "next/link";
import { ArrowRight, Compass, Globe2, MapPinned } from "lucide-react";
import VariantPreviewNav from "@/components/travel-highlights/VariantPreviewNav";
import {
  buildLocationMeta,
  formatCoordinatePair,
  toTitleCase,
  useTravelHighlightsData,
} from "@/components/travel-highlights/useTravelHighlightsData";

type ExperienceCopy = {
  eyebrow: string;
  body: string;
  accent: string;
  cardBg: string;
  chipBg: string;
};

const featuredCopy: ExperienceCopy[] = [
  {
    eyebrow: "Perspective Shift",
    body: "A place that instantly widens the frame and makes the trip feel larger than the itinerary.",
    accent: "#1E6FA8",
    cardBg: "#E3F1F8",
    chipBg: "#C8E6F4",
  },
  {
    eyebrow: "Street Rhythm",
    body: "A stop defined by movement, small details, and the everyday textures that give travel its energy.",
    accent: "#F46F52",
    cardBg: "#FDE7E1",
    chipBg: "#F9D0C6",
  },
  {
    eyebrow: "Wide Horizon",
    body: "A destination that brings scale, atmosphere, and the feeling of seeing the world from a calmer vantage point.",
    accent: "#0F2747",
    cardBg: "#DDE8F5",
    chipBg: "#C3D4EA",
  },
];

const locationCardPalette = [
  { bg: "#E6F3F8", border: "#B9DDEB", accent: "#1E6FA8" },
  { bg: "#FDE9E2", border: "#F5C6B9", accent: "#F46F52" },
  { bg: "#FFF0C9", border: "#F2D985", accent: "#C08A15" },
  { bg: "#E5F5EE", border: "#B9E0D1", accent: "#2E8A71" },
];

export default function TravelHighlightsPage() {
  const { error, featuredLocations, loading, locations, stats } = useTravelHighlightsData();

  return (
    <main className="relative overflow-hidden font-[family-name:var(--font-travel-body)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-8rem] h-[22rem] w-[22rem] rounded-full bg-[#7FD1C4]/35 blur-3xl" />
        <div className="absolute right-[-6rem] top-[10rem] h-[18rem] w-[18rem] rounded-full bg-[#F46F52]/20 blur-3xl" />
        <div className="absolute left-1/3 top-[28rem] h-[20rem] w-[20rem] rounded-full bg-[#F5C24B]/20 blur-3xl" />
        <div
          className="absolute inset-x-0 top-[8rem] h-[40rem] opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0, transparent 28px, rgba(30,111,168,0.08) 28px, rgba(30,111,168,0.08) 30px)",
          }}
        />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-12 md:px-10 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.26em] text-[#1E6FA8]">
          <span className="rounded-full border border-[#B9DDEB] bg-white/80 px-4 py-2">
            Travel Highlights
          </span>
          <span className="rounded-full border border-[#F5C6B9] bg-[#FDE9E2] px-4 py-2 text-[#B34F39]">
            Global Perspective
          </span>
        </div>
        <VariantPreviewNav
          className="mb-8"
          chipClassName="rounded-full border border-[#0F2747]/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#36506A] transition-colors hover:border-[#1E6FA8] hover:text-[#1E6FA8]"
          activeClassName="border-[#1E6FA8] bg-[#E6F3F8] text-[#1E6FA8]"
        />

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-4 max-w-2xl text-sm font-semibold uppercase tracking-[0.35em] text-[#1E6FA8]/80">
              Curated from the photo archive
            </p>
            <h1 className="max-w-4xl font-[family-name:var(--font-travel-display)] text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-[#0F2747] md:text-7xl">
              Travel that keeps widening the frame.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#36506A]">
              A cleaner way to explore the archive: featured perspectives up top,
              every destination below, and a visual language built around motion,
              curiosity, and appreciation for how big the world really is.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#top-experiences"
                className="inline-flex items-center gap-2 rounded-full bg-[#0F2747] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1E6FA8]"
              >
                See top experiences
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#all-locations"
                className="inline-flex items-center gap-2 rounded-full border border-[#0F2747]/15 bg-white/80 px-6 py-3 text-sm font-bold text-[#0F2747] transition-colors hover:border-[#1E6FA8] hover:text-[#1E6FA8]"
              >
                Browse all locations
                <MapPinned className="h-4 w-4" />
              </Link>
              <Link
                href="/travel"
                className="inline-flex items-center gap-2 rounded-full border border-[#7FD1C4] bg-[#E8F7F4] px-6 py-3 text-sm font-bold text-[#1D6F63] transition-colors hover:bg-[#D8F1EB]"
              >
                Open globe view
                <Globe2 className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[2rem] border border-[#B9DDEB] bg-[#E6F3F8] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#1E6FA8]">
                Locations
              </p>
              <p className="mt-4 text-4xl font-black text-[#0F2747]">
                {loading ? "..." : stats.totalLocations}
              </p>
              <p className="mt-2 text-sm text-[#36506A]">Destinations captured so far</p>
            </div>
            <div className="rounded-[2rem] border border-[#F5C6B9] bg-[#FDE9E2] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#B34F39]">
                Photos
              </p>
              <p className="mt-4 text-4xl font-black text-[#7A3426]">
                {loading ? "..." : stats.totalPhotos}
              </p>
              <p className="mt-2 text-sm text-[#8A4A3A]">Moments currently in the archive</p>
            </div>
            <div className="rounded-[2rem] border border-[#EBCF7A] bg-[#FFF0C9] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#936B0C]">
                Perspective
              </p>
              <p className="mt-4 text-4xl font-black text-[#6B4F0D]">
                {loading ? "..." : stats.hemispheres}
              </p>
              <p className="mt-2 text-sm text-[#7B6519]">Hemispheres represented</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="top-experiences"
        className="relative mx-auto max-w-7xl px-6 pb-14 md:px-10 lg:px-12 lg:pb-24"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#1E6FA8]">
              Top Experiences
            </p>
            <h2 className="font-[family-name:var(--font-travel-display)] text-4xl font-semibold tracking-[-0.04em] text-[#0F2747] md:text-5xl">
              Featured stops from the archive
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#4B6178]">
            These lead cards spotlight a few favorite perspectives first, then the full
            destination list carries the rest of the archive across the page.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          {featuredLocations.map((location, index) => {
            const copy = featuredCopy[index % featuredCopy.length];

            return (
              <article
                key={location.id}
                className="group overflow-hidden rounded-[2rem] border border-black/5"
                style={{ backgroundColor: copy.cardBg }}
              >
                <div className="relative h-72 overflow-hidden lg:h-[28rem]">
                  {location.heroImage ? (
                    <img
                      src={location.heroImage}
                      alt={location.name ?? "Travel highlight"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#0F2747] text-white">
                      <Compass className="h-10 w-10 opacity-70" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2747]/70 via-[#0F2747]/10 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.24em]"
                    style={{ backgroundColor: copy.chipBg, color: copy.accent }}>
                    {copy.eyebrow}
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: copy.accent }}>
                        {buildLocationMeta(location)}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-travel-display)] text-3xl font-semibold tracking-[-0.04em] text-[#0F2747]">
                        {location.name ?? "Untitled destination"}
                      </h3>
                    </div>
                    <span className="rounded-full bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#36506A]">
                      {location.photoCount} shots
                    </span>
                  </div>

                  <p className="max-w-md text-sm leading-7 text-[#3D546A]">
                    {copy.body}
                  </p>

                  {location.slug ? (
                    <Link
                      href={`/travel/${location.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#0F2747] transition-colors hover:text-[#1E6FA8]"
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

      <section
        id="all-locations"
        className="relative border-t border-[#D8D1C5] bg-white/55 px-6 py-14 md:px-10 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#1E6FA8]">
                All Locations
              </p>
              <h2 className="font-[family-name:var(--font-travel-display)] text-4xl font-semibold tracking-[-0.04em] text-[#0F2747] md:text-5xl">
                Every destination, all in one sweep
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#4B6178]">
              A flat, fast-scanning grid for the whole archive, tuned for names, count,
              and direct access to each gallery without losing the playful visual tone.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-[1.75rem] border border-[#D8D1C5] bg-white/80"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-[#F5C6B9] bg-[#FDE9E2] p-6 text-sm font-semibold text-[#8A4A3A]">
              {error}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {locations.map((location, index) => {
                const palette = locationCardPalette[index % locationCardPalette.length];
                const coordinateLabel = formatCoordinatePair(location.lat, location.lon);

                return (
                  <article
                    key={location.id}
                    className="flex min-h-52 flex-col justify-between rounded-[1.75rem] border p-5 transition-transform duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: palette.bg, borderColor: palette.border }}
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span
                          className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em]"
                          style={{ backgroundColor: "rgba(255,255,255,0.72)", color: palette.accent }}
                        >
                          {toTitleCase(location.continent ?? "Archive")}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#4B6178]">
                          {location.photoCount} photos
                        </span>
                      </div>

                      <h3 className="font-[family-name:var(--font-travel-display)] text-3xl font-semibold tracking-[-0.04em] text-[#0F2747]">
                        {location.name ?? "Untitled location"}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#3D546A]">
                        {buildLocationMeta(location)}
                      </p>
                      {coordinateLabel ? (
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5A748C]">
                          {coordinateLabel}
                        </p>
                      ) : null}
                    </div>

                    {location.slug ? (
                      <div className="mt-6">
                        <Link
                          href={`/travel/${location.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#0F2747] transition-colors hover:text-[#1E6FA8]"
                        >
                          View gallery
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#5A748C]">
                        Gallery pending
                      </div>
                    )}
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

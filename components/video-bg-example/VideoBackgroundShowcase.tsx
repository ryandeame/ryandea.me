"use client";

import Link from "next/link";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useRef } from "react";

const VIDEO_SRC = "/claymation/toucan-landing-scroll-optimized.mp4";
const MAP_BG_SRC = "/claymation/treasure-map-video-bg.png";

const sections = [
  {
    eyebrow: "Video Background Package",
    title: "A landing page that turns motion into the first impression.",
    body:
      "Build a page around a custom video moment: a product reveal, mascot entrance, food shot, service story, venue walkthrough, or campaign visual that moves as visitors scroll.",
    action: "Book the build",
  },
  {
    eyebrow: "Scroll-Directed Video",
    title: "The video follows the visitor instead of auto-playing past them.",
    body:
      "As the page scrolls, the background video moves frame by frame with it. Visitors can move forward, reverse, pause, and rewatch the moment naturally through the page itself.",
    action: "See the sequence",
  },
  {
    eyebrow: "Client Ready",
    title: "Built for premium offers, launches, and branded moments.",
    body:
      "Use it for a restaurant opening, boutique service, product launch, artist campaign, creator offer, or any brand that needs more atmosphere than a static hero image.",
    action: "Package details",
  },
  {
    eyebrow: "Deliverables",
    title: "A polished video-backed page without sound or playback friction.",
    body:
      "The package can include background video placement, scroll scrubbing, responsive framing, fallback art direction, call-to-action sections, analytics-ready buttons, and deployment support.",
    action: "Start a project",
  },
];

/**
 * Extract every frame from a video as ImageBitmap objects.
 * Uses sequential seeking — fast with all-I-frame encoded video.
 */
async function extractFrames(src: string): Promise<ImageBitmap[]> {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = src;

  await new Promise<void>((resolve, reject) => {
    video.addEventListener("loadeddata", () => resolve(), { once: true });
    video.addEventListener("error", () => reject(video.error), { once: true });
  });

  const duration = video.duration;
  const fps = 24;
  const totalFrames = Math.round(duration * fps);
  const frames: ImageBitmap[] = [];

  for (let i = 0; i < totalFrames; i++) {
    video.currentTime = (i / Math.max(1, totalFrames - 1)) * duration;
    await new Promise<void>((r) =>
      video.addEventListener("seeked", () => r(), { once: true }),
    );
    frames.push(await createImageBitmap(video));
  }

  // Release the video element
  video.removeAttribute("src");
  video.load();
  return frames;
}

export default function VideoBackgroundShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const lastFrameIndexRef = useRef(-1);

  // --- Extract all video frames into ImageBitmaps on mount ---
  useEffect(() => {
    let cancelled = false;

    extractFrames(VIDEO_SRC).then((frames) => {
      if (cancelled) {
        frames.forEach((f) => f.close());
        return;
      }

      framesRef.current = frames;

      // Initialise canvas and paint the first frame
      const canvas = canvasRef.current;
      if (canvas && frames.length > 0) {
        const first = frames[0];
        canvas.width = first.width;
        canvas.height = first.height;
        ctxRef.current = canvas.getContext("2d", { alpha: false });
        ctxRef.current?.drawImage(first, 0, 0);
        lastFrameIndexRef.current = 0;
      }
    });

    return () => {
      cancelled = true;
      framesRef.current.forEach((f) => f.close());
      framesRef.current = [];
      lastFrameIndexRef.current = -1;
      ctxRef.current = null;
    };
  }, []);

  // --- Single Lenis loop: smooth scroll + direct canvas painting ---
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      lerp: 0.055,
      smoothWheel: true,
      wheelMultiplier: 0.2,
      syncTouch: true,
      syncTouchLerp: 0.055,
      touchInertiaExponent: 2.2,
      touchMultiplier: 0.375,
    });

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      const frames = framesRef.current;
      const ctx = ctxRef.current;
      if (!frames.length || !ctx) return;

      const index = Math.round(progress * (frames.length - 1));
      const clamped = Math.max(0, Math.min(frames.length - 1, index));

      // Skip if we're already showing this frame
      if (clamped === lastFrameIndexRef.current) return;
      lastFrameIndexRef.current = clamped;

      ctx.drawImage(frames[clamped], 0, 0);
    });

    return () => lenis.destroy();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#6f451f] text-[#fff7d8]">
      {/* Map background */}
      <div className="pointer-events-none fixed left-0 top-0 z-0 h-[100lvh] min-h-[100dvh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${MAP_BG_SRC})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,246,213,0.06),rgba(79,42,14,0.28)_42%,rgba(44,24,8,0.72)),linear-gradient(90deg,rgba(42,22,7,0.44),transparent_28%,transparent_72%,rgba(42,22,7,0.44))]" />
      </div>

      {/* Scroll-driven video canvas — painted directly by Lenis scroll callback */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex h-[100lvh] min-h-[100dvh] w-full items-start justify-center overflow-hidden"
        style={{ transform: "translateZ(0)" }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            height: "min(100lvh, 1280px)",
            minHeight: "100dvh",
            width: "auto",
            aspectRatio: "9 / 16",
            borderRadius: "1.4rem",
            boxShadow:
              "0 32px 110px rgba(45, 24, 8, 0.58), 0 0 0 1px rgba(255, 239, 198, 0.38)",
            willChange: "contents",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-sm font-black uppercase tracking-[0.16em] sm:px-8">
        <Link
          href="/"
          className="rounded-full border border-[#fff7d8]/25 bg-[#4b2a0c]/72 px-4 py-3 text-[#fff7d8] backdrop-blur"
        >
          Ryan Deame
        </Link>
        <a
          href="#buy"
          className="rounded-full bg-[#ffcf4d] px-5 py-3 text-[#211205] shadow-[0_14px_36px_rgba(255,207,77,0.25)]"
        >
          Buy the page
        </a>
      </nav>

      {/* Content sections */}
      <div className="relative z-10">
        <div className="relative z-10">
          {sections.map((section, index) => (
            <section
              key={section.eyebrow}
              className="flex min-h-screen items-center px-5 py-28 sm:px-8 lg:px-14"
            >
              <div
                className={`max-w-xl ${
                  index % 2 === 0 ? "mr-auto" : "ml-auto"
                }`}
              >
                <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-[#ffdf7e] drop-shadow-[0_3px_12px_rgba(64,33,9,0.75)]">
                  {section.eyebrow}
                </p>
                <h1 className="font-serif text-5xl font-black leading-[0.94] tracking-tight text-[#fff7d8] drop-shadow-[0_8px_24px_rgba(0,0,0,0.58)] sm:text-7xl">
                  {section.title}
                </h1>
                <p className="mt-7 max-w-lg text-lg font-semibold leading-8 text-[#fff7d8]/88 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  {section.body}
                </p>
                <a
                  href={
                    index === sections.length - 1
                      ? "#buy"
                      : `#section-${index + 1}`
                  }
                  id={`section-${index}`}
                  className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#fff7d8]/30 bg-[#4b2a0c]/40 px-6 text-xs font-black uppercase tracking-[0.14em] text-[#fff7d8] shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur transition-transform hover:-translate-y-1 hover:bg-[#ffcf4d] hover:text-[#211205]"
                >
                  {section.action}
                </a>
              </div>
            </section>
          ))}

          <section id="buy" className="relative px-5 pb-24 pt-10 sm:px-8 lg:px-14">
            <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-[#fff7d8]/18 bg-[#4b2a0c]/18 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-[2px] md:grid-cols-[1fr_0.85fr] md:p-10">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#ffdf7e]">
                  Purchase Item
                </p>
                <h2 className="mt-4 font-serif text-4xl font-black leading-none text-[#fff7d8] sm:text-6xl">
                  Your company&apos;s call to action, carried by a custom video moment.
                </h2>
                <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-[#fff7d8]/82">
                  This is a sample sales page for a premium video background website package. Swap the toucan video for a client&apos;s product, food item, mascot, property, service moment, or campaign scene and let the scroll control the reveal.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-[#ffcf4d]/30 bg-[#211205]/28 p-5 shadow-[0_18px_52px_rgba(0,0,0,0.2)]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffcf4d]">
                  Starting Scope
                </p>
                <ul className="mt-5 space-y-4 text-sm font-bold leading-6 text-[#fff7d8]/84">
                  <li>Scroll-scrubbed background video choreography</li>
                  <li>Responsive vertical video framing over wide fallback art</li>
                  <li>CTA sections built around the video reveal</li>
                  <li>Deployment-ready Next.js implementation</li>
                </ul>
                <Link
                  href="/#contact"
                  className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#ffcf4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#211205] transition-transform hover:-translate-y-1"
                >
                  Request this build
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

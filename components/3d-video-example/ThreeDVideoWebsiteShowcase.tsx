"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, useGLTF } from "@react-three/drei";
import Link from "next/link";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

const VIDEO_SRC = "/underwater/underwater-3d-video-bg-720p.mp4";
const GANNET_MODEL_PATH = "/models/gannet-close.glb";

const sections = [
  {
    eyebrow: "3D Video Website Package",
    title: "A cinematic page built around motion, depth, and a clear offer.",
    body:
      "Use an atmospheric video background as the foundation for a client sales page, then layer the call to action, proof points, and package details on top.",
    action: "Book the build",
  },
  {
    eyebrow: "Motion-First Design",
    title: "The background does the emotional work before the copy speaks.",
    body:
      "A product, mascot, location, service moment, or generated scene can set the visual tone while the page stays fast, readable, and focused on conversion.",
    action: "See the flow",
  },
  {
    eyebrow: "Client Ready",
    title: "Made for campaigns that need more presence than a static hero.",
    body:
      "This style works for launches, boutique services, restaurants, creators, events, product teasers, and brands that want a memorable first impression.",
    action: "Package details",
  },
  {
    eyebrow: "Production Scope",
    title: "Video atmosphere with room for 3D foreground details.",
    body:
      "The background video can carry the environment while lightweight 3D assets, callouts, scroll sections, and calls to action sit above it.",
    action: "Start a project",
  },
];

function getAnimatedBounds(
  model: THREE.Group,
  clip: THREE.AnimationClip | undefined,
) {
  const bounds = new THREE.Box3();

  if (!clip || clip.duration <= 0) {
    model.updateMatrixWorld(true);
    return bounds.setFromObject(model);
  }

  const sampleMixer = new THREE.AnimationMixer(model);
  const sampleAction = sampleMixer.clipAction(clip);
  sampleAction.reset();
  sampleAction.enabled = true;
  sampleAction.play();

  for (let i = 0; i <= 48; i++) {
    sampleMixer.setTime((i / 48) * clip.duration);
    model.updateMatrixWorld(true);
    bounds.union(new THREE.Box3().setFromObject(model));
  }

  sampleMixer.setTime(0);
  sampleAction.stop();
  sampleMixer.uncacheRoot(model);
  model.updateMatrixWorld(true);

  return bounds;
}

function getScrubEndTime(clip: THREE.AnimationClip) {
  let endTime = 0;

  for (const track of clip.tracks) {
    const times = track.times;

    for (let i = times.length - 1; i >= 0; i--) {
      if (times[i] < clip.duration - 0.0001) {
        endTime = Math.max(endTime, times[i]);
        break;
      }
    }
  }

  return endTime > 0 ? endTime : Math.max(clip.duration - 0.001, 0);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollable > 0 ? window.scrollY / scrollable : 0;

      setProgress(Math.min(Math.max(nextProgress, 0), 1));
      frameId = 0;
    };

    const requestUpdate = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return progress;
}

function GannetModel({ progress }: { progress: number }) {
  const viewport = useThree((state) => state.viewport);
  const { scene, animations } = useGLTF(GANNET_MODEL_PATH) as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };
  const model = useMemo(() => cloneSkeleton(scene) as THREE.Group, [scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(model), [model]);
  const primaryClip = animations[0];
  const scrubEndTime = useMemo(
    () => (primaryClip ? getScrubEndTime(primaryClip) : 0),
    [primaryClip],
  );
  const normalization = useMemo(() => {
    const bounds = getAnimatedBounds(model, primaryClip);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const maxWidth = viewport.width * 0.7;
    const maxHeight = viewport.height * 0.72;
    const scale =
      size.x > 0 && size.y > 0
        ? Math.min(maxWidth / size.x, maxHeight / size.y)
        : 1;

    return {
      position: center.multiplyScalar(-scale),
      scale,
    };
  }, [model, primaryClip, viewport.height, viewport.width]);

  useLayoutEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model]);

  useLayoutEffect(() => {
    if (!primaryClip) {
      return;
    }

    const action = mixer.clipAction(primaryClip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.enabled = true;
    action.play();
    mixer.setTime(0);

    return () => {
      action.stop();
      mixer.uncacheAction(primaryClip, model);
    };
  }, [mixer, model, primaryClip]);

  useFrame(() => {
    if (primaryClip && primaryClip.duration > 0) {
      mixer.setTime(THREE.MathUtils.clamp(progress, 0, 1) * scrubEndTime);
    }
  });

  return (
    <group position={[0, 0.18, 3.04]}>
      <primitive
        object={model}
        position={normalization.position}
        scale={normalization.scale}
      />
    </group>
  );
}

function GannetScene({ progress }: { progress: number }) {
  return (
    <Canvas
      camera={{ fov: 38, position: [0, 0.2, 6.2] }}
      className="h-full w-full"
      dpr={[1, 1.65]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
    >
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#d9fbff", "#0b4557", 1.35]} />
      <directionalLight color="#fff1be" intensity={2.8} position={[2.8, 4.2, 3.2]} />
      <pointLight color="#6ee7ff" intensity={2.6} position={[-2.2, 1.6, 2.4]} />
      <Suspense
        fallback={
          <Html center className="rounded-full bg-[#021823]/60 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-50 backdrop-blur">
            Loading gannet
          </Html>
        }
      >
        <GannetModel progress={progress} />
        <Environment preset="city" environmentIntensity={0.35} />
      </Suspense>
    </Canvas>
  );
}

export default function ThreeDVideoWebsiteShowcase() {
  const progress = useScrollProgress();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#032f3f] text-[#f4fbff]">
      <div className="fixed inset-0 z-0 h-[100lvh] min-h-[100dvh] overflow-hidden bg-[#032f3f]">
        <video
          aria-hidden="true"
          autoPlay
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[5] h-[100lvh] min-h-[100dvh]">
        <GannetScene progress={progress} />
      </div>

      <nav className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-sm font-black uppercase tracking-[0.16em] sm:px-8">
        <Link
          className="rounded-full border border-cyan-100/25 bg-[#021823]/62 px-4 py-3 text-cyan-50 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur"
          href="/"
        >
          Ryan Deame
        </Link>
        <a
          className="rounded-full bg-[#ffe27a] px-5 py-3 text-[#08202a] shadow-[0_14px_36px_rgba(255,226,122,0.28)]"
          href="#buy"
        >
          Buy the page
        </a>
      </nav>

      <div className="relative z-10">
        {sections.map((section, index) => (
          <section
            className="flex min-h-screen items-center px-5 py-28 sm:px-8 lg:px-14"
            key={section.eyebrow}
          >
            <div className={`max-w-xl ${index % 2 === 0 ? "mr-auto" : "ml-auto"}`}>
              <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-[#a7f3ff] drop-shadow-[0_4px_14px_rgba(0,20,30,0.8)]">
                {section.eyebrow}
              </p>
              <h1 className="font-serif text-5xl font-black leading-[0.94] tracking-tight text-[#f4fbff] drop-shadow-[0_8px_26px_rgba(0,0,0,0.62)] sm:text-7xl">
                {section.title}
              </h1>
              <p className="mt-7 max-w-lg text-lg font-semibold leading-8 text-cyan-50/86 drop-shadow-[0_4px_18px_rgba(0,0,0,0.56)]">
                {section.body}
              </p>
              <a
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-50/30 bg-cyan-50/12 px-6 text-xs font-black uppercase tracking-[0.14em] text-cyan-50 shadow-[0_18px_44px_rgba(0,0,0,0.22)] backdrop-blur transition-transform hover:-translate-y-1 hover:bg-[#ffe27a] hover:text-[#08202a]"
                href={index === sections.length - 1 ? "#buy" : `#section-${index + 1}`}
                id={`section-${index}`}
              >
                {section.action}
              </a>
            </div>
          </section>
        ))}

        <section className="relative px-5 pb-24 pt-10 sm:px-8 lg:px-14" id="buy">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-cyan-50/20 bg-[#021823]/38 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-md md:grid-cols-[1fr_0.85fr] md:p-10">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#a7f3ff]">
                Purchase Item
              </p>
              <h2 className="mt-4 font-serif text-4xl font-black leading-none text-[#f4fbff] sm:text-6xl">
                Your company&apos;s call to action, backed by a custom video world.
              </h2>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-cyan-50/80">
                This is a sample page for a premium 3D-video website package. Swap the underwater plate for a client&apos;s product reveal, service scene, restaurant moment, brand mascot, or campaign environment.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-[#ffe27a]/32 bg-[#021823]/62 p-5 shadow-[0_18px_52px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffe27a]">
                Starting Scope
              </p>
              <ul className="mt-5 space-y-4 text-sm font-bold leading-6 text-cyan-50/82">
                <li>Compressed background video placement</li>
                <li>Sticky full-screen cinematic backdrop</li>
                <li>Responsive CTA sections over motion</li>
                <li>Room for focused 3D assets in the foreground</li>
              </ul>
              <Link
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#ffe27a] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#08202a] transition-transform hover:-translate-y-1"
                href="/#contact"
              >
                Request this build
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

useGLTF.preload(GANNET_MODEL_PATH);

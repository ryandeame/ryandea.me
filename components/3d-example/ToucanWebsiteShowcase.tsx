"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, Sparkles, useGLTF } from "@react-three/drei";
import Link from "next/link";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

const TOUCAN_MODEL_PATH = "/claymation/toucan-animated.glb";
const TOUCAN_ANIMATION_FRAMES = 48;

const sections = [
  {
    eyebrow: "3D Website Package",
    title: "A homepage your client can feel before they click.",
    body:
      "Turn a company's call to action into a tactile 3D moment: a product, mascot, venue, or branded object that moves with the page and anchors the whole pitch.",
    action: "Book the build",
  },
  {
    eyebrow: "Conversion Motion",
    title: "Scroll becomes part of the sales story.",
    body:
      "As visitors move down the page, the 3D object rotates, comes toward the camera, and reveals new angles. Your headline, proof points, and offer arrive around the model instead of sitting beside a static stock image.",
    action: "See the flow",
  },
  {
    eyebrow: "Client Ready",
    title: "Built for launches, campaigns, and premium offers.",
    body:
      "Use it for a restaurant opening, boutique service launch, SaaS campaign, real estate teaser, creator product, or any brand that needs more presence than a normal landing page.",
    action: "Package details",
  },
  {
    eyebrow: "Deliverables",
    title: "A branded 3D page with the right amount of spectacle.",
    body:
      "The package can include model cleanup, scroll choreography, lighting direction, responsive layout, call-to-action sections, analytics-ready buttons, and deployment support.",
    action: "Start a project",
  },
];

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

function ToucanModel({ progress }: { progress: number }) {
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const { scene, animations } = useGLTF(TOUCAN_MODEL_PATH) as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };
  const model = useMemo(() => cloneSkeleton(scene) as THREE.Group, [scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(model), [model]);
  const primaryClip = animations[0];

  useLayoutEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());

    model.position.sub(center);
  }, [model]);

  useEffect(() => {
    if (!primaryClip) {
      return;
    }

    const action = mixer.clipAction(primaryClip);
    action.reset();
    action.enabled = true;
    action.paused = true;
    action.play();
    action.time = 0;
    actionRef.current = action;
    mixer.update(0);

    return () => {
      actionRef.current = null;
      action.stop();
      mixer.uncacheAction(primaryClip, model);
    };
  }, [mixer, model, primaryClip]);

  useFrame(() => {
    const action = actionRef.current;
    const scrollFrame =
      THREE.MathUtils.clamp(progress, 0, 1) * TOUCAN_ANIMATION_FRAMES;
    const clipProgress = scrollFrame / TOUCAN_ANIMATION_FRAMES;

    if (action && primaryClip && primaryClip.duration > 0) {
      action.time = clipProgress * primaryClip.duration;
      mixer.update(0);
    }
  });

  return (
    <group position={[0, 1.55, -3.2]}>
      <primitive object={model} />
    </group>
  );
}

function RainbowArc() {
  const rainbowRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rainbowRef.current) {
      rainbowRef.current.position.y = -1.35 + Math.sin(state.clock.elapsedTime * 0.45) * 0.04;
      rainbowRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.015;
    }
  });

  const colors = ["#fb7185", "#f97316", "#fde047", "#4ade80", "#38bdf8"];

  return (
    <group ref={rainbowRef} position={[0, -1.35, -3.45]}>
      {colors.map((color, index) => (
        <mesh key={color} rotation={[0, 0, 0]}>
          <torusGeometry args={[3.05 + index * 0.14, 0.045, 12, 128, Math.PI]} />
          <meshBasicMaterial color={color} transparent opacity={0.78} />
        </mesh>
      ))}
    </group>
  );
}

function CloudCluster({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {[
        [-0.42, 0, 0, 0.32],
        [-0.12, 0.08, 0.02, 0.42],
        [0.25, 0.02, 0, 0.34],
        [0.55, -0.04, 0.01, 0.24],
      ].map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[radius, 24, 18]} />
          <meshStandardMaterial color="#fff7ed" transparent opacity={0.8} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function PalmTree({
  position,
  scale = 1,
  rotationY = 0,
}: {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
}) {
  const leafAngles = [-1.15, -0.58, 0, 0.58, 1.15];

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh position={[0, -0.62, 0]} rotation={[0.16, 0, -0.09]}>
        <cylinderGeometry args={[0.08, 0.13, 1.85, 10]} />
        <meshStandardMaterial color="#9a5b2f" roughness={0.72} />
      </mesh>
      <group position={[0, 0.34, 0]}>
        {leafAngles.map((angle) => (
          <mesh
            key={angle}
            position={[Math.sin(angle) * 0.18, 0.02, Math.cos(angle) * 0.1]}
            rotation={[0.16, angle, Math.sin(angle) * 0.34]}
            scale={[0.18, 0.05, 0.86]}
          >
            <sphereGeometry args={[1, 18, 10]} />
            <meshStandardMaterial color={angle === 0 ? "#22c55e" : "#16a34a"} roughness={0.82} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function TropicalLeaves() {
  const leavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.018;
    }
  });

  return (
    <group ref={leavesRef}>
      <PalmTree position={[-3.15, -1.35, -2.25]} rotationY={0.45} scale={1.22} />
      <PalmTree position={[3.0, -1.42, -2.4]} rotationY={-0.55} scale={1.1} />
      <PalmTree position={[-4.2, -1.5, -3.2]} rotationY={0.2} scale={0.86} />
      <PalmTree position={[4.15, -1.5, -3.1]} rotationY={-0.2} scale={0.82} />
    </group>
  );
}

function TropicalAtmosphere() {
  return (
    <>
      <mesh position={[-2.75, 2.25, -3.7]}>
        <circleGeometry args={[0.42, 48]} />
        <meshBasicMaterial color="#fde68a" />
      </mesh>
      <RainbowArc />
      <CloudCluster position={[-2.2, 1.42, -3.25]} scale={0.9} />
      <CloudCluster position={[2.35, 1.12, -3.05]} scale={0.72} />
      <TropicalLeaves />
    </>
  );
}

function DynamicLights({ progress }: { progress: number }) {
  const keyRef = useRef<THREE.SpotLight>(null);
  const accentRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (keyRef.current) {
      keyRef.current.position.x = -1.2 + Math.sin(time * 0.55) * 0.45 + progress * 0.6;
      keyRef.current.position.y = 4.2 + Math.cos(time * 0.4) * 0.35;
      keyRef.current.intensity = 16 + Math.sin(progress * Math.PI) * 12;
    }

    if (accentRef.current) {
      accentRef.current.position.x = 2.4 - progress * 2.2;
      accentRef.current.intensity = 9 + Math.sin(time * 1.7) * 1.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.86} />
      <hemisphereLight args={["#fff2a8", "#0f766e", 1.8]} />
      <spotLight
        ref={keyRef}
        angle={0.55}
        castShadow
        color="#fff3a3"
        penumbra={0.65}
        position={[-1.2, 4.2, 4.5]}
      />
      <pointLight ref={accentRef} color="#22d3ee" intensity={9} position={[2.4, 1.6, 2.4]} />
      <pointLight color="#fb7185" intensity={5.5} position={[-2.8, -1.2, 1.8]} />
      <pointLight color="#a3e635" intensity={4} position={[1.6, -1.8, 1.2]} />
    </>
  );
}

function Scene({ progress }: { progress: number }) {
  return (
    <Canvas
      camera={{ fov: 38, position: [0, 0.2, 6.2] }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
    >
      <color attach="background" args={["#0f7a5f"]} />
      <fog attach="fog" args={["#0f7a5f", 8, 17]} />
      <DynamicLights progress={progress} />
      <Suspense
        fallback={
          <Html center className="rounded-full border border-white/20 bg-black/45 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">
            Loading 3D
          </Html>
        }
      >
        <ToucanModel progress={progress} />
        <Environment preset="sunset" environmentIntensity={0.75} />
      </Suspense>
      <TropicalAtmosphere />
      <Sparkles
        color="#fde047"
        count={72}
        opacity={0.55}
        scale={[6, 5, 5]}
        size={1}
        speed={0.24}
      />
      <mesh position={[0, -2.35, -1.2]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.5, 80]} />
        <meshStandardMaterial color="#166534" roughness={0.78} metalness={0.02} />
      </mesh>
    </Canvas>
  );
}

export default function ToucanWebsiteShowcase() {
  const progress = useScrollProgress();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f7a5f] text-[#fff7d8]">
      <div className="fixed inset-0">
        <Scene progress={progress} />
      </div>

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(250,204,21,0.42),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.28),transparent_30%),radial-gradient(circle_at_70%_78%,rgba(244,63,94,0.2),transparent_34%),linear-gradient(90deg,rgba(6,78,59,0.8),rgba(15,122,95,0.16)_50%,rgba(6,78,59,0.62))]" />

      <nav className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-sm font-black uppercase tracking-[0.16em] sm:px-8">
        <Link href="/" className="rounded-full border border-[#fff7d8]/25 bg-[#064e3b]/70 px-4 py-3 text-[#fff7d8] backdrop-blur">
          Ryan Deame
        </Link>
        <a href="#buy" className="rounded-full bg-[#ffcf4d] px-5 py-3 text-[#161314] shadow-[0_14px_36px_rgba(255,207,77,0.25)]">
          Buy the page
        </a>
      </nav>

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
              <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-[#a7f3d0] drop-shadow-[0_3px_12px_rgba(6,78,59,0.7)]">
                {section.eyebrow}
              </p>
              <h1 className="font-serif text-5xl font-black leading-[0.94] tracking-tight text-[#fff7d8] drop-shadow-[0_8px_24px_rgba(0,0,0,0.48)] sm:text-7xl">
                {section.title}
              </h1>
              <p className="mt-7 max-w-lg text-lg font-semibold leading-8 text-[#fff7d8]/84 drop-shadow-[0_4px_16px_rgba(0,0,0,0.46)]">
                {section.body}
              </p>
              <a
                href={index === sections.length - 1 ? "#buy" : `#section-${index + 1}`}
                id={`section-${index}`}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#fff7d8]/25 bg-[#fff7d8]/12 px-6 text-xs font-black uppercase tracking-[0.14em] text-[#fff7d8] shadow-[0_18px_44px_rgba(0,0,0,0.2)] backdrop-blur transition-transform hover:-translate-y-1 hover:bg-[#ffcf4d] hover:text-[#161314]"
              >
                {section.action}
              </a>
            </div>
          </section>
        ))}

        <section id="buy" className="relative px-5 pb-24 pt-10 sm:px-8 lg:px-14">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-[#fff7d8]/20 bg-[#fff7d8]/10 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl md:grid-cols-[1fr_0.85fr] md:p-10">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#7df4cf]">
                Purchase Item
              </p>
              <h2 className="mt-4 font-serif text-4xl font-black leading-none text-[#fff7d8] sm:text-6xl">
                Your company&apos;s call to action, made impossible to ignore.
              </h2>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-[#fff7d8]/78">
                This is a sample sales page for a premium 3D website package. Swap the toucan for your client&apos;s product, mascot, building, food item, machine, or branded object and shape the scroll animation around the offer.
              </p>
            </div>
              <div className="rounded-[1.4rem] border border-[#ffcf4d]/40 bg-[#064e3b]/80 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffcf4d]">
                Starting Scope
              </p>
              <ul className="mt-5 space-y-4 text-sm font-bold leading-6 text-[#fff7d8]/82">
                <li>3D model placement and scroll choreography</li>
                <li>Responsive page sections with CTA copy</li>
                <li>Dynamic lighting, atmosphere, and launch polish</li>
                <li>Deployment-ready Next.js implementation</li>
              </ul>
              <Link
                href="/#contact"
                className="mt-7 inline-flex w-full min-h-12 items-center justify-center rounded-full bg-[#ffcf4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#161314] transition-transform hover:-translate-y-1"
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

useGLTF.preload(TOUCAN_MODEL_PATH);

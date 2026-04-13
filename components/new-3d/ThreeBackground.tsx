"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type AnimatedShape = {
  mesh: THREE.Mesh;
  basePosition: THREE.Vector3;
  floatAmplitude: number;
  rotationSpeed: THREE.Vector3;
};

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050505");
    scene.fog = new THREE.Fog("#050505", 10, 28);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const timer = new THREE.Timer();
    timer.connect(document);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.35);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight("#f5f5f5", "#101010", 0.7);
    scene.add(hemisphereLight);

    const keyLight = new THREE.SpotLight("#ffffff", 220, 0, 0.3, 0.9);
    keyLight.position.set(10, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight("#f27d26", 18, 0, 2);
    accentLight.position.set(-6, 4, 6);
    scene.add(accentLight);

    const fillLight = new THREE.PointLight("#6f6f6f", 12, 0, 2);
    fillLight.position.set(7, -3, 2);
    scene.add(fillLight);

    const shadowCatcher = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ color: "#000000", opacity: 0.22 }),
    );
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.set(0, -5.8, 0);
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);

    const materials = {
      accent: new THREE.MeshPhysicalMaterial({
        color: "#f27d26",
        metalness: 0.8,
        roughness: 0.18,
        clearcoat: 0.4,
      }),
      charcoal: new THREE.MeshPhysicalMaterial({
        color: "#222222",
        metalness: 0.7,
        roughness: 0.28,
      }),
      graphite: new THREE.MeshPhysicalMaterial({
        color: "#444444",
        metalness: 0.65,
        roughness: 0.32,
      }),
      silver: new THREE.MeshPhysicalMaterial({
        color: "#666666",
        metalness: 0.82,
        roughness: 0.2,
      }),
    };

    const shapes: AnimatedShape[] = [
      {
        mesh: new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.15, 8),
          materials.accent,
        ),
        basePosition: new THREE.Vector3(-2.8, 2.4, -2),
        floatAmplitude: 0.55,
        rotationSpeed: new THREE.Vector3(0.6, 0.9, 0.25),
      },
      {
        mesh: new THREE.Mesh(
          new THREE.TorusGeometry(1.2, 0.38, 24, 120),
          materials.graphite,
        ),
        basePosition: new THREE.Vector3(3.2, -2.1, -3.2),
        floatAmplitude: 0.4,
        rotationSpeed: new THREE.Vector3(0.45, 0.55, 0.3),
      },
      {
        mesh: new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 1.5, 1.5, 6, 6, 6),
          materials.charcoal,
        ),
        basePosition: new THREE.Vector3(-3.6, -3.8, -4.4),
        floatAmplitude: 0.32,
        rotationSpeed: new THREE.Vector3(0.35, 0.4, 0.25),
      },
      {
        mesh: new THREE.Mesh(
          new THREE.SphereGeometry(0.95, 48, 48),
          materials.silver,
        ),
        basePosition: new THREE.Vector3(2.5, 3.6, -5.2),
        floatAmplitude: 0.48,
        rotationSpeed: new THREE.Vector3(0.25, 0.5, 0.15),
      },
    ];

    shapes.forEach(({ mesh, basePosition }) => {
      mesh.position.copy(basePosition);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    const resizeScene = () => {
      if (!container) {
        return;
      }

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    let frameId = 0;

    const renderFrame = (timestamp: number) => {
      timer.update(timestamp);
      const elapsed = timer.getElapsed();
      const delta = timer.getDelta();
      const maxScroll =
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
        ) - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const targetCameraY = -scrollProgress * 10;

      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        targetCameraY,
        Math.min(delta * 3, 0.12),
      );
      camera.lookAt(0, camera.position.y * 0.9, -10);

      shapes.forEach((shape, index) => {
        const phase = elapsed * (0.75 + index * 0.18);
        shape.mesh.position.y =
          shape.basePosition.y + Math.sin(phase) * shape.floatAmplitude;
        shape.mesh.position.x =
          shape.basePosition.x + Math.cos(phase * 0.6) * 0.18;
        shape.mesh.rotation.x += shape.rotationSpeed.x * delta;
        shape.mesh.rotation.y += shape.rotationSpeed.y * delta;
        shape.mesh.rotation.z += shape.rotationSpeed.z * delta;
      });

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(renderFrame);
    };

    resizeScene();
    frameId = window.requestAnimationFrame(renderFrame);
    window.addEventListener("resize", resizeScene);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeScene);
      timer.dispose();

      shapes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
      });

      Object.values(materials).forEach((material) => {
        material.dispose();
      });

      shadowCatcher.geometry.dispose();
      (shadowCatcher.material as THREE.Material).dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 bg-[#050505]"
      aria-hidden="true"
    />
  );
}

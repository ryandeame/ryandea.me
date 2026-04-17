"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type AnimatedShape = {
  mesh: THREE.Object3D;
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

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.35);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight("#f5f5f5", "#101010", 0.7);
    scene.add(hemisphereLight);

    const keyLight = new THREE.SpotLight("#ffffff", 220, 0, 0.3, 0.9);
    keyLight.position.set(10, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight("#a855f7", 18, 0, 2);
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
        color: "#c084fc",
        metalness: 0.8,
        roughness: 0.18,
        clearcoat: 0.4,
      }),
      charcoal: new THREE.MeshPhysicalMaterial({
        color: "#4c1d95",
        metalness: 0.7,
        roughness: 0.28,
      }),
      graphite: new THREE.MeshPhysicalMaterial({
        color: "#f5f5f5",
        metalness: 0.65,
        roughness: 0.32,
      }),
      silver: new THREE.MeshPhysicalMaterial({
        color: "#c4b5fd",
        metalness: 0.82,
        roughness: 0.2,
      }),
      computer: new THREE.MeshPhysicalMaterial({
        color: "#ede9fe",
        metalness: 0.82,
        roughness: 0.2,
      }),
    };

    const computerAnchor = new THREE.Group();
    const computerVisual = new THREE.Group();
    computerAnchor.add(computerVisual);
    const floppyAnchor = new THREE.Group();
    const floppyVisual = new THREE.Group();
    floppyAnchor.add(floppyVisual);

    const shapes: AnimatedShape[] = [
      {
        mesh: new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.15, 8),
          materials.accent,
        ),
        basePosition: new THREE.Vector3(3.2, -2.1, -3.2),
        floatAmplitude: 0.55,
        rotationSpeed: new THREE.Vector3(0.6, 0.9, 0.25),
      },
      {
        mesh: new THREE.Mesh(
          new THREE.TorusGeometry(1.2, 0.38, 24, 120),
          materials.graphite,
        ),
        basePosition: new THREE.Vector3(-3.6, -3.8, -4.4),
        floatAmplitude: 0.4,
        rotationSpeed: new THREE.Vector3(0.45, 0.55, 0.3),
      },
      {
        mesh: floppyAnchor,
        basePosition: new THREE.Vector3(-2.8, 2.4, -2),
        floatAmplitude: 0.32,
        rotationSpeed: new THREE.Vector3(0.35, 0.4, 0.25),
      },
      {
        mesh: computerAnchor,
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

    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    let importedComputer: THREE.Object3D | null = null;
    let importedFloppy: THREE.Object3D | null = null;

    const floppyDiffuseMap = textureLoader.load(
      "/models/floppy_disk/textures/material_0_diffuse.png",
    );
    floppyDiffuseMap.colorSpace = THREE.SRGBColorSpace;
    floppyDiffuseMap.flipY = false;

    const floppyNormalMap = textureLoader.load(
      "/models/floppy_disk/textures/material_0_normal.png",
    );
    floppyNormalMap.flipY = false;

    const floppySpecGlossMap = textureLoader.load(
      "/models/floppy_disk/textures/material_0_specularGlossiness.png",
    );
    floppySpecGlossMap.flipY = false;

    const floppyMaterial = new THREE.MeshStandardMaterial({
      color: "#a855f7",
      normalMap: floppyNormalMap,
      roughness: 0.2,
      metalness: 0.82,
      roughnessMap: floppySpecGlossMap,
    });

    gltfLoader.load("/models/floppy_disk/scene.gltf", (gltf) => {
      importedFloppy = gltf.scene;

      importedFloppy.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = floppyMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      importedFloppy.updateMatrixWorld(true);

      const bounds = new THREE.Box3().setFromObject(importedFloppy);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z) || 1;
      const scale = 1.8 / maxDimension;

      // Recenter the asset so the wrapper group rotates around the model's
      // visual midpoint while preserving the GLTF's supplied textured materials.
      importedFloppy.position.sub(center);

      floppyVisual.scale.setScalar(scale);
      floppyVisual.rotation.x = 0.35;
      floppyVisual.rotation.y = 0.8;
      floppyVisual.rotation.z = -0.25;

      floppyVisual.add(importedFloppy);
    });

    gltfLoader.load("/models/personal_computer/scene.gltf", (gltf) => {
      importedComputer = gltf.scene;

      importedComputer.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = materials.computer;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      importedComputer.updateMatrixWorld(true);

      const bounds = new THREE.Box3().setFromObject(importedComputer);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z) || 1;
      const scale = 1.9 / maxDimension;

      // Recenter the loaded asset around the local origin so the animated parent
      // group rotates around the visible center of the model.
      importedComputer.position.sub(center);

      computerVisual.scale.setScalar(scale);
      computerVisual.rotation.x = -0.2;
      computerVisual.rotation.y = -0.8;

      computerVisual.add(importedComputer);
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
    let lastTimestamp = 0;
    let elapsed = 0;

    const renderFrame = (timestamp: number) => {
      const delta =
        lastTimestamp === 0 ? 1 / 60 : Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;
      elapsed += delta;
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

      shapes.forEach(({ mesh }) => {
        if (mesh instanceof THREE.Mesh) {
          mesh.geometry.dispose();
        }
      });

      if (importedComputer) {
        importedComputer.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
          }
        });
      }

      if (importedFloppy) {
        importedFloppy.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
          }
        });
      }

      Object.values(materials).forEach((material) => {
        material.dispose();
      });
      floppyMaterial.dispose();
      floppyDiffuseMap.dispose();
      floppyNormalMap.dispose();
      floppySpecGlossMap.dispose();

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

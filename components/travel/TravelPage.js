'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

import { db } from '@/lib/firebase';
import Globe from '@/components/travel/Globe';
import StarField from '@/components/travel/Starfield';

export default function TravelPage() {
  const [cityData, setCityData] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [fadingOut, setFadingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationSnapshot = await getDocs(collection(db, 'locations'));
        const locations = locationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCityData(locations);
      } catch (error) {
        console.error('Failed to load travel locations', error);
      }
    };

    fetchLocations();
  }, []);

  const handleNavigate = (path) => {
    setFadingOut(true);
    window.setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const handleCitySelect = (city) => {
    if (typeof city.slug === 'string' && city.slug.length > 0) {
      handleNavigate(`/travel/${city.slug}`);
    }
  };

  return (
    <div
      className={`relative h-dvh w-full overflow-hidden bg-black transition-opacity duration-700 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="pointer-events-none absolute left-6 top-6 z-10 max-w-md md:left-10 md:top-10">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/50">
          Travel Atlas
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore the map.
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65 md:text-base">
          Spin the globe, open clusters, and jump into city galleries.
        </p>
      </div>

      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 3.25] }}>
          <color attach="background" args={['#000']} />
          <StarField />
          <ambientLight intensity={1.0} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={-1 * Math.PI}
            maxPolarAngle={Math.PI}
          />
          <Globe
            cityData={cityData}
            onCitySelect={handleCitySelect}
            onClusterToggle={(idx) =>
              setSelectedCluster((prev) => (prev === idx ? null : idx))
            }
            selectedCluster={selectedCluster}
            overlayOpen={false}
            navOpen={false}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';

const TravelPage = dynamic(() => import('@/components/travel/TravelPage'), {
  ssr: false,
  loading: () => (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute left-6 top-6 z-10 max-w-md md:left-10 md:top-10">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/50">
          Travel Atlas
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore the map.
        </h1>
      </div>
    </div>
  ),
});

export default function TravelRouteClient() {
  return <TravelPage />;
}

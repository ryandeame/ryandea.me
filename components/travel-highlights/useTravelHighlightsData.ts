"use client";

import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/lib/firebase";

export type TravelLocation = {
  id: string;
  slug?: string;
  name?: string;
  country?: string;
  region?: string;
  continent?: string;
  lat?: number;
  lon?: number;
  heroImage: string | null;
  photoCount: number;
};

export type TravelStats = {
  totalLocations: number;
  totalPhotos: number;
  hemispheres: number;
};

function sortImagesByDate(imageDocs: Array<Record<string, unknown>>) {
  return [...imageDocs].sort((a, b) => {
    const aValue =
      typeof a.imageDate === "object" && a.imageDate && "seconds" in a.imageDate
        ? Number((a.imageDate as { seconds?: number }).seconds ?? 0)
        : 0;
    const bValue =
      typeof b.imageDate === "object" && b.imageDate && "seconds" in b.imageDate
        ? Number((b.imageDate as { seconds?: number }).seconds ?? 0)
        : 0;

    return aValue - bValue;
  });
}

export function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCoordinatePair(lat?: number, lon?: number) {
  if (typeof lat !== "number" || typeof lon !== "number") {
    return null;
  }

  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";

  return `${Math.abs(lat).toFixed(1)}° ${ns} / ${Math.abs(lon).toFixed(1)}° ${ew}`;
}

export function buildLocationMeta(location: TravelLocation) {
  const parts = [location.country, location.region, location.continent].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(" · ");
  }

  return formatCoordinatePair(location.lat, location.lon) ?? "Global archive";
}

export function useTravelHighlightsData() {
  const [locations, setLocations] = useState<TravelLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocations = async () => {
      try {
        const locationSnapshot = await getDocs(collection(db, "locations"));
        const baseLocations = locationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<TravelLocation, "id" | "heroImage" | "photoCount">),
        }));

        const enrichedLocations = await Promise.all(
          baseLocations.map(async (location) => {
            const imageSnapshot = await getDocs(
              collection(db, "locations", location.id, "images"),
            );
            const imageDocs = imageSnapshot.docs.map((doc) => doc.data());
            const sortedImages = sortImagesByDate(imageDocs);
            const firstImage = sortedImages.find(
              (image) => typeof image.downloadURL === "string" && image.downloadURL.length > 0,
            ) as { downloadURL?: string } | undefined;

            return {
              ...location,
              heroImage: firstImage?.downloadURL ?? null,
              photoCount: sortedImages.length,
            } satisfies TravelLocation;
          }),
        );

        enrichedLocations.sort((a, b) => {
          const aName = a.name?.toLowerCase() ?? "";
          const bName = b.name?.toLowerCase() ?? "";
          return aName.localeCompare(bName);
        });

        if (isMounted) {
          setLocations(enrichedLocations);
          setLoading(false);
        }
      } catch (fetchError) {
        console.error("Failed to load travel highlight locations", fetchError);

        if (isMounted) {
          setError("Travel locations could not be loaded right now.");
          setLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredLocations = useMemo(() => {
    const withImages = locations
      .filter((location) => location.heroImage)
      .sort((a, b) => b.photoCount - a.photoCount);

    if (withImages.length >= 3) {
      return withImages.slice(0, 3);
    }

    return [...withImages, ...locations.filter((location) => !location.heroImage)].slice(0, 3);
  }, [locations]);

  const stats = useMemo<TravelStats>(() => {
    const totalPhotos = locations.reduce((sum, location) => sum + location.photoCount, 0);
    const hemispheres = new Set(
      locations
        .map((location) => {
          if (typeof location.lat !== "number") {
            return null;
          }

          return location.lat >= 0 ? "Northern Hemisphere" : "Southern Hemisphere";
        })
        .filter(Boolean),
    );

    return {
      totalLocations: locations.length,
      totalPhotos,
      hemispheres: hemispheres.size,
    };
  }, [locations]);

  return {
    error,
    featuredLocations,
    loading,
    locations,
    stats,
  };
}

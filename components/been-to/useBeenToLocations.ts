"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { auth, db } from "@/lib/firebase";

import {
  buildBeenToStats,
  type BeenToLocation,
  type BeenToLocationWithImage,
} from "./beenToData";

const PAGE_SIZE = 5;
const DEV_AUTH_BYPASS = process.env.NODE_ENV === "development";
const CACHE_KEY = "been-to-box:locations-cache:v1";
const METADATA_COLLECTION = "appMetadata";
const METADATA_DOC_ID = "beenToBox";

type ImageDoc = {
  downloadURL?: unknown;
  imageDate?: unknown;
};

type BentoInfoDoc = {
  coverImageUrl?: string | null;
  imageCount?: number | null;
};

type BaseBeenToLocation = Omit<BeenToLocation, "heroImage" | "photoCount">;
type BeenToCachePayload = {
  cachedAt: number;
  cursorId: string | null;
  hasMore: boolean;
  locations: BeenToLocationWithImage[];
  version: string;
};

function sortImagesByDate(imageDocs: ImageDoc[]) {
  return [...imageDocs].sort((a, b) => {
    const aSeconds = getImageDateSeconds(a.imageDate);
    const bSeconds = getImageDateSeconds(b.imageDate);

    return aSeconds - bSeconds;
  });
}

function getImageDateSeconds(value: unknown) {
  if (typeof value === "object" && value && "seconds" in value) {
    return Number((value as { seconds?: number }).seconds ?? 0);
  }

  return 0;
}

function hasHeroImage(location: BeenToLocation): location is BeenToLocationWithImage {
  return typeof location.heroImage === "string" && location.heroImage.length > 0;
}

function serializeVersion(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object" && value && "seconds" in value) {
    const timestamp = value as { nanoseconds?: number; seconds?: number };
    return `${timestamp.seconds ?? 0}:${timestamp.nanoseconds ?? 0}`;
  }

  return null;
}

function isPermissionDeniedError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "permission-denied"
  );
}

async function fetchLocationsVersion() {
  const metadataSnapshot = await getDoc(doc(db, METADATA_COLLECTION, METADATA_DOC_ID));

  if (!metadataSnapshot.exists()) {
    return null;
  }

  const metadata = metadataSnapshot.data();

  return (
    serializeVersion(metadata.locationsVersion) ??
    serializeVersion(metadata.version) ??
    serializeVersion(metadata.locationsUpdatedAt) ??
    serializeVersion(metadata.updatedAt)
  );
}

function readLocationsCache(version: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawCache = window.localStorage.getItem(CACHE_KEY);

    if (!rawCache) {
      return null;
    }

    const cache = JSON.parse(rawCache) as Partial<BeenToCachePayload>;

    if (
      cache.version !== version ||
      !Array.isArray(cache.locations) ||
      cache.locations.length === 0 ||
      typeof cache.hasMore !== "boolean"
    ) {
      return null;
    }

    return cache as BeenToCachePayload;
  } catch (cacheError) {
    console.warn("Failed to read Been-To-Box cache", cacheError);
    return null;
  }
}

function writeLocationsCache(cache: BeenToCachePayload) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (cacheError) {
    console.warn("Failed to write Been-To-Box cache", cacheError);
  }
}

async function enrichLocation(
  location: BaseBeenToLocation,
  bentoInfo: BentoInfoDoc | undefined,
): Promise<BeenToLocation> {
  const imageSnapshot = await getDocs(collection(db, "locations", location.id, "images"));
  const imageDocs = imageSnapshot.docs.map((doc) => doc.data() as ImageDoc);
  const sortedImages = sortImagesByDate(imageDocs);
  const firstImage = sortedImages.find(
    (image) =>
      typeof image.downloadURL === "string" &&
      image.downloadURL.length > 0,
  );
  const coverImageUrl =
    typeof bentoInfo?.coverImageUrl === "string" && bentoInfo.coverImageUrl.length > 0
      ? bentoInfo.coverImageUrl
      : null;
  const imageCount =
    typeof bentoInfo?.imageCount === "number"
      ? bentoInfo.imageCount
      : sortedImages.length;

  return {
    ...location,
    heroImage:
      coverImageUrl ??
      (typeof firstImage?.downloadURL === "string"
        ? firstImage.downloadURL
        : null),
    photoCount: imageCount,
  };
}

async function fetchBentoInfoByLocationId(locationIds: string[]) {
  if (locationIds.length === 0) {
    return {};
  }

  try {
    const response = await fetch("/api/been-to-box/bento-info", {
      body: JSON.stringify({ locationIds }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Bento info request failed with ${response.status}`);
    }

    const payload = await response.json();

    if (
      typeof payload === "object" &&
      payload !== null &&
      "bentoInfoByLocationId" in payload &&
      typeof payload.bentoInfoByLocationId === "object" &&
      payload.bentoInfoByLocationId !== null
    ) {
      return payload.bentoInfoByLocationId as Record<string, BentoInfoDoc>;
    }
  } catch (bentoInfoError) {
    console.warn("Failed to load Been-To-Box cover metadata", bentoInfoError);
  }

  return {};
}

export function useBeenToLocations() {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [locations, setLocations] = useState<BeenToLocationWithImage[]>([]);
  const cursorIdRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const locationsRef = useRef<BeenToLocationWithImage[]>([]);
  const versionRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const persistCache = useCallback(
    (nextLocations: BeenToLocationWithImage[], nextHasMore: boolean, nextCursorId: string | null) => {
      if (!versionRef.current) {
        return;
      }

      writeLocationsCache({
        cachedAt: Date.now(),
        cursorId: nextCursorId,
        hasMore: nextHasMore,
        locations: nextLocations,
        version: versionRef.current,
      });
    },
    [],
  );

  const fetchNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) {
      return;
    }

    loadingRef.current = true;
    setError(null);

    const isInitialPage = cursorIdRef.current === null && locationsRef.current.length === 0;

    if (isInitialPage) {
      setInitialLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const locationQuery = cursorIdRef.current
        ? query(
            collection(db, "locations"),
            orderBy(documentId()),
            startAfter(cursorIdRef.current),
            limit(PAGE_SIZE),
          )
        : query(
            collection(db, "locations"),
            orderBy(documentId()),
            limit(PAGE_SIZE),
          );
      const locationSnapshot = await getDocs(locationQuery);
      const baseLocations = locationSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<BeenToLocation, "id" | "heroImage" | "photoCount">),
      }));
      const bentoInfoByLocationId = await fetchBentoInfoByLocationId(
        baseLocations.map((location) => location.id),
      );
      const enrichedLocations = await Promise.all(
        baseLocations.map((location) =>
          enrichLocation(location, bentoInfoByLocationId[location.id]),
        ),
      );
      const locationsWithImages = enrichedLocations.filter(hasHeroImage);

      const nextCursorId =
        locationSnapshot.docs[locationSnapshot.docs.length - 1]?.id ?? cursorIdRef.current;
      const nextHasMore = locationSnapshot.docs.length === PAGE_SIZE;

      cursorIdRef.current = nextCursorId;
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);
      setLocations((currentLocations) => {
        const nextLocations = [...currentLocations, ...locationsWithImages];
        locationsRef.current = nextLocations;
        persistCache(nextLocations, nextHasMore, nextCursorId);

        return nextLocations;
      });
    } catch (fetchError) {
      console.error("Failed to load Been-To-Box locations", fetchError);
      setError("Been-To-Box locations could not be loaded right now.");
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [persistCache]);

  useEffect(() => {
    let isMounted = true;

    const hydrateOrFetch = async () => {
      try {
        setInitialLoading(true);
        const version = await fetchLocationsVersion();

        if (!isMounted) {
          return;
        }

        if (version) {
          versionRef.current = version;
          const cache = readLocationsCache(version);

          if (cache) {
            cursorIdRef.current = cache.cursorId;
            hasMoreRef.current = cache.hasMore;
            locationsRef.current = cache.locations;
            setLocations(cache.locations);
            setHasMore(cache.hasMore);
            setInitialLoading(false);
            return;
          }
        }

        cursorIdRef.current = null;
        hasMoreRef.current = true;
        locationsRef.current = [];
        setLocations([]);
        setHasMore(true);
        await fetchNextPage();
      } catch (metadataError) {
        if (isPermissionDeniedError(metadataError)) {
          console.warn(
            "Been-To-Box cache metadata is not readable. Falling back to direct location fetch.",
          );
        } else {
          console.error("Failed to check Been-To-Box cache version", metadataError);
        }

        if (isMounted) {
          await fetchNextPage();
        }
      }
    };

    hydrateOrFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchNextPage]);

  const isAuthenticated = DEV_AUTH_BYPASS || Boolean(currentUser);
  const primaryLocations = useMemo(
    () => locations.slice(0, PAGE_SIZE),
    [locations],
  );
  const archiveLocations = useMemo(
    () => locations.slice(PAGE_SIZE),
    [locations],
  );
  const stats = useMemo(() => buildBeenToStats(locations), [locations]);

  return {
    archiveLocations,
    authReady: DEV_AUTH_BYPASS || authReady,
    error,
    hasMore,
    initialLoading,
    isAuthenticated,
    loadingMore,
    loadMore: fetchNextPage,
    locations,
    primaryLocations,
    stats,
  };
}

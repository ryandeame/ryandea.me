"use client";

import { logEvent, setAnalyticsCollectionEnabled } from "firebase/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import {
  COOKIE_PREFERENCE_CHANGE_EVENT,
  hasAnalyticsConsent,
} from "@/lib/analytics";
import { initAnalytics, measurementId } from "@/lib/firebase";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consentVersion, setConsentVersion] = useState(0);

  useEffect(() => {
    const handleConsentChange = () => setConsentVersion((version) => version + 1);

    window.addEventListener(COOKIE_PREFERENCE_CHANGE_EVENT, handleConsentChange);
    window.addEventListener("storage", handleConsentChange);

    return () => {
      window.removeEventListener(COOKIE_PREFERENCE_CHANGE_EVENT, handleConsentChange);
      window.removeEventListener("storage", handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!hasAnalyticsConsent()) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };

    const pagePath = searchParams.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    initAnalytics().then((analytics) => {
      if (!analytics) {
        return;
      }

      setAnalyticsCollectionEnabled(analytics, true);
      logEvent(analytics, "page_view", {
        page_path: pagePath,
        page_title: document.title,
      });

      if (process.env.NODE_ENV === "development") {
        window.gtag("config", measurementId, { debug_mode: true });
        console.log("[Analytics] page_view logged:", pagePath);
      }
    });
  }, [consentVersion, pathname, searchParams]);

  return null;
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

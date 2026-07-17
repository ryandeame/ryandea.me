"use client";

import { logEvent, setAnalyticsCollectionEnabled } from "firebase/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { trackFirstPartyPageView } from "@/lib/first-party-analytics";
import { initAnalytics } from "@/lib/firebase";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pagePath = searchParams.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    trackFirstPartyPageView(pagePath);

    try {
      const analytics = initAnalytics();

      if (!analytics) {
        return;
      }

      setAnalyticsCollectionEnabled(analytics, true);
      logEvent(analytics, "page_view", {
        page_location: window.location.href,
        page_path: pagePath,
        page_title: document.title,
      });
    } catch (error) {
      console.error("[Analytics] Failed to initialize:", error);
    }
  }, [pathname, searchParams]);

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

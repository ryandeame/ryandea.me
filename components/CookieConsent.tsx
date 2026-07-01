"use client";

import { useEffect, useState } from "react";
import { Cookie, ShieldCheck } from "lucide-react";

type CookiePreference = "accepted" | "essential";

const STORAGE_KEY = "ryandea-cookie-preference";

export default function CookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedPreference = window.localStorage.getItem(STORAGE_KEY);

      if (storedPreference === "accepted" || storedPreference === "essential") {
        setIsPanelOpen(false);
      } else {
        setIsPanelOpen(true);
      }

      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const savePreference = (nextPreference: CookiePreference) => {
    window.localStorage.setItem(STORAGE_KEY, nextPreference);
    setIsPanelOpen(false);
  };

  if (!isReady || !isPanelOpen) {
    return null;
  }

  return (
    <section
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#0a0a0a]/95 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl md:bottom-6 md:p-6"
    >
      <div className="absolute -left-20 -top-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-300/30 bg-purple-500/15 text-purple-200 sm:flex">
            <Cookie className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-200/80">
              Cookie preferences
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Choose how this site uses cookies.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-gray-300">
              Essential cookies keep the site working. If you accept, this
              site may also use non-essential cookies to improve content and
              understand what is useful.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
          <button
            type="button"
            onClick={() => savePreference("essential")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-gray-100 transition duration-300 hover:border-purple-300/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Essential only
          </button>
          <button
            type="button"
            onClick={() => savePreference("accepted")}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-[0_0_28px_rgba(147,51,234,0.35)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(99,102,241,0.45)] focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            Accept all
          </button>
        </div>
      </div>
    </section>
  );
}

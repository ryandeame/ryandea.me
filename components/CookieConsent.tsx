"use client";

import { useEffect, useState } from "react";
import { Cookie, ShieldCheck } from "lucide-react";

import {
  COOKIE_PREFERENCE_CHANGE_EVENT,
  COOKIE_PREFERENCE_STORAGE_KEY,
} from "@/lib/analytics";

type CookiePreference = "accepted" | "essential";

export default function CookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedPreference = window.localStorage.getItem(COOKIE_PREFERENCE_STORAGE_KEY);

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
    window.localStorage.setItem(COOKIE_PREFERENCE_STORAGE_KEY, nextPreference);
    window.dispatchEvent(new Event(COOKIE_PREFERENCE_CHANGE_EVENT));
    setIsPanelOpen(false);
  };

  if (!isReady || !isPanelOpen) {
    return null;
  }

  return (
    <section
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl overflow-hidden rounded-[2rem] border-2 border-[#161314] bg-[#fff7d8] p-5 text-[#161314] shadow-[0_18px_50px_rgba(43,34,24,0.22)] md:bottom-6 md:p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(135,231,255,0.48),transparent_30%),radial-gradient(circle_at_92%_10%,rgba(255,207,77,0.55),transparent_28%),radial-gradient(circle_at_50%_115%,rgba(112,215,121,0.3),transparent_42%)]" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#161314] bg-[#ffcf4d] text-[#161314] shadow-[0_8px_18px_rgba(43,34,24,0.14)] sm:flex">
            <Cookie className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#3f7f4b]">
              Cookie preferences
            </p>
            <h2 className="font-serif text-2xl font-black tracking-tight text-[#161314]">
              Choose how this site uses cookies.
            </h2>
            <p className="max-w-2xl text-sm font-semibold leading-6 text-[#2b2218]/78">
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
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#161314]/25 bg-[#f6eec9] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#161314] transition duration-300 hover:-translate-y-0.5 hover:border-[#3f7f4b] hover:bg-[#87e7ff]/45 focus:outline-none focus:ring-2 focus:ring-[#3f7f4b]"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Essential only
          </button>
          <button
            type="button"
            onClick={() => savePreference("accepted")}
            className="inline-flex items-center justify-center rounded-full border-2 border-[#161314] bg-[#ffcf4d] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#161314] shadow-[0_10px_24px_rgba(43,34,24,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#70d779] focus:outline-none focus:ring-2 focus:ring-[#3f7f4b]"
          >
            Accept all
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import ClayNavbar from "@/components/claymation/ClayNavbar";
import { trackPurchase } from "@/lib/analytics";
import {
  createEmptyCart,
  getCartItemCount,
  getStoredCart,
  notifyCartChanged,
  saveStoredCart,
} from "@/components/claymation/shopCart";

const PURCHASE_TRACKED_PREFIX = "ryandea-purchase-tracked:";

export default function ClayCheckoutSuccessPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const trackedKey = sessionId ? `${PURCHASE_TRACKED_PREFIX}${sessionId}` : null;

    if (!trackedKey || window.localStorage.getItem(trackedKey) !== "true") {
      const cart = getStoredCart();

      trackPurchase({
        itemCount: getCartItemCount(cart),
        transactionId: sessionId,
      });

      if (trackedKey) {
        window.localStorage.setItem(trackedKey, "true");
      }
    }

    const emptyCart = createEmptyCart();
    saveStoredCart(emptyCart);
    notifyCartChanged(emptyCart);
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#f6eec9] text-[#161314]">
      <ClayNavbar />
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(135,231,255,0.46),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(255,207,77,0.44),transparent_24%),radial-gradient(circle_at_54%_96%,rgba(141,203,150,0.34),transparent_36%)]" />
        <div className="relative mx-auto max-w-3xl rounded-[2rem] border-2 border-[#5c9958]/25 bg-[#fff7d8]/88 p-8 text-center shadow-[0_24px_58px_rgba(43,34,24,0.14)]">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#3f7f4b]">
            Payment received
          </p>
          <h1 className="mt-4 font-serif text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl">
            You are all set.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base font-semibold leading-7 text-[#2b2218]/78">
            Thanks for the purchase. I will follow up with the next steps for your software project.
          </p>
          <Link
            href="/#shop"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#161314] bg-[#ffcf4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#161314] transition-transform hover:-translate-y-1 hover:bg-[#70d779]"
          >
            Back to shop
          </Link>
        </div>
      </section>
    </main>
  );
}

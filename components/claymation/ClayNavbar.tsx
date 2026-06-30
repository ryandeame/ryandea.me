"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = ["Products", "Projects", "FAQ", "Contact"];

export default function ClayNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <header className="border-b border-[#6fd37a]/40 bg-[#fff7d8]">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1500px] items-center justify-between gap-2 px-3 sm:min-h-[94px] sm:gap-4 sm:px-11">
        <button
          className="order-1 grid min-h-11 min-w-11 shrink-0 place-items-center transition-transform hover:-rotate-3 hover:scale-105 md:hidden"
          type="button"
          aria-expanded={isDrawerOpen}
          aria-controls="clay-mobile-menu"
          aria-label="Open menu"
          onClick={() => setIsDrawerOpen(true)}
        >
          <span className="relative h-12 w-12">
            <Image
              src="/claymation/toucan-hamburger.webp"
              alt=""
              fill
              priority
              sizes="48px"
              className="scale-125 object-contain"
            />
          </span>
        </button>

        <Link href="/claymation" className="group order-2 flex min-w-0 flex-1 items-center justify-center gap-2 md:order-1 md:inline-flex md:flex-none md:justify-start md:gap-3">
          <span className="relative hidden h-14 w-14 overflow-hidden rounded-full border-2 border-[#161314] bg-[#ffcf4d] shadow-[0_8px_28px_rgba(92,153,88,0.24)] transition-transform group-hover:-rotate-3 group-hover:scale-105 md:block">
            <Image
              src="/claymation/ryan-silhouette-logo-transparent.webp"
              alt=""
              fill
              sizes="56px"
              className="absolute inset-0 scale-[1.16] object-cover object-center"
            />
          </span>
          <span className="relative h-[64px] w-full min-w-0 sm:h-[88px] md:w-[340px] md:flex-none">
            <Image
              src="/claymation/ryandea-bird-wordmark.webp"
              alt="ryandea.me"
              fill
              priority
              sizes="(min-width: 768px) 340px, calc(100vw - 120px)"
              className="object-contain object-center md:object-left"
            />
          </span>
        </Link>

        <nav className="order-2 hidden flex-1 items-center justify-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="py-3 text-[13px] font-black uppercase tracking-[0.16em] text-[#2b2218] transition-colors hover:text-[#3f7f4b]"
            >
              {link}
            </a>
          ))}
        </nav>

        <button
          className="order-3 grid min-h-11 min-w-11 shrink-0 place-items-center transition-transform hover:-rotate-3 hover:scale-105"
          type="button"
          aria-label="Cart with 0 items"
        >
          <span className="relative grid h-12 w-12 place-items-center">
            <Image
              src="/claymation/toucan-cart-icon.webp"
              alt=""
              fill
              sizes="48px"
              className="scale-125 object-contain"
            />
            <span className="absolute left-1/2 top-1/2 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#161314] bg-[#ffcf4d] text-[10px] font-black leading-none text-[#161314] shadow-[0_2px_6px_rgba(22,19,20,0.22)]">
              0
            </span>
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden ${isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!isDrawerOpen}
      >
        <button
          className={`absolute inset-0 bg-[#161314]/45 transition-opacity duration-300 ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          type="button"
          aria-label="Close menu"
          onClick={closeDrawer}
        />

        <aside
          id="clay-mobile-menu"
          className={`absolute left-0 top-0 flex h-full w-3/4 max-w-sm flex-col border-r-2 border-[#161314] bg-[#fff7d8] p-5 shadow-[18px_0_40px_rgba(22,19,20,0.24)] transition-transform duration-300 ease-out ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="relative h-16 flex-1">
              <Image
                src="/claymation/ryandea-bird-wordmark.webp"
                alt="ryandea.me"
                fill
                sizes="70vw"
                className="object-contain object-left"
              />
            </div>
            <button
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#161314] bg-[#ffcf4d] text-xl font-black text-[#161314]"
              type="button"
              aria-label="Close menu"
              onClick={closeDrawer}
            >
              ×
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="rounded-2xl border border-[#161314]/10 bg-[#f6eec9] px-5 py-4 font-serif text-2xl font-black tracking-tight text-[#161314] shadow-[0_10px_24px_rgba(43,34,24,0.08)] transition-colors hover:bg-[#ffcf4d]"
                onClick={closeDrawer}
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-[1.5rem] border border-[#5c9958]/35 bg-[#87e7ff]/35 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3f7f4b]">
              ryandea.me
            </p>
            <p className="mt-2 text-sm font-bold leading-5 text-[#2b2218]">
              Bright software experiments, product work, and claymation energy.
            </p>
          </div>
        </aside>
      </div>
    </header>
  );
}

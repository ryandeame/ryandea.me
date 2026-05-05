import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { productDetails } from "@/data/products";

export const metadata: Metadata = {
  title: "Products | Ryan Deame",
  description:
    "Product detail pages for Ryan Deame's OnTrack and Reach mobile applications.",
};

export default function ProductsIndexPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-12 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
        >
          Back to portfolio
        </Link>

        <section className="mb-16 max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-purple-300">
            Product lab
          </p>
          <h1 className="text-5xl font-bold leading-none tracking-tight md:text-8xl">
            Products built around daily momentum.
          </h1>
          <p className="mt-7 text-xl leading-8 text-gray-400">
            Two mobile-first apps, one shared presentation method: explain the audience,
            show the workflow, then surface the technical decisions that make the product real.
          </p>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          {productDetails.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${product.accent.from} ${product.accent.to} p-1`}
            >
              <article className="relative h-full rounded-[22px] border border-white/10 bg-[#0a0a0a]/90 p-8 backdrop-blur-xl">
                <div className={`absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br ${product.accent.from} ${product.accent.to} opacity-15 blur-3xl`} />
                <div className="relative z-10">
                  <Image
                    src={product.icon}
                    alt={`${product.name} icon`}
                    width={68}
                    height={68}
                    className="mb-8 rounded-2xl"
                  />
                  <p className={`mb-4 text-sm font-bold uppercase tracking-[0.22em] ${product.accent.text}`}>
                    {product.eyebrow}
                  </p>
                  <h2 className="mb-5 text-4xl font-bold">{product.name}</h2>
                  <p className="mb-8 text-lg leading-8 text-gray-400">{product.summary}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-white transition-transform group-hover:translate-x-1">
                    View product
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

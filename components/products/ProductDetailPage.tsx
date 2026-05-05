"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Layers3,
  Smartphone,
  Sparkles,
  Target,
} from "lucide-react";

import type { ProductDetail, ProductFeature } from "@/data/products";

type ProductDetailPageProps = {
  product: ProductDetail;
  relatedProducts: ProductDetail[];
};

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <ProductHero product={product} relatedProducts={relatedProducts} />
      <ProductStory product={product} />
      <FeatureSection
        eyebrow="Core workflow"
        title="How the product moves"
        description="The common product-page pattern here is simple: lead with the problem, show the working loop, then make the technical choices visible without turning the page into a spec sheet."
        features={product.workflows}
        icon="workflow"
      />
      <FeatureSection
        eyebrow="Differentiators"
        title="What makes it distinct"
        description="These are the points that make the product easier to remember and explain in a portfolio review."
        features={product.differentiators}
        icon="spark"
        compact
      />
      <ArchitectureSection product={product} />
    </main>
  );
}

function ProductHero({ product, relatedProducts }: ProductDetailPageProps) {
  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-10 md:px-8 lg:px-12">
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#0a0a0a]/86 to-[#0a0a0a]" />
        <div className={`absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r ${product.accent.from} ${product.accent.to} opacity-15 blur-3xl`} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Products
          </Link>
          <div className="flex flex-wrap gap-3">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.slug}
                href={`/products/${relatedProduct.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                {relatedProduct.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid flex-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-xl">
              <Image
                src={product.icon}
                alt={`${product.name} icon`}
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span>{product.eyebrow}</span>
            </div>

            <h1 className="text-5xl font-bold leading-none tracking-tight md:text-8xl">
              {product.name}
            </h1>
            <p className="mt-7 max-w-3xl text-2xl leading-relaxed text-gray-300 md:text-3xl">
              {product.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
              {product.summary}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {product.stack.slice(0, 5).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <ProductDevice product={product} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProductDevice({ product }: { product: ProductDetail }) {
  return (
    <div className={`relative rounded-[2.5rem] bg-gradient-to-br ${product.accent.from} ${product.accent.to} p-1 shadow-2xl ${product.accent.glow}`}>
      <div className="rounded-[2.25rem] border border-white/10 bg-[#080808]/95 p-5 backdrop-blur-xl">
        <div className="mx-auto mb-5 h-1.5 w-20 rounded-full bg-white/15" />

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className={`text-sm font-bold uppercase tracking-[0.18em] ${product.accent.text}`}>
                {product.mockup.subtitle}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{product.mockup.title}</h2>
            </div>
            <div className={`rounded-2xl bg-gradient-to-br ${product.accent.from} ${product.accent.to} p-3`}>
              <Smartphone className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
              <p className="text-sm text-gray-500">Primary signal</p>
              <p className="mt-3 text-4xl font-black">{product.mockup.primaryMetric}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
              <p className="text-sm text-gray-500">Secondary signal</p>
              <p className="mt-3 text-4xl font-black">{product.mockup.secondaryMetric}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {product.mockup.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <span className="text-sm text-gray-400">{row.label}</span>
                <span className="font-bold text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductStory({ product }: { product: ProductDetail }) {
  return (
    <section className="relative px-4 py-24 md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        <motion.div {...cardMotion} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <Target className={`mb-6 h-8 w-8 ${product.accent.text}`} />
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Audience
          </p>
          <p className="text-lg leading-8 text-gray-300">{product.audience}</p>
        </motion.div>
        <motion.div {...cardMotion} transition={{ duration: 0.5, delay: 0.08 }} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <CheckCircle2 className={`mb-6 h-8 w-8 ${product.accent.text}`} />
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Problem
          </p>
          <p className="text-lg leading-8 text-gray-300">{product.problem}</p>
        </motion.div>
        <motion.div {...cardMotion} transition={{ duration: 0.5, delay: 0.16 }} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <BarChart3 className={`mb-6 h-8 w-8 ${product.accent.text}`} />
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Product signals
          </p>
          <div className="space-y-4">
            {product.stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between gap-4">
                <span className="text-gray-400">{stat.label}</span>
                <span className="font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureSection({
  compact = false,
  description,
  eyebrow,
  features,
  icon,
  title,
}: {
  compact?: boolean;
  description: string;
  eyebrow: string;
  features: ProductFeature[];
  icon: "workflow" | "spark";
  title: string;
}) {
  return (
    <section className="px-4 py-24 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-4xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-purple-300">
            {eyebrow}
          </p>
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">{title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">{description}</p>
        </div>

        <div className={`grid gap-6 ${compact ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {features.map((feature, index) => {
            const Icon = icon === "workflow" ? Layers3 : Sparkles;

            return (
              <motion.article
                key={feature.title}
                {...cardMotion}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-colors hover:border-purple-400/30"
              >
                <Icon className="mb-6 h-7 w-7 text-purple-300" />
                <h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
                <p className="leading-7 text-gray-400">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection({ product }: { product: ProductDetail }) {
  return (
    <section className="px-4 pb-28 pt-24 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-blue-300">
              Build notes
            </p>
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              A product page pattern that can scale.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              OnTrack and Reach are both Expo, React Native, and Supabase products, so the common
              portfolio method is a mobile-app showcase with a workflow loop, differentiators,
              and a compact technical layer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {product.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {product.architecture.map((item, index) => (
              <motion.div
                key={item.title}
                {...cardMotion}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Cpu className="h-6 w-6 text-blue-300" />
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="leading-7 text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

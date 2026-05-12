"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { productDetails } from "@/data/products";

const featuredProductSlug = "been-to-box";
const externalProductUrls: Partial<Record<(typeof productDetails)[number]["slug"], string>> = {
    [featuredProductSlug]: "https://ryandeame--been-to-box.us-central1.hosted.app",
};
const orderedProductDetails = [...productDetails].sort((a, b) => {
    if (a.slug === featuredProductSlug) return -1;
    if (b.slug === featuredProductSlug) return 1;
    return 0;
});

export default function Products() {
    const containerRef = useRef<HTMLElement>(null);

    return (
        <section ref={containerRef} id="products" className="py-24 px-4 relative overflow-hidden w-full h-full">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            Products
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Mobile-first apps and product concepts built around daily momentum,
                        practical dashboards, and focused workflows.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {orderedProductDetails.map((product, index) => {
                        const externalUrl = externalProductUrls[product.slug];
                        const href = externalUrl ?? `/products/${product.slug}`;
                        const isFeatured = product.slug === featuredProductSlug;

                        return (
                            <motion.article
                                key={product.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                whileHover={{ y: -10 }}
                                className={`group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-purple-500/50 hover:to-blue-500/50 transition-all duration-500 ${isFeatured ? "md:scale-[1.03]" : ""}`}
                            >
                                {isFeatured ? (
                                    <div className="absolute -top-4 left-6 z-20 rounded-full border border-amber-300/40 bg-amber-300 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[0_8px_30px_rgba(251,191,36,0.25)]">
                                        Featured
                                    </div>
                                ) : null}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                <div className={`relative h-full bg-[#0a0a0a]/10 backdrop-blur-xl rounded-[22px] p-8 overflow-hidden border transition-colors ${isFeatured ? "border-amber-300/25 shadow-[0_0_80px_rgba(251,191,36,0.12)]" : "border-white/5 group-hover:border-white/10"}`}>
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${product.accent.from} ${product.accent.to} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`} />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
                                            <Image
                                                src={product.icon}
                                                alt={`${product.name} icon`}
                                                width={40}
                                                height={40}
                                                className="rounded-xl"
                                            />
                                        </div>

                                        {product.previewImage ? (
                                            <div className="relative mb-7 h-32 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                                                <Image
                                                    src={product.previewImage}
                                                    alt={`${product.name} preview`}
                                                    fill
                                                    sizes="(min-width: 768px) 28vw, 90vw"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5" />
                                            </div>
                                        ) : null}

                                        <p className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${product.accent.text}`}>
                                            {product.eyebrow}
                                        </p>
                                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                            {product.name}
                                        </h3>

                                        <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                                            {product.summary}
                                        </p>

                                        <Link
                                            href={href}
                                            className="flex items-center gap-2 text-sm font-bold text-white/40 group-hover:text-white transition-colors pt-4 border-t border-white/5"
                                            target={externalUrl ? "_blank" : undefined}
                                            rel={externalUrl ? "noreferrer" : undefined}
                                        >
                                            {externalUrl ? "Open app" : "View product"}
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

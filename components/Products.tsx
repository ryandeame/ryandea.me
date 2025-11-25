"use client";

import { motion, useScroll } from "framer-motion";
import { Search, FileText, RefreshCw } from "lucide-react";
import ProductBackground from "./ProductBackground";
import { useRef } from "react";

const products = [
    {
        title: "TalentScout",
        description: "Automated recruitment intelligence and industry-specific job curation. Find the best talent before your competitors do.",
        icon: Search,
        gradient: "from-purple-500 to-indigo-500",
        delay: 0
    },
    {
        title: "DocuFlow",
        description: "Enterprise-grade documentation publishing engine powered by Notion. Turn your internal docs into a beautiful public help center.",
        icon: FileText,
        gradient: "from-blue-500 to-cyan-500",
        delay: 0.1
    },
    {
        title: "SyncMaster",
        description: "Unified data synchronization hub for enterprise tools. Keep your CRM, ERP, and marketing platforms in perfect harmony.",
        icon: RefreshCw,
        gradient: "from-emerald-500 to-teal-500",
        delay: 0.2
    }
];

export default function Products() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} id="products" className="py-32 px-4 relative overflow-hidden w-full h-full">
            <ProductBackground scrollYProgress={scrollYProgress} />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Product Suite</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                        Powerful tools built to solve complex business problems.
                        <br className="hidden md:block" />
                        Designed for scale, security, and speed.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: product.delay }}
                            whileHover={{ y: -10 }}
                            className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-purple-500/50 hover:to-blue-500/50 transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            <div className="relative h-full bg-[#0a0a0a]/10 backdrop-blur-xl rounded-[22px] p-8 overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${product.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg shadow-black/20">
                                        <product.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                        {product.title}
                                    </h3>

                                    <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center text-sm font-bold text-white/40 group-hover:text-white transition-colors pt-4 border-t border-white/5">
                                        Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

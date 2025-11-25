"use client";

import { motion } from "framer-motion";
import { Briefcase, Zap, Plug } from "lucide-react";

const services = [
    {
        title: "Niche Job Board Aggregator",
        description: "Automated scraping and curation engine for specific industries. Launch a profitable job board in days, not months.",
        icon: Briefcase,
        gradient: "from-purple-500 to-indigo-500"
    },
    {
        title: "Notion-to-Site Converter",
        description: "Turn your Notion workspace into a blazing fast, SEO-optimized static website. Perfect for docs, blogs, and portfolios.",
        icon: Zap,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        title: "Custom API Connectors",
        description: "Bespoke integrations connecting your favorite tools. Sync Airtable, Shopify, and Google Sheets with custom logic.",
        icon: Plug,
        gradient: "from-emerald-500 to-teal-500"
    }
];

export default function Services() {
    return (
        <section id="services" className="py-32 px-4 bg-black/40 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Production-Ready <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">SaaS</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Fully managed micro-SaaS solutions. Deployed to your infrastructure.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                                    <service.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

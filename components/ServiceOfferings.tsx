"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FileSpreadsheet, Globe, BarChart3 } from "lucide-react";

const services = [
    {
        title: "Excel/Word Automation",
        description: "Transform your manual document workflows into efficient automated systems. Organize, process, and generate professional documents at scale.",
        price: "$99",
        priceLabel: "per Workbook",
        icon: FileSpreadsheet,
        image: "/service-excel-automation.png",
        gradient: "from-emerald-500 to-teal-500",
        features: ["Data organization", "Template automation", "Batch processing"]
    },
    {
        title: "Single Page Website",
        description: "Your business's digital business card. A clean, professional single-page site with a memorable URL and custom QR code for easy sharing.",
        price: "$99",
        priceLabel: "per Site",
        icon: Globe,
        image: "/service-webpage-design.png",
        gradient: "from-purple-500 to-indigo-500",
        features: ["Custom design", "QR code included", "Mobile responsive"],
        note: "Hosting & URL costs not included"
    },
    {
        title: "Custom Data Dashboard",
        description: "Visualize your key business metrics in one place. A personalized dashboard that turns your data into actionable insights.",
        price: "$99",
        priceLabel: "per Dashboard",
        icon: BarChart3,
        image: "/service-data-dashboard.png",
        gradient: "from-blue-500 to-cyan-500",
        features: ["Key metrics", "Visual charts", "Real-time updates"]
    }
];

export default function ServiceOfferings() {
    return (
        <section id="services" className="py-24 px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-purple-950/10 to-[#0a0a0a]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            Services
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Professional solutions to elevate your business. Each starting at just $99.
                    </p>
                </motion.div>

                {/* Inverted Triangle Layout - Desktop: 2 on top, 1 centered bottom */}
                <div className="flex flex-col gap-8">
                    {/* Top Row - 2 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:px-8">
                        {services.slice(0, 2).map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>

                    {/* Bottom Row - 1 centered card */}
                    <div className="grid grid-cols-1 md:max-w-xl md:mx-auto w-full">
                        <ServiceCard service={services[2]} index={2} />
                    </div>
                </div>
            </div>
        </section>
    );
}

interface Service {
    title: string;
    description: string;
    price: string;
    priceLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    image: string;
    gradient: string;
    features: string[];
    note?: string;
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
        >
            {/* Card container with glow effect */}
            <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Rounded Image Container with Glow */}
                <div className="relative mb-6 flex justify-center">
                    <div className="image-container relative">
                        {/* Glow effect */}
                        <div className="absolute -inset-2 rounded-2xl image-glow opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Image container with rounded corners */}
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden border-2 border-transparent image-border-glow">
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                sizes="400px"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-20 flex items-center justify-center border border-white/10`}>
                            <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                            {service.title}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {service.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {service.features.map((feature, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-4 border-t border-white/10">
                        <span className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${service.gradient}`}>
                            {service.price}
                        </span>
                        <span className="text-gray-500 text-sm">{service.priceLabel}</span>
                    </div>

                    {/* Note */}
                    {service.note && (
                        <p className="text-xs text-gray-500 mt-2 italic">{service.note}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

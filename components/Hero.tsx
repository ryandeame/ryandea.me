"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

interface HeroProps {
    showFloatingIcon?: boolean;
    showBackgroundImage?: boolean;
}

export default function Hero({
    showFloatingIcon = true,
    showBackgroundImage = true,
}: HeroProps) {
    const [isGlowing, setIsGlowing] = useState(true);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ position: 'relative' }}>
            {/* Background Image */}
            {showBackgroundImage && (
                <div className="absolute inset-0 z-0 w-full h-full">
                    <Image
                        src="/hero-bg.png"
                        alt="Cyber Background"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0a0a0a]" />
                </div>
            )}

            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center" style={{ position: 'relative' }}>
                {/* Floating decoration */}
                {showFloatingIcon && (
                    <div
                        className="absolute -top-20 right-10 opacity-20"
                        style={{ position: 'absolute' }}
                    >
                        <motion.div
                            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Sparkles className="w-24 h-24 text-purple-400" />
                        </motion.div>
                    </div>
                )}

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter mb-8"
                >
                    From Concept to <span className="text-purple-400">Business Impact</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12"
                >
                    Full-stack developer turning your ideas into production-ready solutions.
                    Clean code. Fast delivery. Real results for your business.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex justify-center"
                >
                    <a
                        href="#services"
                        className="relative group inline-block no-underline text-white"
                        style={{ color: 'white' }}
                        onMouseEnter={() => setIsGlowing(false)}
                        onMouseLeave={() => setIsGlowing(true)}
                        onTouchStart={() => setIsGlowing(false)}
                    >
                        {/* Outer glow ring */}
                        {isGlowing && (
                            <motion.div
                                className="absolute -inset-3 rounded-full bg-purple-500/40 blur-2xl"
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.6, 1, 0.6]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        )}

                        {/* Button container */}
                        <div
                            className="relative rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.6) 0%, rgba(126, 34, 206, 0.7) 50%, rgba(107, 33, 168, 0.8) 100%)',
                                boxShadow: isGlowing
                                    ? '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                    : '0 0 40px rgba(147, 51, 234, 0.8), 0 0 80px rgba(147, 51, 234, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                animation: isGlowing ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                                paddingLeft: '3rem',
                                paddingRight: '3rem',
                                paddingTop: '1.5rem',
                                paddingBottom: '1.5rem',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Button text */}
                            <span className="relative flex items-center gap-3 text-white font-bold text-lg tracking-wide z-10">
                                Explore Services
                                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

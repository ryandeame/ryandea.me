"use client";

import { motion } from "framer-motion";

const testimonials = [
    {
        quote: "TalentScout cut our hiring time in half. The automated curation is incredibly accurate.",
        author: "Sarah Jenkins",
        role: "HR Director, TechFlow",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
        quote: "DocuFlow turned our messy Notion docs into a world-class help center overnight.",
        author: "Mike Ross",
        role: "Product Manager",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    },
    {
        quote: "SyncMaster is the glue holding our operations together. It just works.",
        author: "Alex Thompson",
        role: "CTO, ScaleUp",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    {
        quote: "I can't imagine running our agency without TalentScout. It's a competitive advantage.",
        author: "Emily Wilson",
        role: "Recruiting Lead",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
    },
    {
        quote: "The design and reliability of DocuFlow are unmatched. Highly recommended.",
        author: "David Chen",
        role: "Content Lead",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    }
];

export default function Testimonials() {
    return (
        <section className="py-32 relative overflow-hidden border-y border-white/5 bg-black/20">
            <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Trusted by Industry Leaders</h2>
                <p className="text-gray-400">Join thousands of companies using our software to scale.</p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={i}
                            className="inline-block w-[400px] p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors whitespace-normal"
                        >
                            <p className="text-lg text-gray-300 italic mb-6 leading-relaxed">"{t.quote}"</p>
                            <div className="flex items-center gap-4">
                                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full bg-white/10" />
                                <div>
                                    <div className="font-bold text-white">{t.author}</div>
                                    <div className="text-sm text-purple-400">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

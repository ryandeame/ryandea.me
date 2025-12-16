"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function ContactForm() {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>(
        {
            type: null,
            message: "",
        }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactSpacing = { horizontal: 20, vertical: 28 };
    const formSpacing = { group: 20, label: 8 };

    const contactItems = [
        {
            title: "Sales Inquiry",
            email: "ryandeame@gmail.com",
            iconStyle: { filter: "drop-shadow(0 0 8px rgba(52, 152, 219, 0.5))" },
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#blue-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M7.0498 7.0498H7.0598M10.5118 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V10.5118C3 11.2455 3 11.6124 3.08289 11.9577C3.15638 12.2638 3.27759 12.5564 3.44208 12.8249C3.6276 13.1276 3.88703 13.387 4.40589 13.9059L9.10589 18.6059C10.2939 19.7939 10.888 20.388 11.5729 20.6105C12.1755 20.8063 12.8245 20.8063 13.4271 20.6105C14.112 20.388 14.7061 19.7939 15.8941 18.6059L18.6059 15.8941C19.7939 14.7061 20.388 14.112 20.6105 13.4271C20.8063 12.8245 20.8063 12.1755 20.6105 11.5729C20.388 10.888 19.7939 10.2939 18.6059 9.10589L13.9059 4.40589C13.387 3.88703 13.1276 3.6276 12.8249 3.44208C12.5564 3.27759 12.2638 3.15638 11.9577 3.08289C11.6124 3 11.2455 3 10.5118 3ZM7.5498 7.0498C7.5498 7.32595 7.32595 7.5498 7.0498 7.5498C6.77366 7.5498 6.5498 7.32595 6.5498 7.0498C6.5498 6.77366 6.77366 6.5498 7.0498 6.5498C7.32595 6.5498 7.5498 6.77366 7.5498 7.0498Z" />
                </svg>
            ),
        },
        {
            title: "Support",
            email: "ryandeame@gmail.com",
            iconStyle: { filter: "drop-shadow(0 0 8px rgba(68, 101, 173, 1))" },
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#blue-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
            ),
        },
    ];

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus({ type: null, message: "" });

        if (!formData.name || !formData.email || !formData.message) {
            setStatus({ type: "error", message: "Please fill out all fields." });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            setStatus({ type: "success", message: "Message sent! We'll be in touch soon." });
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error(error);
            setStatus({ type: "error", message: "Unable to send message. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact">
            <div
                className="w-full relative z-10 font-['Helvetica_Neue',_sans-serif]"
                style={{
                    //background: "url('/contact-bg.png')",
                    // backgroundSize: "1920px",
                    // backgroundRepeat: "no-repeat",
                    // backgroundPosition: "center",
                    // opacity: 1,
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                }}
            >
                <div className="absolute inset-0 mx-auto bg-black opacity-50" style={{
                    background: "url('/contact-bg.png')",
                    backgroundSize: "1920px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}></div>
                <div className="w-full max-w-[1024px] mx-auto p-8 md:p-12">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h2
                                className="text-[48px] font-bold mb-4 text-white"
                                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                            >
                                Ready to Get Started?
                            </h2>
                            <p className="text-gray-400 leading-relaxed max-w-2xl">
                                Book a demo with our sales team or start your free trial today.
                                See how our software can transform your business.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row">
                            <div
                                className="relative flex flex-col w-auto"
                                style={{ rowGap: `${contactSpacing.vertical}px` }}
                            >
                                <svg width="0" height="0" className="absolute" aria-hidden style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
                                    <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                                        <stop stopColor="#2ecc71" offset="0%" />
                                        <stop stopColor="#3498db" offset="100%" />
                                    </linearGradient>
                                </svg>

                                {contactItems.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start"
                                        style={{ columnGap: `${contactSpacing.horizontal}px` }}
                                    >
                                        <div
                                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center"
                                            style={item.iconStyle}
                                        >
                                            {item.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[16px] font-bold text-white">{item.title}</div>
                                            <div className="text-[16px] text-white">{item.email}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative w-full md:flex-1 max-w-[520px] mx-auto md:mx-0"
                            >
                                {/* Decorative background glow (kept inside bounds to avoid overflow) */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-lg -z-10" />

                                <form
                                    className="flex flex-col"
                                    style={{ rowGap: `${formSpacing.group}px` }}
                                    onSubmit={handleSubmit}
                                >
                                    <div
                                        className="flex flex-col"
                                        style={{ rowGap: `${formSpacing.label}px` }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 ml-1">Name</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full px-3 py-[12px] text-white placeholder-gray-400 focus:outline-none transition-all duration-300 font-['Helvetica_Neue',_sans-serif]"
                                                style={{
                                                    background: "rgba(42, 24, 62, 0.6)",
                                                    border: "1px solid #447aadff",
                                                    borderRadius: "8px",
                                                    color: "white"
                                                }}
                                                placeholder="Valued Customer"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="flex flex-col"
                                        style={{ rowGap: `${formSpacing.label}px` }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 ml-1">Email</label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full px-3 py-[12px] text-white placeholder-gray-400 focus:outline-none transition-all duration-300 font-['Helvetica_Neue',_sans-serif]"
                                                style={{
                                                    background: "rgba(42, 24, 62, 0.6)",
                                                    // border: "1px solid #8e44ad",
                                                    border: "1px solid #447aadff",
                                                    borderRadius: "8px",
                                                    color: "white"
                                                }}
                                                placeholder="valuedcustomer@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="flex flex-col"
                                        style={{ rowGap: `${formSpacing.label}px` }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 ml-1">Message</label>
                                        <div className="relative group">
                                            <textarea
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full px-3 py-[12px] text-white placeholder-gray-400 focus:outline-none transition-all duration-300 font-['Helvetica_Neue',_sans-serif] resize-none"
                                                style={{
                                                    background: "rgba(42, 24, 62, 0.6)",
                                                    border: "1px solid #447aadff",
                                                    borderRadius: "8px",
                                                    color: "white"
                                                }}
                                                placeholder="Tell us about your project..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-auto min-w-[200px] group relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                                            style={{
                                                background: "linear-gradient(to right, #8e44ad, #c0392b)",
                                                borderRadius: "25px",
                                                padding: "12px 24px",
                                                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                                                transition: "background 0.3s",
                                                color: "white"
                                            }}
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                <span className="font-bold text-white text-[18px]">
                                                    {isSubmitting ? "Sending..." : "Send Message"}
                                                </span>
                                            </div>
                                        </motion.button>
                                    </div>

                                    {status.type && (
                                        <div
                                            className={`text-center text-sm font-medium ${status.type === "success" ? "text-green-400" : "text-red-400"
                                                }`}
                                        >
                                            {status.message}
                                        </div>
                                    )}
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function ContactForm() {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
        type: null,
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="w-full max-w-[1024px] mx-auto relative z-10">
            <div className="bg-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl shadow-purple-500/10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Book a demo with our sales team or start your free trial today.
                            See how our software can transform your business.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl group-hover:bg-purple-500/20 transition-colors">
                                    📧
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Sales Inquiry</div>
                                    <div className="font-bold group-hover:text-purple-400 transition-colors">sales@saas-vendor.com</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl group-hover:bg-blue-500/20 transition-colors">
                                    📱
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Support</div>
                                    <div className="font-bold group-hover:text-blue-400 transition-colors">+1 (555) 123-4567</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative max-w-sm min-w-[300px] mx-auto w-full"
                    >
                        {/* Decorative background glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl -z-10" />

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 ml-1">Name</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-white/5 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                        placeholder="John Doe"
                                    />
                                    <motion.div
                                        initial={false}
                                        animate={{ opacity: focusedField === 'name' ? 1 : 0 }}
                                        className="absolute inset-0 rounded-xl bg-purple-500/10 pointer-events-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 ml-1">Email</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-white/5 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                        placeholder="john@company.com"
                                    />
                                    <motion.div
                                        initial={false}
                                        animate={{ opacity: focusedField === 'email' ? 1 : 0 }}
                                        className="absolute inset-0 rounded-xl bg-purple-500/10 pointer-events-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 ml-1">Message</label>
                                <div className="relative group">
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-white/5 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                                        placeholder="Tell us about your project..."
                                    />
                                    <motion.div
                                        initial={false}
                                        animate={{ opacity: focusedField === 'message' ? 1 : 0 }}
                                        className="absolute inset-0 rounded-xl bg-purple-500/10 pointer-events-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-auto min-w-[200px] group relative overflow-hidden rounded-xl p-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-100 transition-opacity" />
                                    <div className="relative bg-black/20 backdrop-blur-sm rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all group-hover:bg-transparent">
                                        <span className="font-bold text-white text-lg">
                                            {isSubmitting ? "Sending..." : "Send Message"}
                                        </span>
                                        <Send className="w-5 h-5 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </div>
                                </motion.button>
                            </div>

                            {status.type && (
                                <div
                                    className={`text-center text-sm font-medium ${
                                        status.type === "success" ? "text-green-400" : "text-red-400"
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
    );
}

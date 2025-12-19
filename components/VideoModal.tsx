"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoModalProps {
    isOpen: boolean;
    videoId: string;
    onClose: () => void;
}

export default function VideoModal({ isOpen, videoId, onClose }: VideoModalProps) {
    const [mounted, setMounted] = useState(false);

    // Ensure we only render portal on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, handleKeyDown]);

    // Close when clicking backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black md:bg-black/90 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-5xl aspect-video"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-10 md:-top-12 right-0 p-2 text-white/70 hover:text-white transition-colors z-10"
                            aria-label="Close video"
                        >
                            <X className="w-6 h-6 md:w-8 md:h-8" />
                        </button>

                        {/* YouTube iframe with proper permissions */}
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            title="YouTube video player"
                            className="w-full h-full rounded-lg md:rounded-xl shadow-2xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Use portal to render at document body level
    if (!mounted) return null;

    return createPortal(modalContent, document.body);
}


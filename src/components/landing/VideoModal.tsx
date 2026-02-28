"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { useEffect } from "react";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/95 backdrop-blur-xl cursor-zoom-out"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-6xl aspect-video bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-primary/20"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 backdrop-blur-md border border-border text-foreground hover:bg-background transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Video Placeholder Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-noise">
                            <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 relative"
                            >
                                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
                                <Play className="w-10 h-10 text-primary fill-primary ml-1" />
                            </motion.div>

                            <h2 className="text-2xl font-bold tracking-tight mb-2">Origins Pillar Product Tour</h2>
                            <p className="text-muted-foreground text-center max-w-md px-6">
                                Discover how to automate your productized agency from client onboarding to automated billing.
                            </p>

                            <div className="mt-8 flex gap-4">
                                <div className="px-4 py-2 rounded-full bg-secondary/80 border border-border text-xs font-semibold">4:20 Duration</div>
                                <div className="px-4 py-2 rounded-full bg-secondary/80 border border-border text-xs font-semibold">4K High Quality</div>
                            </div>
                        </div>

                        {/* Actual Video iFrame (using a high-quality productized agency demo or similar placeholder) */}
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&rel=0&modestbranding=1"
                            title="Origins Pillar Tour"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

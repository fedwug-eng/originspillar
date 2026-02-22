import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay },
    }),
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const wordReveal: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (delay = 0) => ({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut", delay },
    }),
};

export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut", delay },
    }),
};

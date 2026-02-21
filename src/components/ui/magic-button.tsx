"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { HTMLMotionProps } from "framer-motion";

interface MagicButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "outline";
}

export function MagicButton({
    children,
    className,
    variant = "primary",
    ...props
}: MagicButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [hovered, setHovered] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
        const relativeX = e.clientX - left - width / 2;
        const relativeY = e.clientY - top - height / 2;
        setX(relativeX * 0.2); // Magnetic pull strength
        setY(relativeY * 0.2);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        setX(0);
        setY(0);
    };

    const variants = {
        primary: "bg-violet-600 text-white border-transparent hover:bg-violet-500 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]",
        secondary: "bg-white text-zinc-950 border-transparent hover:bg-zinc-200 shadow-xl",
        outline: "bg-transparent text-white border-white/20 hover:border-white/40 hover:bg-white/5",
    };

    return (
        <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-medium text-sm transition-colors border outline-none overflow-hidden",
                variants[variant],
                className
            )}
            {...props}
        >
            {/* Ripple/Glow effect on hover */}
            {hovered && variant !== "outline" && (
                <motion.div
                    layoutId="button-glow"
                    className="absolute inset-0 z-0 bg-white/20 blur-xl rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            )}

            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}

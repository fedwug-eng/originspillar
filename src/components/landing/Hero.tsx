"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { staggerContainer, wordReveal } from "@/lib/animations";
import InteractiveDemoMockup from "./InteractiveDemoMockup";
import VideoModal from "./VideoModal";

const headline = "Run your productized agency on autopilot.";
const words = headline.split(" ");

const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const mockupY = useTransform(scrollY, [0, 800], [0, -80]);
  const mockupOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);

  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-noise">
      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />

      {/* Aura orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-primary/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center" ref={containerRef}>
        {/* Headline */}
        <motion.h1
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6"
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordReveal}
              className={`inline-block mr-[0.25em] ${word === "autopilot." ? "text-gradient" : "text-foreground"
                }`}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12"
        >
          One white-labeled platform for payments, projects, and client communication.
          Stop juggling tools. Start scaling your agency.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="relative flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          {/* CTA glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-20 bg-primary/8 rounded-full blur-[40px]" />
          </div>

          <Link
            href="/sign-up"
            className="relative inline-flex items-center gap-2 bg-foreground text-background font-semibold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsVideoOpen(true)}
            className="relative inline-flex items-center gap-2 bg-background text-foreground font-semibold px-8 py-4 rounded-xl text-base border border-border hover:border-muted-foreground/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <Play className="w-4 h-4" /> Watch Demo
          </button>
        </motion.div>

        {/* Interactive Dashboard Demo */}
        <div style={{ perspective: 1200 }}>
          <motion.div
            style={{ y: mockupY, opacity: mockupOpacity }}
            initial={{ rotateX: 8, opacity: 0, y: 60 }}
            animate={{ rotateX: 6, opacity: 1, y: 0 }}
            whileHover={{ rotateX: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="relative mx-auto max-w-5xl"
          >
            <InteractiveDemoMockup />

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </section>
  );
};

export default Hero;

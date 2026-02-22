"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section className="relative py-32 overflow-hidden bg-noise">
    {/* Gradient bg */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/15 to-background pointer-events-none" />
    <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

    {/* Floating shapes */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-16 left-[8%] w-20 h-20 rounded-2xl bg-primary/[0.04] animate-float border border-primary/[0.06]" />
      <div className="absolute top-32 right-[12%] w-14 h-14 rounded-full bg-op-indigo/[0.04] animate-float-delayed border border-op-indigo/[0.06]" />
      <div className="absolute bottom-24 left-[18%] w-24 h-24 rounded-full bg-primary/[0.03] animate-float-delayed" />
      <div className="absolute bottom-36 right-[22%] w-8 h-8 rounded-lg bg-op-indigo/[0.04] animate-float rotate-45" />
      <div className="absolute top-24 right-[30%] w-16 h-16 rounded-full border border-primary/[0.06] animate-float" />
      <div className="absolute bottom-16 left-[35%] w-12 h-12 rounded-full border border-op-indigo/[0.06] animate-float-delayed" />
    </div>

    <div className="relative max-w-3xl mx-auto px-6 text-center">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-40 bg-primary/[0.06] rounded-full blur-[100px]" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6"
      >
        Get started today
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative text-4xl sm:text-5xl font-bold tracking-tight mb-6"
      >
        Ready to streamline your agency?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative text-xl text-muted-foreground mb-12 leading-relaxed"
      >
        Be among the first agencies to replace their entire tool stack with a single, beautiful platform.
      </motion.p>

      <motion.a
        href="/sign-up"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative inline-flex items-center gap-2.5 bg-gradient-accent text-primary-foreground font-semibold px-10 py-4.5 rounded-xl text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
      >
        Start Your Free Trial <ArrowRight className="w-5 h-5" />
      </motion.a>
    </div>
  </section>
);

export default FinalCTA;

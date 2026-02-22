"use client";
import { motion } from "framer-motion";
import { Palette, Code2, Megaphone, PenTool } from "lucide-react";
import { fadeUp } from "@/lib/animations";

const audiences = [
  {
    icon: Palette,
    title: "Design Agencies",
    description: "Deliver brand assets, manage revisions, and collect payments, all through your own branded portal.",
    gradient: "from-pink-500/10 to-primary/5",
  },
  {
    icon: Code2,
    title: "Dev Shops",
    description: "Track sprints, share staging links, and invoice clients without juggling five different tools.",
    gradient: "from-primary/10 to-op-indigo/5",
  },
  {
    icon: Megaphone,
    title: "Marketing Teams",
    description: "Coordinate campaigns, share deliverables, and keep clients in the loop with real-time project boards.",
    gradient: "from-op-amber/10 to-op-emerald/5",
  },
  {
    icon: PenTool,
    title: "Content Agencies",
    description: "Manage editorial calendars, gather approvals, and streamline content delivery at scale.",
    gradient: "from-op-emerald/10 to-primary/5",
  },
];

const BuiltFor = () => (
  <section className="py-24 lg:py-32 relative overflow-hidden bg-secondary/40 section-glow">
    <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

    <div className="relative max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Built for you
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Built for agencies like yours
        </h2>
        <p className="text-xl text-muted-foreground">
          Whether you're a team of 2 or 200, Originspillar adapts to how you work.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {audiences.map((item, i) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.1}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group relative bg-card border border-border rounded-2xl p-7 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-500"
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-300">
                <item.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BuiltFor;

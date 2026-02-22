"use client";
import { motion } from "framer-motion";
import { CreditCard, KanbanSquare, MessageCircle, FolderOpen, ArrowRight } from "lucide-react";

const tools = [
  {
    category: "Payments",
    description: "Built-in invoicing and checkout — no third-party billing tool needed",
    icon: CreditCard,
  },
  {
    category: "Project Management",
    description: "Kanban boards, timelines, and milestones in one place",
    icon: KanbanSquare,
  },
  {
    category: "Communication",
    description: "In-app messaging so nothing gets lost in email threads",
    icon: MessageCircle,
  },
  {
    category: "File Sharing",
    description: "Share deliverables and gather feedback without leaving the portal",
    icon: FolderOpen,
  },
];

const ReplacesStack = () => (
  <section className="py-20 bg-secondary/60 relative section-glow">
    <div className="max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
          All-in-one platform
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Everything you need, nothing you don't
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
              <tool.icon className="w-5 h-5 text-accent-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1.5">{tool.category}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {tool.description}
            </p>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ReplacesStack;

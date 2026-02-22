"use client";
import { motion } from "framer-motion";
import { CreditCard, GitBranch, MessageCircle, KanbanSquare, Check, Lock, User } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { Progress } from "@/components/ui/progress";

const features = [
  {
    title: "One-Click Checkouts",
    description: "Accept payments instantly with Stripe-powered checkout. Clients buy services directly from your branded portal.",
    icon: CreditCard,
    color: "text-op-emerald",
    bgColor: "bg-op-emerald/10",
    span: "md:col-span-2",
    visual: (
      <div className="mt-6 bg-secondary/80 rounded-xl p-5 relative overflow-hidden group-hover:shadow-md transition-all duration-500">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-op-emerald/15 flex items-center justify-center">
            <Check className="w-5 h-5 text-op-emerald" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Payment Successful</p>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-op-emerald opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-op-emerald" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">$5,000.00 — Logo Design Package</p>
          </div>
        </div>
        <Progress value={100} className="h-1.5 bg-muted" />
        <div className="flex justify-between mt-2">
          <span className="text-[9px] text-muted-foreground">Invoice #042</span>
          <span className="text-[9px] text-op-emerald font-medium">Completed</span>
        </div>
        <div className="absolute inset-0 shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    ),
  },
  {
    title: "Magic Routing",
    description: "Separate agency and client views. Each sees exactly what they need — nothing more.",
    icon: GitBranch,
    color: "text-primary",
    bgColor: "bg-primary/10",
    span: "md:col-span-1",
    visual: (
      <div className="mt-6 relative h-32">
        <motion.div
          className="absolute top-0 left-0 w-[82%] bg-secondary rounded-xl border border-border p-3 transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-lg"
        >
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-muted-foreground" />
            <p className="text-[10px] font-semibold text-muted-foreground">Agency View</p>
          </div>
          <p className="text-[9px] text-muted-foreground/60 mt-1">Full project controls & billing</p>
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0 w-[82%] bg-accent rounded-xl border border-primary/20 p-3 transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-lg"
        >
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-accent-foreground" />
            <p className="text-[10px] font-semibold text-accent-foreground">Client View</p>
          </div>
          <p className="text-[9px] text-muted-foreground/60 mt-1">Clean, branded portal</p>
        </motion.div>
      </div>
    ),
  },
  {
    title: "In-App Chat",
    description: "Built-in messaging on every request. No more lost email threads or Slack channels.",
    icon: MessageCircle,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    span: "md:col-span-1",
    visual: (
      <div className="mt-6 space-y-2.5">
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground text-xs rounded-2xl rounded-br-sm px-3.5 py-2.5 max-w-[85%] shadow-sm">
            <p>Logo drafts ready! ✨</p>
            <p className="text-[9px] opacity-60 mt-0.5 text-right">2:34 PM ✓✓</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-secondary text-foreground text-xs rounded-2xl rounded-bl-sm px-3.5 py-2.5 max-w-[85%] shadow-sm">
            <p>Love them — let's go with V2!</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">2:35 PM</p>
          </div>
        </div>
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-1 group-hover:translate-y-0">
          <div className="bg-muted rounded-2xl px-3.5 py-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Drag & Drop Kanban",
    description: "Visual project management that your whole team and clients can follow in real time.",
    icon: KanbanSquare,
    color: "text-op-amber",
    bgColor: "bg-op-amber/10",
    span: "md:col-span-2",
    visual: (
      <div className="mt-6 grid grid-cols-3 gap-2.5">
        {[
          { title: "Backlog", count: 3, cards: [{ name: "Brand audit", color: "border-l-primary", avatar: "SA" }] },
          { title: "In Progress", count: 5, cards: [{ name: "Homepage wireframes", color: "border-l-op-amber", avatar: "JD" }, { name: "Icon set design", color: "border-l-pink-500", avatar: "MK" }] },
          { title: "Done", count: 12, cards: [{ name: "Client onboarding", color: "border-l-op-emerald", avatar: "AL" }] },
        ].map((col, ci) => (
          <div key={col.title}>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-semibold text-muted-foreground">{col.title}</p>
              <span className="text-[8px] text-muted-foreground/50 bg-muted rounded-full px-1.5 py-0.5">{col.count}</span>
            </div>
            <div className="space-y-2">
              {col.cards.map((card, j) => (
                <div
                  key={card.name}
                  className={`bg-secondary rounded-xl p-3 border border-border border-l-2 ${card.color} text-[10px] text-foreground transition-all duration-500 ${
                    ci === 0 && j === 0 ? "group-hover:translate-x-[calc(200%+0.75rem)] group-hover:-rotate-1 group-hover:shadow-lg group-hover:bg-accent" : ""
                  }`}
                >
                  <p className="font-medium">{card.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-primary">{card.avatar}</span>
                    </div>
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const Features = () => (
  <section id="features" className="py-24 lg:py-32 relative bg-noise section-glow">
    <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
    <div className="relative max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Features
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Everything your agency needs.
        </h2>
        <p className="text-xl text-muted-foreground">Nothing you don't.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.1}
            className={`group p-7 rounded-2xl bg-card border border-border hover:border-primary/20 shadow-sm hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-500 ${feature.span}`}
          >
            <div className={`w-11 h-11 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1.5">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            {feature.visual}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;

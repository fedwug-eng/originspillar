"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play, TrendingUp, Users, FolderKanban, DollarSign, CheckCircle2, Clock, BarChart3, Bell, Search, ChevronRight, FileText, Star } from "lucide-react";
import { staggerContainer, wordReveal } from "@/lib/animations";

const headline = "Run your productized agency on autopilot.";
const words = headline.split(" ");

/* ── Sidebar nav items ── */
const sidebarItems = [
  { label: "Dashboard", icon: BarChart3, active: true },
  { label: "Projects", icon: FolderKanban, active: false },
  { label: "Clients", icon: Users, active: false },
  { label: "Invoices", icon: DollarSign, active: false },
];

/* ── Metric cards data ── */
const metrics = [
  { label: "Monthly Revenue", value: "$48,260", change: "+18.2%", icon: DollarSign, positive: true },
  { label: "Active Projects", value: "24", change: "+6", icon: FolderKanban, positive: true },
  { label: "Total Clients", value: "16", change: "+3", icon: Users, positive: true },
  { label: "Avg. Delivery", value: "3.4 days", change: "-1.2d", icon: Clock, positive: true },
];

/* ── Revenue chart data (realistic monthly growth) ── */
const revenueData = [28, 32, 35, 31, 38, 42, 39, 46, 52, 48, 55, 62];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ── Activity feed ── */
const activities = [
  { text: "Invoice #087 paid", sub: "$4,800 - Brand Package", icon: CheckCircle2, time: "2m ago" },
  { text: "New project started", sub: "E-commerce Redesign", icon: FolderKanban, time: "18m ago" },
  { text: "Client onboarded", sub: "Vertex Labs", icon: Users, time: "1h ago" },
  { text: "Milestone completed", sub: "UI Kit v3.0 delivered", icon: Star, time: "3h ago" },
];

const DashboardMockup = () => (
  <div className="bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden">
    {/* ── Window chrome ── */}
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-destructive/60" />
        <div className="w-3 h-3 rounded-full bg-op-amber/60" />
        <div className="w-3 h-3 rounded-full bg-op-emerald/60" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="bg-muted rounded-md px-4 py-1 text-xs text-muted-foreground w-60 text-center flex items-center justify-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-op-emerald/60" />
          app.youragency.com
        </div>
      </div>
    </div>

    <div className="flex min-h-[440px]">
      {/* ── Sidebar ── */}
      <div className="hidden sm:flex w-48 border-r border-border bg-muted/20 flex-col">
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-accent flex items-center justify-center">
              <span className="text-primary-foreground text-[8px] font-bold">●</span>
            </div>
            <span className="text-xs font-bold text-foreground">Your Agency</span>
          </div>
        </div>

        <div className="p-3 flex-1 space-y-0.5">
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors ${item.active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
                }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary">JD</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground">Jane Doe</p>
              <p className="text-[8px] text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 p-5 bg-secondary/20">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold text-foreground">Dashboard</p>
            <p className="text-[10px] text-muted-foreground">Welcome back, Jane</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
              <Search className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="relative w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="w-3 h-3 text-muted-foreground" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
            </div>
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
          {metrics.map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-3 group">
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                  <m.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-[9px] font-semibold text-op-emerald">{m.change}</span>
              </div>
              <p className="text-xs font-bold text-foreground">{m.value}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2.5">
          {/* ── Revenue chart ── */}
          <div className="col-span-3 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold text-foreground">Revenue Overview</p>
                <p className="text-[8px] text-muted-foreground">Last 12 months</p>
              </div>
              <div className="flex items-center gap-1 bg-op-emerald/10 px-1.5 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3 text-op-emerald" />
                <span className="text-[9px] font-semibold text-op-emerald">+22%</span>
              </div>
            </div>
            {/* Bar chart */}
            <div className="flex items-end gap-1.5 h-[90px]">
              {revenueData.map((h, i) => {
                const maxVal = Math.max(...revenueData);
                const pct = (h / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-sm transition-all ${i >= 10
                        ? "bg-gradient-accent"
                        : i >= 8
                          ? "bg-primary/40"
                          : "bg-primary/15"
                        }`}
                      style={{ height: `${pct}%` }}
                    />
                    <span className="text-[7px] text-muted-foreground">{months[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Activity feed ── */}
          <div className="col-span-2 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-foreground">Recent Activity</p>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-primary/8 flex items-center justify-center mt-0.5 shrink-0">
                    <a.icon className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-foreground leading-tight">{a.text}</p>
                    <p className="text-[8px] text-muted-foreground truncate">{a.sub}</p>
                  </div>
                  <span className="text-[7px] text-muted-foreground shrink-0 mt-0.5">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Hero = () => {
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
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-op-indigo/[0.03] rounded-full blur-[120px]" />
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

          <motion.a
            href="/sign-up"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center gap-2 bg-foreground text-background font-semibold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </motion.a>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center gap-2 bg-background text-foreground font-semibold px-8 py-4 rounded-xl text-base border border-border hover:border-muted-foreground/30 hover:shadow-lg transition-all duration-300"
          >
            <Play className="w-4 h-4" /> Watch Demo
          </motion.a>
        </motion.div>

        {/* Dashboard */}
        <div style={{ perspective: 1200 }}>
          <motion.div
            style={{ y: mockupY, opacity: mockupOpacity }}
            initial={{ rotateX: 8, opacity: 0, y: 60 }}
            animate={{ rotateX: 6, opacity: 1, y: 0 }}
            whileHover={{ rotateX: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="relative mx-auto max-w-5xl"
          >
            <DashboardMockup />

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default Hero;

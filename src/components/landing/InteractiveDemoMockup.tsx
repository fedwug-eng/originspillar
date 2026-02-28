"use client";

import { useState } from "react";
import Image from "next/image";
import {
    BarChart3, FolderKanban, Users, DollarSign, Settings, Search,
    Package, MessageSquare, Bell, ChevronRight, TrendingUp, CheckCircle2,
    Clock, Star, Key, Plus, User, Palette, Shield, CreditCard,
    BellRing, Building2, LogOut, Calendar, Upload, File, FileText, Image as ImageIcon, Paperclip, AlertCircle, Server, Activity, Network
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   MOCK DATA — all from the user's screenshots
   ════════════════════════════════════════════════════════════════════ */

const sidebarLinks = [
    { label: "Overview", icon: BarChart3, id: "overview" },
    { label: "Requests", icon: FolderKanban, id: "requests" },
    { label: "Communications", icon: MessageSquare, id: "communications", badge: 4 },
    { label: "Clients", icon: Users, id: "clients" },
    { label: "Services", icon: Package, id: "services" },
    { label: "Billing", icon: DollarSign, id: "billing" },
    { label: "Settings", icon: Settings, id: "settings" },
    { label: "API Gateway", icon: Network, id: "api-gateway" },
];

const overviewMetrics = [
    { label: "Monthly Revenue", value: "$48,260", change: "+18.2%", icon: DollarSign },
    { label: "Active Clients", value: "16", change: "+3", icon: Users },
    { label: "Open Requests", value: "12", change: "+4", icon: FolderKanban },
    { label: "Completed", value: "38", change: "+8 this month", icon: CheckCircle2 },
];

const revenueData = [28, 32, 35, 31, 38, 42, 39, 46, 52, 48, 55, 62];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const activities = [
    { text: "Invoice #087 paid", sub: "$4,800 — Brand Package", icon: CheckCircle2, time: "2m ago" },
    { text: "New request submitted", sub: "E-commerce Redesign — Vertex Labs", icon: FolderKanban, time: "18m ago" },
    { text: "Client onboarded", sub: "Vertex Labs", icon: Users, time: "1h ago" },
    { text: "Milestone completed", sub: "UI Kit v3.0 delivered", icon: Star, time: "3h ago" },
    { text: "Payment received", sub: "$2,400 — Logo Suite", icon: DollarSign, time: "5h ago" },
];

const quickActions = [
    { label: "View Requests", sub: "12 open", icon: FolderKanban, to: "requests" },
    { label: "Manage Clients", sub: "16 total", icon: Users, to: "clients" },
    { label: "Services", sub: "5 active", icon: Package, to: "services" },
    { label: "Billing", sub: "3 pending", icon: DollarSign, to: "billing" },
];

const requests = [
    { title: "E-commerce Redesign", client: "Vertex Labs", status: "In Progress", progress: 68, due: "Mar 15", amount: "$12,000", color: "text-amber-400 bg-amber-400/10" },
    { title: "Brand Identity Package", client: "Nova Studio", status: "In Progress", progress: 42, due: "Mar 22", amount: "$8,500", color: "text-amber-400 bg-amber-400/10" },
    { title: "Mobile App UI Kit", client: "Pulse Digital", status: "In Review", progress: 90, due: "Feb 28", amount: "$15,000", color: "text-primary bg-primary/10" },
    { title: "Website Migration", client: "Atlas Corp", status: "Completed", progress: 100, due: "Feb 10", amount: "$6,200", color: "text-emerald-400 bg-emerald-400/10" },
    { title: "Marketing Dashboard", client: "Spark Agency", status: "In Progress", progress: 25, due: "Apr 5", amount: "$9,800", color: "text-amber-400 bg-amber-400/10" },
    { title: "Logo Redesign", client: "Drift Co", status: "Not Started", progress: 0, due: "Apr 12", amount: "$3,500", color: "text-muted-foreground bg-muted" },
    { title: "Social Media Kit", client: "Vertex Labs", status: "Completed", progress: 100, due: "Jan 30", amount: "$4,000", color: "text-emerald-400 bg-emerald-400/10" },
    { title: "SaaS Landing Page", client: "CloudSync", status: "In Progress", progress: 55, due: "Mar 18", amount: "$7,200", color: "text-amber-400 bg-amber-400/10" },
];

const commClients = [
    { name: "Vertex Labs", initials: "VL", color: "bg-blue-600", time: "2m ago", preview: "Looks great! Let's finalize the che...", unread: 3, projects: ["E-commerce Redesign", "Social Media Kit", "Marketing Dashboard"] },
    { name: "Nova Studio", initials: "NS", color: "bg-emerald-600", time: "18m ago", preview: "Can we schedule a review for the ...", unread: 1 },
    { name: "Pulse Digital", initials: "PD", color: "bg-amber-700", time: "1h ago", preview: "Invoice received, processing payment ...", unread: 0 },
    { name: "Atlas Corp", initials: "AC", color: "bg-purple-600", time: "3h ago", preview: "Please send over the updated wirefram...", unread: 0 },
    { name: "CloudSync", initials: "CS", color: "bg-teal-600", time: "1d ago", preview: "We're happy with the final deliverables!", unread: 0 },
];

const clients = [
    { name: "Vertex Labs", initials: "VL", color: "bg-emerald-600", email: "hello@vertexlabs.io", projects: 3, spent: "$28,400", status: "Active" },
    { name: "Nova Studio", initials: "NS", color: "bg-emerald-600", email: "team@novastudio.co", projects: 2, spent: "$16,500", status: "Active" },
    { name: "Pulse Digital", initials: "PD", color: "bg-amber-700", email: "info@pulsedigital.com", projects: 1, spent: "$15,000", status: "Active" },
    { name: "Atlas Corp", initials: "AC", color: "bg-purple-600", email: "ops@atlascorp.io", projects: 2, spent: "$12,800", status: "Active" },
    { name: "Spark Agency", initials: "SA", color: "bg-green-600", email: "hi@sparkagency.co", projects: 1, spent: "$9,800", status: "Active" },
    { name: "Drift Co", initials: "DC", color: "bg-blue-600", email: "hello@drift.co", projects: 1, spent: "$3,500", status: "New" },
    { name: "CloudSync", initials: "CS", color: "bg-orange-600", email: "dev@cloudsync.io", projects: 1, spent: "$7,200", status: "Active" },
    { name: "Meridian Tech", initials: "MT", color: "bg-pink-600", email: "contact@meridian.tech", projects: 0, spent: "$0", status: "Lead" },
];

const services = [
    { name: "Brand Identity Package", status: "Active", desc: "Complete brand system including logo, typography, color palette, and guidelines.", price: "$4,500", period: "one-time", features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography System"], active: 3 },
    { name: "Website Design & Development", status: "Active", desc: "Custom responsive website with up to 10 pages, CMS integration, and SEO.", price: "$8,000", period: "one-time", features: ["Wireframes", "UI Design", "Development", "CMS Setup"], active: 5 },
    { name: "Monthly Retainer — Design", status: "Active", desc: "Ongoing design support with unlimited requests and 48-hour turnaround.", price: "$3,500", period: "/month", features: ["Unlimited Requests", "48h Turnaround", "Dedicated Designer", "Slack Support"], active: 4 },
    { name: "Social Media Kit", status: "Active", desc: "Templates and assets for Instagram, LinkedIn, and Twitter branded content.", price: "$2,200", period: "one-time", features: ["Post Templates", "Story Templates", "Brand Assets", "Content Calendar"], active: 2 },
    { name: "UI/UX Audit", status: "Draft", desc: "Comprehensive review of your product's user experience with actionable recommendations.", price: "$1,800", period: "one-time", features: ["Heuristic Analysis", "User Flow Review", "Recommendations Report"], active: 1 },
    { name: "Premium Retainer — Full Service", status: "Active", desc: "All-inclusive design, development, and strategy support for scaling teams.", price: "$7,500", period: "/month", features: ["Design + Dev", "Strategy Calls", "Priority Support", "Quarterly Reviews"], active: 2 },
];

const invoices = [
    { id: "INV-087", client: "Vertex Labs", project: "Brand Package", amount: "$4,800", status: "Paid", statusColor: "text-emerald-400 bg-emerald-400/10", due: "Feb 28, 2026" },
    { id: "INV-086", client: "Pulse Digital", project: "Mobile App UI Kit", amount: "$7,500", status: "Paid", statusColor: "text-emerald-400 bg-emerald-400/10", due: "Feb 25, 2026" },
    { id: "INV-085", client: "Nova Studio", project: "Brand Identity", amount: "$4,250", status: "Pending", statusColor: "text-amber-400 bg-amber-400/10", due: "Mar 1, 2026" },
    { id: "INV-084", client: "Atlas Corp", project: "Website Migration", amount: "$6,200", status: "Paid", statusColor: "text-emerald-400 bg-emerald-400/10", due: "Feb 18, 2026" },
    { id: "INV-083", client: "Spark Agency", project: "Marketing Dashboard", amount: "$3,200", status: "Overdue", statusColor: "text-rose-400 bg-rose-400/10", due: "Feb 10, 2026" },
    { id: "INV-082", client: "CloudSync", project: "SaaS Landing Page", amount: "$3,600", status: "Pending", statusColor: "text-amber-400 bg-amber-400/10", due: "Mar 5, 2026" },
    { id: "INV-081", client: "Vertex Labs", project: "Social Media Kit", amount: "$4,000", status: "Paid", statusColor: "text-emerald-400 bg-emerald-400/10", due: "Feb 5, 2026" },
    { id: "INV-080", client: "Drift Co", project: "Logo Redesign", amount: "$1,750", status: "Draft", statusColor: "text-muted-foreground bg-muted", due: "—" },
];

const settingsItems = [
    { label: "Profile", sub: "Update your personal info and avatar", icon: User },
    { label: "Agency", sub: "Company name, logo, and branding", icon: Building2 },
    { label: "Notifications", sub: "Email and in-app notification preferences", icon: BellRing },
    { label: "Appearance", sub: "Theme, colors, and display settings", icon: Palette },
    { label: "Security", sub: "Password, 2FA, and session management", icon: Shield },
    { label: "Billing", sub: "Plan, payment methods, and invoices", icon: CreditCard },
    { label: "API Keys", sub: "Manage API keys and third-party integrations", icon: Key },
];

/* ════════════════════════════════════════════════════════════════════
   PAGE VIEWS
   ════════════════════════════════════════════════════════════════════ */

function OverviewView({ onNav }: { onNav: (id: string) => void }) {
    const maxVal = Math.max(...revenueData);
    const [clickedMetric, setClickedMetric] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            <div>
                <p className="text-sm font-bold text-foreground">Dashboard</p>
                <p className="text-[10px] text-muted-foreground">Your agency&apos;s performance at a glance.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {overviewMetrics.map((m, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setClickedMetric(i);
                            setTimeout(() => setClickedMetric(null), 300);
                        }}
                        className={`bg-card border border-border rounded-xl p-2.5 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-md ${clickedMetric === i ? 'scale-[0.98] bg-accent' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                <m.icon className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-[8px] font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">{m.change}</span>
                        </div>
                        <p className="text-xs font-bold text-foreground">{m.value}</p>
                        <p className="text-[8px] text-muted-foreground">{m.label}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-card border border-border rounded-xl p-3">
                    <p className="text-[10px] font-semibold text-foreground/80 mb-2">Quick Actions</p>
                    <div className="space-y-1">
                        {quickActions.map((a, i) => (
                            <button key={i} onClick={() => onNav(a.to)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors text-left group">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"><a.icon className="w-3 h-3 text-primary" /></div>
                                    <div><p className="text-[9px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{a.label}</p><p className="text-[7px] text-muted-foreground">{a.sub}</p></div>
                                </div>
                                <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-semibold text-foreground/80">Recent Activity</p>
                        <span className="text-[8px] text-primary/60 cursor-pointer hover:text-primary transition-colors">View all</span>
                    </div>
                    <div className="space-y-2">
                        {activities.map((a, i) => (
                            <div key={i} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><a.icon className="w-2.5 h-2.5 text-primary" /></div>
                                <div className="flex-1 min-w-0"><p className="text-[9px] font-medium text-foreground/80">{a.text}</p><p className="text-[7px] text-muted-foreground truncate">{a.sub}</p></div>
                                <span className="text-[7px] text-muted-foreground/60 shrink-0">{a.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 cursor-pointer group hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between mb-3">
                    <div><p className="text-[10px] font-semibold text-foreground/80">Revenue Overview</p><p className="text-[7px] text-muted-foreground">Last 12 months</p></div>
                    <div className="flex items-center gap-1 bg-emerald-400/10 px-1.5 py-0.5 rounded group-hover:bg-emerald-400/20 transition-colors"><TrendingUp className="w-3 h-3 text-emerald-400" /><span className="text-[8px] font-semibold text-emerald-400">+22%</span></div>
                </div>
                <div className="relative h-[80px] w-full mt-2">
                    {/* Y-axis grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="w-full border-t border-border/40 border-dashed"></div>
                        <div className="w-full border-t border-border/40 border-dashed"></div>
                        <div className="w-full border-t border-border/40 border-dashed"></div>
                        <div className="w-full border-t border-border/40 border-solid"></div>
                    </div>
                    {/* SVG Line Chart */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="currentColor" className="text-primary" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d={`M 0,100 ${revenueData.map((val, i) => `L ${i * (100 / 11)},${100 - (val / maxVal) * 90}`).join(' ')} L 100,100 Z`}
                            fill="url(#line-gradient)"
                        />
                        <path
                            d={`M ${revenueData.map((val, i) => `${i === 0 ? '' : 'L'} ${i * (100 / 11)},${100 - (val / maxVal) * 90}`).join(' ')}`}
                            fill="none"
                            stroke="currentColor"
                            className="text-primary"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Data Points */}
                        {revenueData.map((val, i) => (
                            <circle
                                key={i}
                                cx={i * (100 / 11)}
                                cy={100 - (val / maxVal) * 90}
                                r="2.5"
                                fill="currentColor"
                                className="text-card stroke-primary stroke-[1.5px] transition-transform hover:scale-150 cursor-pointer"
                            />
                        ))}
                    </svg>
                    {/* X-axis labels */}
                    <div className="absolute -bottom-4 left-0 right-0 flex justify-between">
                        {months.map((m, i) => (
                            <span key={i} className="text-[6px] text-muted-foreground font-medium">{m}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function RequestsView() {
    const [clickedReq, setClickedReq] = useState<number | null>(null);
    const [viewingReq, setViewingReq] = useState<number | null>(null);

    if (viewingReq !== null) {
        const req = requests[viewingReq];
        const isEcommerce = req.title === "E-commerce Redesign";

        return (
            <div className="space-y-4 relative animate-in fade-in slide-in-from-right-4 duration-300 pb-10 max-w-[800px] mx-auto">
                <button
                    onClick={() => setViewingReq(null)}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    <ChevronRight className="w-3 h-3 rotate-180" /> Back to Projects
                </button>

                {/* Header Profile */}
                <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <FolderKanban className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-[16px] font-bold text-foreground tracking-tight">{req.title}</h2>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${req.color} border-current/20`}>{req.status}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mb-1">{req.client}</p>
                        <p className="text-[10px] text-muted-foreground/80 leading-relaxed max-w-xl">
                            {isEcommerce ? "Complete redesign of the e-commerce platform including product pages, checkout flow, and mobile optimization." : "Detailed project brief and client requirements go here."}
                        </p>
                    </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                    <div className="bg-card border border-border/60 rounded-xl p-3 hover:border-border transition-colors cursor-pointer shadow-sm">
                        <p className="text-[9px] text-muted-foreground mb-1 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-primary" /> Progress</p>
                        <p className="text-sm font-bold text-foreground">{req.progress}%</p>
                    </div>
                    <div className="bg-card border border-border/60 rounded-xl p-3 hover:border-border transition-colors cursor-pointer shadow-sm">
                        <p className="text-[9px] text-muted-foreground mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3 text-amber-400" /> Due Date</p>
                        <p className="text-sm font-bold text-foreground">{req.due}, 2026</p>
                    </div>
                    <div className="bg-card border border-border/60 rounded-xl p-3 hover:border-border transition-colors cursor-pointer shadow-sm">
                        <p className="text-[9px] text-muted-foreground mb-1 flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-emerald-400" /> Budget</p>
                        <p className="text-sm font-bold text-foreground">{req.amount}</p>
                    </div>
                    <div className="bg-card border border-border/60 rounded-xl p-3 hover:border-border transition-colors cursor-pointer shadow-sm">
                        <p className="text-[9px] text-muted-foreground mb-1 flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-muted-foreground" /> Spent</p>
                        <p className="text-sm font-bold text-foreground">{isEcommerce ? "$8,160" : "$0"}</p>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="bg-card border border-border/60 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold text-foreground">Overall Progress</p>
                        <p className="text-[10px] font-bold text-foreground">{req.progress}%</p>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${req.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-muted-foreground">
                        <span>Started Jan 15</span>
                        <span>Due {req.due}, 2026</span>
                    </div>
                </div>

                {/* Requests (Kanban) */}
                <div className="mt-6 mb-2 pt-2">
                    <h3 className="text-[13px] font-bold text-foreground mb-0.5">Requests</h3>
                    <p className="text-[9px] text-muted-foreground">Manage and track client tasks across your pipeline.</p>
                </div>

                {isEcommerce ? (
                    <div className="grid grid-cols-4 gap-3 overflow-x-auto pb-2">
                        {/* Backlog */}
                        <div className="space-y-2 min-w-[160px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold text-foreground/80 tracking-wider">BACKLOG</span>
                                    <span className="text-[8px] text-muted-foreground">3</span>
                                </div>
                                <button className="w-4 h-4 rounded hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors"><Plus className="w-2.5 h-2.5" /></button>
                            </div>
                            <div className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group">
                                <p className="text-[9px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors">Micro-interactions & animations</p>
                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-[6px] font-bold text-primary">JD</span></div>
                            </div>
                            <div className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group">
                                <p className="text-[9px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors">Developer handoff docs</p>
                                <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center"><span className="text-[6px] font-bold text-indigo-400">AS</span></div>
                            </div>
                            <div className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group">
                                <p className="text-[9px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors">Final client presentation</p>
                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-[6px] font-bold text-primary">JD</span></div>
                            </div>
                        </div>

                        {/* In Progress */}
                        <div className="space-y-2 min-w-[160px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold text-foreground/80 tracking-wider">IN PROGRESS</span>
                                    <span className="text-[8px] text-muted-foreground">2</span>
                                </div>
                                <button className="w-4 h-4 rounded hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors"><Plus className="w-2.5 h-2.5" /></button>
                            </div>
                            <div className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group">
                                <p className="text-[9px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors">Mobile responsive layouts</p>
                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-[6px] font-bold text-primary">JD</span></div>
                            </div>
                            <div className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group">
                                <p className="text-[9px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors">Design system components</p>
                                <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center"><span className="text-[6px] font-bold text-indigo-400">AS</span></div>
                            </div>
                        </div>

                        {/* In Review */}
                        <div className="space-y-2 min-w-[160px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold text-foreground/80 tracking-wider">IN REVIEW</span>
                                    <span className="text-[8px] text-muted-foreground">1</span>
                                </div>
                                <button className="w-4 h-4 rounded hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors"><Plus className="w-2.5 h-2.5" /></button>
                            </div>
                            <div className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group">
                                <p className="text-[9px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors">Cart & checkout flow</p>
                                <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center"><span className="text-[6px] font-bold text-indigo-400">AS</span></div>
                            </div>
                        </div>

                        {/* Completed */}
                        <div className="space-y-2 min-w-[160px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold text-emerald-400/80 tracking-wider">COMPLETED</span>
                                    <span className="text-[8px] text-muted-foreground">2</span>
                                </div>
                                <button className="w-4 h-4 rounded hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors"><Plus className="w-2.5 h-2.5" /></button>
                            </div>
                            <div className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group">
                                <p className="text-[9px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors">Homepage wireframes</p>
                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-[6px] font-bold text-primary">JD</span></div>
                            </div>
                            <div className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group">
                                <p className="text-[9px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors">Product page design</p>
                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-[6px] font-bold text-primary">JD</span></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 flex flex-col items-center justify-center text-center bg-card border border-border/50 rounded-xl">
                        <FolderKanban className="w-6 h-6 text-muted-foreground/30 mb-2" />
                        <h4 className="text-[10px] font-medium text-foreground/80 mb-1">No tasks yet</h4>
                        <p className="text-[8px] text-muted-foreground">This project doesn't have any board tasks.</p>
                    </div>
                )}

                {/* Lower Section: Files & Deliverables + Activity */}
                {isEcommerce && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {/* Files & Deliverables */}
                        <div className="bg-card border border-border/50 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[11px] font-bold text-foreground">Files & Deliverables</h3>
                                <button className="text-[8px] flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"><Upload className="w-2.5 h-2.5" /> Upload</button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 group hover:bg-accent/40 p-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border/50">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors"><File className="w-3.5 h-3.5 text-indigo-400" /></div>
                                    <div><p className="text-[9px] font-bold text-foreground group-hover:text-primary transition-colors">Homepage_v3.fig</p><p className="text-[7px] text-muted-foreground">24 MB · Feb 18</p></div>
                                </div>
                                <div className="flex items-center gap-2 group hover:bg-accent/40 p-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border/50">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors"><ImageIcon className="w-3.5 h-3.5 text-emerald-400" /></div>
                                    <div><p className="text-[9px] font-bold text-foreground group-hover:text-primary transition-colors">Product_Mockups.png</p><p className="text-[7px] text-muted-foreground">8.2 MB · Feb 15</p></div>
                                </div>
                                <div className="flex items-center gap-2 group hover:bg-accent/40 p-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border/50">
                                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors"><FileText className="w-3.5 h-3.5 text-rose-400" /></div>
                                    <div><p className="text-[9px] font-bold text-foreground group-hover:text-primary transition-colors">Checkout_Flow.pdf</p><p className="text-[7px] text-muted-foreground">3.1 MB · Feb 12</p></div>
                                </div>
                                <div className="flex items-center gap-2 group hover:bg-accent/40 p-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border/50">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors"><Paperclip className="w-3.5 h-3.5 text-amber-400" /></div>
                                    <div><p className="text-[9px] font-bold text-foreground group-hover:text-primary transition-colors">Brand_Assets.zip</p><p className="text-[7px] text-muted-foreground">45 MB · Feb 10</p></div>
                                </div>
                                <div className="flex items-center gap-2 group hover:bg-accent/40 p-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border/50">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors"><File className="w-3.5 h-3.5 text-indigo-400" /></div>
                                    <div><p className="text-[9px] font-bold text-foreground group-hover:text-primary transition-colors">Mobile_Screens.fig</p><p className="text-[7px] text-muted-foreground">18 MB · Feb 8</p></div>
                                </div>
                            </div>
                        </div>

                        {/* Activity */}
                        <div className="bg-card border border-border/50 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[11px] font-bold text-foreground">Activity</h3>
                                <button className="text-[8px] text-primary hover:text-primary/80 transition-colors">View all</button>
                            </div>
                            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-[1px] before:bg-border/50">
                                {[
                                    { i: Upload, color: 'text-primary', iconBg: 'bg-primary/10 border-primary/20', t: 'Uploaded revised homepage mockups', st: 'Jane Doe · 2h ago' },
                                    { i: CheckCircle2, color: 'text-emerald-400', iconBg: 'bg-emerald-400/10 border-emerald-400/20', t: 'Approved checkout flow designs', st: 'Client (Vertex Labs) · 5h ago' },
                                    { i: MessageSquare, color: 'text-blue-400', iconBg: 'bg-blue-400/10 border-blue-400/20', t: 'Added comments on product page', st: 'Alex Smith · 1d ago' },
                                    { i: CheckCircle2, color: 'text-emerald-400', iconBg: 'bg-emerald-400/10 border-emerald-400/20', t: 'Completed cart & checkout flow', st: 'Alex Smith · 2d ago' },
                                    { i: AlertCircle, color: 'text-amber-400', iconBg: 'bg-amber-400/10 border-amber-400/20', t: 'Milestone: Mobile designs started', st: 'Jane Doe · 3d ago' },
                                    { i: DollarSign, color: 'text-muted-foreground', iconBg: 'bg-muted border-border', t: 'Invoice INV-087 sent', st: 'System · 5d ago' },
                                ].map((act, idx) => (
                                    <div key={idx} className="relative flex items-center group cursor-pointer pl-6">
                                        <div className="absolute left-0 w-5 h-5 rounded-full border bg-card flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${act.iconBg}`}><act.i className={`w-2.5 h-2.5 ${act.color}`} /></div>
                                        </div>
                                        <div className="py-0.5 px-2 -ml-2 rounded border border-transparent group-hover:bg-accent/30 group-hover:border-border/50 transition-colors">
                                            <p className="text-[9px] font-bold text-foreground group-hover:text-primary transition-colors">{act.t}</p>
                                            <p className="text-[7px] text-muted-foreground">{act.st}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Linked Invoices */}
                {isEcommerce && (
                    <div className="bg-card border border-border/50 rounded-xl p-3 mt-3 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[11px] font-bold text-foreground">Linked Invoices</h3>
                            <span className="text-[8px] text-muted-foreground">3 invoices</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between p-2 hover:bg-accent/40 rounded-lg cursor-pointer transition-colors group">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-border/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors"><DollarSign className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" /></div>
                                    <div><p className="text-[9px] font-bold text-foreground group-hover:text-primary transition-colors">INV-087</p><p className="text-[7px] text-muted-foreground">Feb 20</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-bold text-foreground">$4,800</span>
                                    <span className="text-[6px] font-semibold px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">Paid</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-accent/40 rounded-lg cursor-pointer transition-colors group">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-border/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors"><DollarSign className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" /></div>
                                    <div><p className="text-[9px] font-bold text-foreground group-hover:text-primary transition-colors">INV-079</p><p className="text-[7px] text-muted-foreground">Jan 15</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-bold text-foreground">$4,800</span>
                                    <span className="text-[6px] font-semibold px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">Paid</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
                <div><p className="text-sm font-bold text-foreground">Requests</p><p className="text-[10px] text-muted-foreground">{requests.length} total requests</p></div>
                <button
                    onClick={() => {
                        const btn = document.activeElement as HTMLElement;
                        btn?.blur();
                    }}
                    className="flex items-center gap-1 bg-primary text-white text-[9px] font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                ><Plus className="w-3 h-3" /> New Project</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {requests.map((r, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setClickedReq(i);
                            setTimeout(() => {
                                setClickedReq(null);
                                setViewingReq(i);
                            }, 150);
                        }}
                        className={`bg-card border border-border rounded-xl p-3 transition-all cursor-pointer group ${clickedReq === i ? 'scale-95 bg-accent ring-1 ring-primary' : 'hover:border-primary/40 hover:shadow-md'}`}
                    >
                        <div className="flex items-start gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors"><FolderKanban className="w-3 h-3 text-primary" /></div>
                            <div className="min-w-0"><p className="text-[10px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{r.title}</p><p className="text-[7px] text-muted-foreground">{r.client}</p></div>
                        </div>
                        <span className={`text-[7px] font-medium px-1.5 py-0.5 rounded ${r.color}`}>{r.status}</span>
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-1"><span className="text-[7px] text-muted-foreground">Progress</span><span className="text-[7px] font-medium text-foreground/70">{r.progress}%</span></div>
                            <div className="h-1 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all group-hover:bg-primary/80" style={{ width: `${r.progress}%` }} /></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[7px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-2.5 h-2.5 group-hover:animate-pulse" /> Due {r.due}</span>
                            <span className="text-[8px] font-semibold text-foreground/70">{r.amount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CommunicationsView() {
    const [selectedClient, setSelectedClient] = useState<number | null>(null);
    const [expandedClient, setExpandedClient] = useState<number | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const selected = selectedClient !== null ? commClients[selectedClient] : null;

    return (
        <div className="space-y-3">
            <div><p className="text-sm font-bold text-foreground">Communications</p><p className="text-[10px] text-muted-foreground">4 unread messages</p></div>
            <div className="grid grid-cols-5 gap-2 h-[280px]">
                <div className="col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-border">
                        <div className="flex items-center gap-1.5 bg-accent border border-border rounded-lg px-2 py-1"><Search className="w-3 h-3 text-muted-foreground/50" /><span className="text-[8px] text-muted-foreground/50">Search clients...</span></div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {commClients.map((c, i) => (
                            <div key={i}>
                                <button onClick={() => { setSelectedClient(i); setExpandedClient(expandedClient === i ? null : i); }} className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-accent/50 transition-colors text-left ${selectedClient === i ? "bg-accent/80" : ""}`}>
                                    <div className={`w-7 h-7 rounded-lg ${c.color} flex items-center justify-center shrink-0`}><span className="text-[8px] font-bold text-white">{c.initials}</span></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between"><p className="text-[9px] font-semibold text-foreground">{c.name}</p><span className="text-[7px] text-muted-foreground/60">{c.time}</span></div>
                                        <p className="text-[7px] text-muted-foreground truncate">{c.preview}</p>
                                    </div>
                                    {c.unread > 0 && <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0"><span className="text-[7px] font-bold text-white">{c.unread}</span></div>}
                                </button>
                                {expandedClient === i && c.projects && (
                                    <div className="px-4 pb-2 space-y-1">
                                        {c.projects.map((p, j) => (
                                            <div
                                                key={j}
                                                onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                                                className={`flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent/50 cursor-pointer ${selectedProject === p ? 'bg-accent border border-border/50' : ''}`}
                                            >
                                                <div className="flex items-center gap-1.5"><FolderKanban className="w-2.5 h-2.5 text-muted-foreground" /><span className="text-[8px] text-muted-foreground">{p}</span></div>
                                                {j < 2 && <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center"><span className="text-[6px] font-bold text-white">{j === 0 ? 2 : 1}</span></div>}
                                                <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/40" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-3 bg-card border border-border rounded-xl flex flex-col overflow-hidden relative">
                    {selected && selectedProject ? (
                        <div className="absolute inset-0 flex flex-col animate-in fade-in duration-200">
                            {/* Chat Header */}
                            <div className="p-3 border-b border-border flex items-center justify-between bg-card shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-lg ${selected.color} flex items-center justify-center`}><span className="text-[8px] font-bold text-white">{selected.initials}</span></div>
                                    <div><p className="text-[10px] font-bold text-foreground">{selected.name}</p><p className="text-[8px] text-muted-foreground">{selectedProject}</p></div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="w-6 h-6 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors"><search className="w-3 h-3" /></button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/10">
                                <div className="flex justify-center"><span className="text-[7px] font-medium text-muted-foreground bg-accent/50 px-2 py-0.5 rounded-full">Today, 9:41 AM</span></div>

                                {/* Client Message */}
                                <div className="flex items-end gap-1.5">
                                    <div className={`w-5 h-5 rounded-full ${selected.color} flex items-center justify-center shrink-0 mb-0.5`}><span className="text-[6px] font-bold text-white">{selected.initials}</span></div>
                                    <div className="bg-card border border-border/60 rounded-2xl rounded-bl-sm p-2.5 max-w-[85%] shadow-sm">
                                        <p className="text-[9px] text-foreground leading-relaxed">Hey! Just checking in on the progress for the {selectedProject}. Are we still on track for Friday's review?</p>
                                    </div>
                                </div>

                                {/* Client Message 2 */}
                                <div className="flex flex-col items-start gap-1.5 pl-6.5">
                                    <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm p-2.5 max-w-[85%] shadow-sm">
                                        <p className="text-[9px] text-foreground leading-relaxed">Also, I attached the new brand assets you requested.</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-card border border-border/60 p-1.5 rounded-lg cursor-pointer hover:border-primary/30 transition-colors shadow-sm w-36">
                                        <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center border border-amber-500/20"><Paperclip className="w-3 h-3 text-amber-500" /></div>
                                        <div className="min-w-0"><p className="text-[8px] font-medium text-foreground truncate">brand-assets.zip</p><p className="text-[6px] text-muted-foreground">12.4 MB</p></div>
                                    </div>
                                    <span className="text-[6px] text-muted-foreground ml-1">9:43 AM</span>
                                </div>

                                {/* Agency Message */}
                                <div className="flex items-end justify-end gap-1.5 mt-4">
                                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm p-2.5 max-w-[85%] shadow-sm">
                                        <p className="text-[9px] leading-relaxed text-white">Hi! Yes, everything is right on schedule. I've received the assets and we're integrating them now. I'll send over the preview link by Thursday evening!</p>
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mb-0.5"><span className="text-[6px] font-bold text-primary">JD</span></div>
                                </div>
                                <div className="flex justify-end"><span className="text-[6px] text-muted-foreground mr-7">Just now · Read</span></div>
                            </div>

                            {/* Input Area */}
                            <div className="p-2 border-t border-border bg-card shrink-0">
                                <div className="flex items-center gap-1.5 bg-accent/50 border border-border rounded-xl pr-1.5 pl-3 py-1.5 focus-within:ring-1 focus-within:border-primary transition-all">
                                    <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent text-[9px] text-foreground outline-none placeholder:text-muted-foreground/50" />
                                    <button className="w-6 h-6 rounded-lg hover:bg-accent border border-transparent flex items-center justify-center text-muted-foreground transition-colors"><Paperclip className="w-3 h-3" /></button>
                                    <button className="w-6 h-6 rounded-lg bg-primary hover:bg-primary/90 flex items-center justify-center text-white transition-colors shadow-sm"><span className="text-[8px] font-bold tracking-tight px-1">Send</span></button>
                                </div>
                            </div>
                        </div>
                    ) : selected ? (
                        <div className="text-center p-4">
                            <div className={`w-10 h-10 rounded-xl ${commClients[selectedClient!].color} flex items-center justify-center mx-auto mb-2`}><span className="text-sm font-bold text-white">{commClients[selectedClient!].initials}</span></div>
                            <p className="text-xs font-semibold text-foreground">{selected.name}</p>
                            <p className="text-[9px] text-muted-foreground mt-1">Select a project to view messages</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                            <p className="text-[10px] font-medium text-muted-foreground">Select a client & project</p>
                            <p className="text-[8px] text-muted-foreground/60">Choose a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ClientsView() {
    const [clickedClient, setClickedClient] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div><p className="text-sm font-bold text-foreground">Clients</p><p className="text-[10px] text-muted-foreground">{clients.length} total clients</p></div>
                <button
                    onClick={() => {
                        const btn = document.activeElement as HTMLElement;
                        btn?.blur();
                    }}
                    className="flex items-center gap-1 bg-primary text-white text-[9px] font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                ><Plus className="w-3 h-3" /> Add Client</button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[8px] font-semibold text-muted-foreground border-b border-border">
                    <div className="col-span-3">Client</div><div className="col-span-3">Email</div><div className="col-span-2 text-center">Projects</div><div className="col-span-2 text-right">Total Spent</div><div className="col-span-2 text-right">Status</div>
                </div>
                {clients.map((c, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setClickedClient(i);
                            setTimeout(() => setClickedClient(null), 300);
                        }}
                        className={`grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-accent/50 transition-all cursor-pointer border-b border-border/50 last:border-0 ${clickedClient === i ? 'bg-accent scale-[0.99]' : ''}`}
                    >
                        <div className="col-span-3 flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg ${c.color} flex items-center justify-center shrink-0 transition-transform ${clickedClient === i ? 'scale-110' : ''}`}><span className="text-[7px] font-bold text-white">{c.initials}</span></div>
                            <span className="text-[9px] font-medium text-foreground truncate">{c.name}</span>
                        </div>
                        <div className="col-span-3 text-[8px] text-muted-foreground truncate">{c.email}</div>
                        <div className="col-span-2 text-[9px] text-foreground/70 text-center">{c.projects}</div>
                        <div className="col-span-2 text-[9px] font-medium text-foreground/80 text-right">{c.spent}</div>
                        <div className="col-span-2 text-right">
                            <span className={`text-[7px] font-medium px-1.5 py-0.5 rounded transition-colors ${c.status === "Active" ? "text-emerald-400 bg-emerald-400/10" : c.status === "New" ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted"} ${clickedClient === i ? 'opacity-70' : ''}`}>{c.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ServicesView() {
    const [clickedService, setClickedService] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div><p className="text-sm font-bold text-foreground">Services</p><p className="text-[10px] text-muted-foreground">Manage your service catalog and pricing.</p></div>
                <button
                    onClick={() => {
                        const btn = document.activeElement as HTMLElement;
                        btn?.blur();
                    }}
                    className="flex items-center gap-1 bg-primary text-white text-[9px] font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                ><Plus className="w-3 h-3" /> New Service</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-card border border-border rounded-xl p-3 text-center transition-all hover:border-primary/20">
                    <Package className="w-5 h-5 text-primary mx-auto mb-1 transition-transform hover:scale-110 cursor-pointer" />
                    <p className="text-lg font-bold text-foreground">5</p>
                    <p className="text-[8px] text-muted-foreground">Active Services</p>
                    <p className="text-[7px] text-muted-foreground/60">6 total</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-3 text-center transition-all hover:border-amber-400/30">
                    <DollarSign className="w-5 h-5 text-amber-400 mx-auto mb-1 transition-transform hover:scale-110 cursor-pointer" />
                    <p className="text-lg font-bold text-foreground">$11,000</p>
                    <p className="text-[8px] text-muted-foreground">Monthly Revenue</p>
                    <p className="text-[7px] text-muted-foreground/60">from retainers</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-3 text-center transition-all hover:border-emerald-400/30">
                    <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1 transition-transform hover:scale-110 cursor-pointer" />
                    <p className="text-lg font-bold text-foreground">6</p>
                    <p className="text-[8px] text-muted-foreground">Active Subscriptions</p>
                    <p className="text-[7px] text-muted-foreground/60">clients on retainers</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {services.map((s, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setClickedService(i);
                            setTimeout(() => setClickedService(null), 300);
                        }}
                        className={`bg-card border border-border rounded-xl p-3 transition-all cursor-pointer flex flex-col group ${clickedService === i ? 'scale-95 bg-accent ring-1 ring-primary' : 'hover:border-primary/40 hover:shadow-md'}`}
                    >
                        <div className="flex items-start gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors"><Package className="w-3 h-3 text-primary" /></div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{s.name}</p>
                                <span className={`text-[7px] font-medium px-1 py-0 rounded ${s.status === "Active" ? "text-emerald-400 bg-emerald-400/10" : "text-muted-foreground bg-muted"}`}>{s.status}</span>
                            </div>
                        </div>
                        <p className="text-[7px] text-muted-foreground leading-relaxed mb-2 flex-1">{s.desc}</p>
                        <p className="text-xs font-bold text-foreground mb-1.5">{s.price} <span className="text-[7px] font-normal text-muted-foreground">{s.period}</span></p>
                        <div className="space-y-0.5 mb-2">{s.features.map((f, j) => <p key={j} className="text-[7px] text-muted-foreground">· {f}</p>)}</div>
                        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                            <span className="text-[7px] text-muted-foreground flex items-center gap-0.5"><Users className="w-2.5 h-2.5 inline group-hover:text-primary transition-colors" />{s.active} active</span>
                            <span className="text-[7px] text-emerald-400 cursor-pointer hover:text-emerald-300 font-medium tracking-wide">✏️ Edit</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BillingView() {
    const [clickedInvoice, setClickedInvoice] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div><p className="text-sm font-bold text-foreground">Billing & Subscriptions</p><p className="text-[10px] text-muted-foreground">Manage your client subscriptions and revenue.</p></div>
                <button
                    onClick={() => {
                        const btn = document.activeElement as HTMLElement;
                        btn?.blur();
                    }}
                    className="flex items-center gap-1 bg-primary text-white text-[9px] font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                ><Plus className="w-3 h-3" /> Create Invoice</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-card border border-border rounded-xl p-3 transition-all cursor-pointer hover:border-amber-400/50 hover:bg-accent/30"><p className="text-[8px] text-muted-foreground">Total Outstanding</p><p className="text-lg font-bold text-amber-400">$11,050</p><p className="text-[7px] text-muted-foreground/60">3 invoices</p></div>
                <div className="bg-card border border-border rounded-xl p-3 transition-all cursor-pointer hover:border-emerald-400/50 hover:bg-accent/30"><p className="text-[8px] text-muted-foreground">Paid This Month</p><p className="text-lg font-bold text-emerald-400">$22,750</p><p className="text-[7px] text-muted-foreground/60">4 invoices</p></div>
                <div className="bg-card border border-border rounded-xl p-3 transition-all cursor-pointer hover:border-rose-400/50 hover:bg-accent/30"><p className="text-[8px] text-muted-foreground">Overdue</p><p className="text-lg font-bold text-rose-400">$3,200</p><p className="text-[7px] text-muted-foreground/60">1 invoice</p></div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[8px] font-semibold text-muted-foreground border-b border-border">
                    <div className="col-span-2">Invoice</div><div className="col-span-2">Client</div><div className="col-span-3">Project</div><div className="col-span-2 text-right">Amount</div><div className="col-span-2 text-center">Status</div><div className="col-span-1 text-right">Due</div>
                </div>
                {invoices.map((inv, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setClickedInvoice(i);
                            setTimeout(() => setClickedInvoice(null), 300);
                        }}
                        className={`grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-accent/80 transition-all cursor-pointer border-b border-border/50 last:border-0 ${clickedInvoice === i ? 'bg-accent scale-[0.99]' : ''}`}
                    >
                        <div className="col-span-2 text-[9px] font-medium text-foreground transition-colors group-hover:text-primary">{inv.id}</div>
                        <div className="col-span-2 text-[8px] text-muted-foreground truncate">{inv.client}</div>
                        <div className="col-span-3 text-[8px] text-muted-foreground truncate">{inv.project}</div>
                        <div className="col-span-2 text-[9px] font-medium text-foreground/80 text-right">{inv.amount}</div>
                        <div className="col-span-2 text-center"><span className={`text-[7px] font-medium px-1.5 py-0.5 rounded transition-transform duration-200 ${inv.statusColor} ${clickedInvoice === i ? 'scale-110 shadow-sm' : ''}`}>{inv.status}</span></div>
                        <div className="col-span-1 text-[8px] text-muted-foreground text-right truncate">{inv.due === '—' ? '—' : inv.due.split(',')[0]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SettingsView() {
    const [clickedSetting, setClickedSetting] = useState<number | null>(null);

    return (
        <div className="space-y-3 max-w-lg">
            <div><p className="text-sm font-bold text-foreground">Settings</p><p className="text-[10px] text-muted-foreground">Manage your account and preferences</p></div>
            <div className="space-y-1.5">
                {settingsItems.map((s, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setClickedSetting(i);
                            setTimeout(() => setClickedSetting(null), 300);
                        }}
                        className={`bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-accent/50 hover:border-primary/40 transition-all cursor-pointer group ${clickedSetting === i ? 'scale-[0.98] bg-accent ring-1 ring-primary/50' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors"><s.icon className="w-4 h-4 text-primary" /></div>
                        <div className="flex-1 min-w-0"><p className="text-[10px] font-semibold text-foreground group-hover:text-primary transition-colors">{s.label}</p><p className="text-[8px] text-muted-foreground">{s.sub}</p></div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ApiGatewayView() {
    const [generating, setGenerating] = useState(false);
    const [key, setKey] = useState<string | null>(null);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setKey("sk_gw_9x8c...4fj2");
            setGenerating(false);
        }, 800);
    };

    return (
        <div className="space-y-4 max-w-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-bold text-foreground">API Gateway</h2>
                    <p className="text-[10px] text-muted-foreground">Manage your AI upstream endpoints and issue keys.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[9px] font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Gateway Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><Server className="w-4 h-4 text-emerald-500" /></div>
                        <div>
                            <p className="text-[11px] font-bold text-foreground">OpenAI</p>
                            <p className="text-[8px] text-muted-foreground">Connected • GPT-4o, o3-mini</p>
                        </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground/80 leading-relaxed mb-3">Your agency OpenAI key is securely vaulted here. Ready to proxy requests.</p>
                    <button className="text-[9px] font-medium text-emerald-500 hover:text-emerald-400 transition-colors">Manage Credentials →</button>
                </div>

                <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold text-foreground">Client Keys</p>
                        <Key className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-[9px] text-muted-foreground mb-3">Issue rate-limited keys tied to specific clients.</p>

                    {key ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-accent/50 border border-border rounded-lg px-3 py-2">
                                <code className="text-[10px] font-mono text-primary font-bold">{key}</code>
                                <span className="text-[8px] font-semibold text-emerald-500 px-1.5 py-0.5 rounded bg-emerald-500/10">Active</span>
                            </div>
                            <p className="text-[7px] text-muted-foreground text-center animate-pulse">Requesting via proxy enabled</p>
                        </div>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 transition-all rounded-lg py-1.5 text-[9px] font-bold"
                        >
                            {generating ? <Activity className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                            {generating ? "Generating..." : "Generate New Key"}
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-[10px] font-bold text-foreground">Live Inference Usage</p>
                        <p className="text-[8px] text-muted-foreground">Tracking upstream proxy requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col text-right">
                            <span className="text-[11px] font-bold text-emerald-500">+$28.40</span>
                            <span className="text-[7px] text-muted-foreground">Profit Generated</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-1 mt-2">
                    <div className="grid grid-cols-4 px-2 py-1 text-[7px] font-semibold text-muted-foreground border-b border-border/50">
                        <div className="col-span-1">Client Key</div>
                        <div className="col-span-1">Model</div>
                        <div className="col-span-1 text-right">Tokens</div>
                        <div className="col-span-1 text-right">Latency</div>
                    </div>
                    {[
                        { k: "ext_crm_bot", m: "gpt-4o", t: "1,240", l: "840ms", c: "text-emerald-500" },
                        { k: "support_agent", m: "claude-3", t: "890", l: "1250ms", c: "text-emerald-500" },
                        { k: "ext_crm_bot", m: "gpt-4o", t: "4,100", l: "2100ms", c: "text-emerald-500" },
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-4 px-2 py-1.5 items-center hover:bg-accent/40 rounded transition-colors group cursor-pointer">
                            <div className="col-span-1 text-[8px] font-medium text-foreground">{row.k}</div>
                            <div className="col-span-1 text-[8px] text-muted-foreground font-mono">{row.m}</div>
                            <div className="col-span-1 text-[8px] text-muted-foreground text-right">{row.t}</div>
                            <div className={`col-span-1 text-[8px] ${row.c} text-right`}>{row.l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function InteractiveDemoMockup() {
    const [activeTab, setActiveTab] = useState("overview");

    const renderView = () => {
        switch (activeTab) {
            case "overview": return <OverviewView onNav={setActiveTab} />;
            case "requests": return <RequestsView />;
            case "communications": return <CommunicationsView />;
            case "clients": return <ClientsView />;
            case "services": return <ServicesView />;
            case "billing": return <BillingView />;
            case "settings": return <SettingsView />;
            case "api-gateway": return <ApiGatewayView />;
            default: return <OverviewView onNav={setActiveTab} />;
        }
    };

    return (
        <div className="bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden">
            {/* Window chrome */}
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

            <div className="flex min-h-[500px]">
                {/* Sidebar */}
                <div className="hidden sm:flex w-40 border-r border-border bg-muted/20 flex-col">
                    <div className="px-3 py-3 border-b border-border">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <Image src="/logo.png" alt="OP" width={22} height={22} className="rounded-md object-contain transition-transform group-hover:scale-110" />
                            <span className="text-[10px] font-bold text-foreground group-hover:text-primary transition-colors">Origins Pillar</span>
                        </div>
                    </div>

                    <div className="p-2 flex-1 space-y-0.5">
                        {sidebarLinks.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[10px] font-medium transition-all text-left active:scale-95 ${activeTab === item.id
                                    ? "bg-primary/10 text-primary border border-primary/15 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
                                    }`}
                            >
                                <item.icon className="w-3.5 h-3.5" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && item.badge > 0 && (
                                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                        <span className="text-[7px] font-bold text-white">{item.badge}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-2 border-t border-border">
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                <span className="text-[8px] font-bold text-primary">JD</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-semibold text-foreground group-hover:text-primary transition-colors">Jane Doe</p>
                                <p className="text-[7px] text-muted-foreground">Admin</p>
                            </div>
                            <LogOut className="w-3 h-3 text-muted-foreground/40 group-hover:text-destructive transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                        <div
                            className="flex items-center gap-1.5 bg-accent border border-border rounded-lg px-2.5 py-1.5 w-52 cursor-pointer transition-all hover:bg-accent/80 hover:border-primary/30 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary group"
                            onClick={() => {
                                const el = document.getElementById('mockup-search');
                                el?.focus();
                            }}
                        >
                            <Search className="w-3 h-3 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                            <input
                                id="mockup-search"
                                type="text"
                                placeholder="Search anything..."
                                className="bg-transparent text-[9px] text-foreground w-full outline-none placeholder:text-muted-foreground/50"
                                autoComplete="off"
                            />
                        </div>
                        <div className="relative w-7 h-7 rounded-lg bg-accent border border-border flex items-center justify-center cursor-pointer hover:bg-accent/80 transition-all hover:border-primary/30 group active:scale-95">
                            <Bell className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors group-hover:animate-pulse" />
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
                        </div>
                    </div>

                    {/* Page content */}
                    <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
                        {renderView()}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import {
    BarChart3, FolderKanban, Users, DollarSign, Settings, Search,
    Package, MessageSquare, Bell, ChevronRight, TrendingUp, CheckCircle2,
    Clock, Star, Key, Plus, User, Palette, Shield, CreditCard,
    BellRing, Building2, LogOut
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
                <div className="flex items-end gap-1 h-[70px]">
                    {revenueData.map((h, i) => {
                        const pct = (h / maxVal) * 100;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 hover:bg-accent/50 rounded-md transition-colors p-0.5">
                                <div className={`w-full rounded-sm transition-all hover:scale-x-110 ${i >= 10 ? "bg-gradient-to-t from-primary to-primary/60" : i >= 8 ? "bg-primary/35" : "bg-muted"}`} style={{ height: `${pct}%` }} />
                                <span className="text-[6px] text-muted-foreground">{months[i]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function RequestsView() {
    const [clickedReq, setClickedReq] = useState<number | null>(null);

    return (
        <div className="space-y-3">
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
                            setTimeout(() => setClickedReq(null), 300);
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
                                            <div key={j} className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent/50 cursor-pointer">
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
                <div className="col-span-3 bg-card border border-border rounded-xl flex items-center justify-center">
                    {selected ? (
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

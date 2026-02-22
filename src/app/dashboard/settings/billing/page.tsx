import Link from "next/link";
import { ArrowLeft, CreditCard, Check, DollarSign, Download } from "lucide-react";

export const dynamic = "force-dynamic";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-card backdrop-blur-md border border-border rounded-2xl ${className}`}>
        {children}
    </div>
);

const plans = [
    { name: "Starter", price: "$0", period: "/mo", features: ["3 projects", "2 clients", "Basic invoicing"], current: false },
    { name: "Pro", price: "$29", period: "/mo", features: ["Unlimited projects", "Unlimited clients", "Advanced invoicing", "File storage", "Priority support"], current: true },
    { name: "Agency", price: "$79", period: "/mo", features: ["Everything in Pro", "Team members", "White-label", "API access", "Custom branding"], current: false },
];

const invoiceHistory = [
    { id: "INV-2026-02", date: "Feb 1, 2026", amount: "$29.00", status: "Paid" },
    { id: "INV-2026-01", date: "Jan 1, 2026", amount: "$29.00", status: "Paid" },
    { id: "INV-2025-12", date: "Dec 1, 2025", amount: "$29.00", status: "Paid" },
];

export default function BillingSettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 hover:text-foreground/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Billing</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your plan, payment methods, and billing history</p>
            </div>

            {/* Plans */}
            <div>
                <h2 className="text-sm font-semibold text-foreground/70 mb-3">Current Plan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {plans.map((p) => (
                        <GlassCard key={p.name} className={`p-5 ${p.current ? "border-primary/30 bg-primary/[0.06]" : ""}`}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-foreground/80">{p.name}</h3>
                                {p.current && <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-primary bg-primary/10">Current</span>}
                            </div>
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-foreground">{p.price}</span>
                                <span className="text-sm text-muted-foreground/70">{p.period}</span>
                            </div>
                            <ul className="space-y-2 mb-4">
                                {p.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-white/55">
                                        <Check className="w-3 h-3 text-primary" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            {!p.current && (
                                <button className="w-full text-xs font-medium py-2 rounded-lg border border-border text-white/60 hover:bg-accent transition-all">
                                    {p.price === "$0" ? "Downgrade" : "Upgrade"}
                                </button>
                            )}
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Payment Method */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-semibold text-foreground/70">Payment Method</h2>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80 transition-colors">Update</button>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-accent/50 border border-border/60">
                    <div className="w-10 h-7 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white tracking-wider">VISA</span>
                    </div>
                    <div>
                        <p className="text-sm text-foreground/70">**** **** **** 4242</p>
                        <p className="text-xs text-muted-foreground/60">Expires 08/2027</p>
                    </div>
                </div>
            </GlassCard>

            {/* Billing History */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-foreground/70 mb-4">Billing History</h2>
                <div className="space-y-2">
                    {invoiceHistory.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-4 h-4 text-muted-foreground/50" />
                                <div>
                                    <p className="text-sm text-foreground/70">{inv.id}</p>
                                    <p className="text-xs text-muted-foreground/60">{inv.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-foreground/70">{inv.amount}</span>
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-emerald-400 bg-emerald-400/10">{inv.status}</span>
                                <Download className="w-3.5 h-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer" />
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}

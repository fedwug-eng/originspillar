import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Download } from "lucide-react";

export const dynamic = "force-dynamic";

const plans = [
    {
        name: "Starter",
        price: "$0",
        period: "/mo",
        features: ["1 team member", "5 active projects", "Basic analytics", "Email support"],
    },
    {
        name: "Pro",
        price: "$29",
        period: "/mo",
        features: ["5 team members", "Unlimited projects", "Advanced analytics", "Priority support", "API access"],
        current: true,
    },
    {
        name: "Agency",
        price: "$79",
        period: "/mo",
        features: ["Unlimited team", "Unlimited projects", "Custom branding", "Dedicated support", "API access", "White-label portal"],
    },
];

const billingHistory = [
    { date: "Feb 1, 2026", amount: "$29.00", status: "Paid" },
    { date: "Jan 1, 2026", amount: "$29.00", status: "Paid" },
    { date: "Dec 1, 2025", amount: "$29.00", status: "Paid" },
];

export default async function BillingSettingsPage() {
    const workspace = await currentWorkspace();
    if (!workspace) return redirect("/sign-in");

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="text-xs text-dash-muted hover:text-primary transition-colors flex items-center gap-1 mb-3">
                    <ArrowLeft className="w-3 h-3" /> Back to Settings
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-dash-text">Billing</h2>
                <p className="text-dash-muted mt-1">Your Originspillar plan and payment details.</p>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-4">
                {plans.map(plan => (
                    <div key={plan.name} className={`bg-dash-card backdrop-blur-md border rounded-2xl p-5 transition-all ${plan.current ? "border-primary/30 bg-primary/[0.06]" : "border-dash-border hover:border-white/[0.12]"}`}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-dash-text">{plan.name}</h3>
                            {plan.current && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">Current</span>}
                        </div>
                        <div className="flex items-baseline gap-0.5 mb-4">
                            <span className="text-2xl font-extrabold text-dash-text">{plan.price}</span>
                            <span className="text-xs text-dash-muted">{plan.period}</span>
                        </div>
                        <div className="space-y-2 mb-5">
                            {plan.features.map(f => (
                                <div key={f} className="flex items-center gap-2 text-xs text-dash-muted">
                                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                        {!plan.current && (
                            <button className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-dash-text transition-all border border-white/[0.06]">
                                {plan.price === "$0" ? "Downgrade" : "Upgrade"}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Payment Method */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white tracking-wider">VISA</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-dash-text">•••• •••• •••• 4242</p>
                            <p className="text-xs text-dash-muted mt-0.5">Expires 08/2027</p>
                        </div>
                    </div>
                    <button className="text-sm font-semibold text-primary hover:underline">Update</button>
                </div>
            </div>

            {/* Billing History */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-dash-text mb-4">Billing History</h3>
                <div className="space-y-2">
                    {billingHistory.map((entry, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                            <div>
                                <p className="text-sm font-medium text-dash-text">{entry.amount}</p>
                                <p className="text-xs text-dash-muted mt-0.5">{entry.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400">{entry.status}</span>
                                <button className="text-dash-muted hover:text-white transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

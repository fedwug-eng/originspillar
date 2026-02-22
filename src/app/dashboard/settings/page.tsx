import Link from "next/link";
import { User, Building2, Bell, Palette, Shield, CreditCard, Key, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const settingsSections = [
    { href: "/dashboard/settings/profile", label: "Profile", desc: "Your personal information and preferences", icon: User, color: "text-primary", bg: "bg-primary/10" },
    { href: "/dashboard/settings/agency", label: "Agency", desc: "Company details and branding", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { href: "/dashboard/settings/notifications", label: "Notifications", desc: "Email and in-app notification preferences", icon: Bell, color: "text-amber-400", bg: "bg-amber-400/10" },
    { href: "/dashboard/settings/appearance", label: "Appearance", desc: "Theme and display settings", icon: Palette, color: "text-pink-400", bg: "bg-pink-400/10" },
    { href: "/dashboard/settings/security", label: "Security", desc: "Password, 2FA, and active sessions", icon: Shield, color: "text-rose-400", bg: "bg-rose-400/10" },
    { href: "/dashboard/settings/billing", label: "Billing", desc: "Your Originspillar plan and payment method", icon: CreditCard, color: "text-sky-400", bg: "bg-sky-400/10" },
    { href: "/dashboard/settings/api-keys", label: "API Keys", desc: "Manage integrations and platform access tokens", icon: Key, color: "text-orange-400", bg: "bg-orange-400/10" },
];

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-dash-text">Settings</h2>
                <p className="text-dash-muted mt-1">Manage your account and workspace preferences.</p>
            </div>

            <div className="space-y-2">
                {settingsSections.map((section) => (
                    <Link
                        key={section.href}
                        href={section.href}
                        className="flex items-center gap-4 bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-5 hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-300 group"
                    >
                        <div className={`w-11 h-11 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
                            <section.icon className={`w-5 h-5 ${section.color}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-dash-text">{section.label}</p>
                            <p className="text-xs text-dash-muted mt-0.5">{section.desc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-dash-muted/40 group-hover:text-primary transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
}

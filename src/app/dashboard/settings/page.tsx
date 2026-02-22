import { User, Building, Bell, Palette, Shield, CreditCard, Key } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const sections = [
    { label: "Profile", icon: User, description: "Update your personal info and avatar", path: "profile" },
    { label: "Agency", icon: Building, description: "Company name, logo, and branding", path: "agency" },
    { label: "Notifications", icon: Bell, description: "Email and in-app notification preferences", path: "notifications" },
    { label: "Appearance", icon: Palette, description: "Theme, colors, and display settings", path: "appearance" },
    { label: "Security", icon: Shield, description: "Password, 2FA, and session management", path: "security" },
    { label: "Billing", icon: CreditCard, description: "Plan, payment methods, and invoices", path: "billing" },
    { label: "API Keys", icon: Key, description: "Manage API keys and third-party integrations", path: "api-keys" },
];

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-white/90">Settings</h1>
                <p className="text-sm text-white/50 mt-1">Manage your account and preferences</p>
            </div>

            <div className="space-y-3">
                {sections.map((s, i) => (
                    <Link
                        href={`/dashboard/settings/${s.path}`}
                        key={i}
                        className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.07] hover:-translate-y-[2px] hover:shadow-xl hover:shadow-primary/[0.06] hover:border-white/[0.1] transition-all duration-300 ease-out cursor-pointer group block"
                    >
                        <div className="w-11 h-11 rounded-xl bg-primary/12 flex items-center justify-center border border-primary/8 group-hover:bg-primary/20 transition-colors">
                            <s.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{s.label}</h3>
                            <p className="text-xs text-white/45">{s.description}</p>
                        </div>
                        <svg className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                ))}
            </div>
        </div>
    );
}

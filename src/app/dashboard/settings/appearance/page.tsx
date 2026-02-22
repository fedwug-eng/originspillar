import Link from "next/link";
import { ArrowLeft, Sun, Moon, Monitor } from "lucide-react";

export const dynamic = "force-dynamic";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

const themes = [
    { label: "Light", icon: Sun, active: false },
    { label: "Dark", icon: Moon, active: true },
    { label: "System", icon: Monitor, active: false },
];

const accentColors = [
    { name: "Purple", color: "bg-violet-500" },
    { name: "Blue", color: "bg-blue-500" },
    { name: "Green", color: "bg-emerald-500" },
    { name: "Orange", color: "bg-orange-500" },
    { name: "Rose", color: "bg-rose-500" },
    { name: "Cyan", color: "bg-cyan-500" },
];

export default function AppearanceSettingsPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <h1 className="text-2xl font-bold text-white/90">Appearance</h1>
                <p className="text-sm text-white/50 mt-1">Customize your theme and visual preferences</p>
            </div>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Theme</h2>
                <div className="grid grid-cols-3 gap-3">
                    {themes.map((t) => (
                        <button
                            key={t.label}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${t.active
                                    ? "bg-primary/10 border-primary/30 text-white/90"
                                    : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:border-white/[0.1]"
                                }`}
                        >
                            <t.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{t.label}</span>
                        </button>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Accent Color</h2>
                <div className="flex items-center gap-3">
                    {accentColors.map((c) => (
                        <button key={c.name} className="group text-center">
                            <div className={`w-10 h-10 rounded-xl ${c.color} border-2 ${c.name === "Purple" ? "border-white/40 scale-110" : "border-transparent"} hover:scale-110 transition-all duration-200`} />
                            <p className="text-[10px] text-white/30 mt-1.5">{c.name}</p>
                        </button>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Display</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/75">Compact mode</p>
                            <p className="text-xs text-white/40">Reduce spacing and padding</p>
                        </div>
                        <button className="w-10 h-6 rounded-full bg-white/[0.1] relative transition-colors">
                            <div className="w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-all" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/75">Animations</p>
                            <p className="text-xs text-white/40">Enable transition effects</p>
                        </div>
                        <button className="w-10 h-6 rounded-full bg-primary relative transition-colors">
                            <div className="w-4 h-4 rounded-full bg-white absolute top-1 left-5 transition-all" />
                        </button>
                    </div>
                </div>
            </GlassCard>

            <div className="flex justify-end">
                <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20">
                    Save Preferences
                </button>
            </div>
        </div>
    );
}

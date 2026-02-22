"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, Monitor, Check, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-card border border-border rounded-2xl ${className}`}>
        {children}
    </div>
);

const themes = [
    { label: "Light", value: "light" as const, icon: Sun },
    { label: "Dark", value: "dark" as const, icon: Moon },
    { label: "System", value: "system" as const, icon: Monitor },
];

const accentColors = [
    { name: "Blue", color: "bg-blue-500" },
    { name: "Indigo", color: "bg-indigo-500" },
    { name: "Violet", color: "bg-violet-500" },
    { name: "Emerald", color: "bg-emerald-500" },
    { name: "Orange", color: "bg-orange-500" },
    { name: "Rose", color: "bg-rose-500" },
];

export default function AppearanceSettingsPage() {
    const { theme, setTheme } = useTheme();
    const [activeColor, setActiveColor] = useState("Blue");
    const [compact, setCompact] = useState(false);
    const [animations, setAnimations] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setSaved(false);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 600);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 hover:text-foreground/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Appearance</h1>
                <p className="text-sm text-muted-foreground mt-1">Customize your theme and visual preferences</p>
            </div>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-foreground/70 mb-4">Theme</h2>
                <div className="grid grid-cols-3 gap-3">
                    {themes.map((t) => (
                        <button
                            key={t.label}
                            onClick={() => setTheme(t.value)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${theme === t.value
                                    ? "bg-primary/10 border-primary/30 text-foreground"
                                    : "bg-accent border-border text-muted-foreground hover:bg-accent/80 hover:border-primary/20"
                                }`}
                        >
                            <t.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{t.label}</span>
                        </button>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-foreground/70 mb-4">Accent Color</h2>
                <div className="flex items-center gap-3">
                    {accentColors.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => setActiveColor(c.name)}
                            className="group text-center"
                        >
                            <div className={`w-10 h-10 rounded-xl ${c.color} border-2 ${activeColor === c.name ? "border-foreground/40 scale-110" : "border-transparent"} hover:scale-110 transition-all duration-200`} />
                            <p className="text-[10px] text-muted-foreground/50 mt-1.5">{c.name}</p>
                        </button>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-foreground/70 mb-4">Display</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-foreground/75">Compact mode</p>
                            <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                        </div>
                        <button
                            onClick={() => setCompact(!compact)}
                            className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${compact ? "bg-primary" : "bg-muted"}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${compact ? "left-5" : "left-1"}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-foreground/75">Animations</p>
                            <p className="text-xs text-muted-foreground">Enable transition effects</p>
                        </div>
                        <button
                            onClick={() => setAnimations(!animations)}
                            className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${animations ? "bg-primary" : "bg-muted"}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${animations ? "left-5" : "left-1"}`} />
                        </button>
                    </div>
                </div>
            </GlassCard>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
                    {saved ? "Saved!" : "Save Preferences"}
                </button>
            </div>
        </div>
    );
}

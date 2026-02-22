import Link from "next/link";
import { ArrowLeft, Monitor, Moon, Sun } from "lucide-react";

export const dynamic = "force-dynamic";

const themes = [
    { id: "light", label: "Light", icon: Sun, active: false },
    { id: "dark", label: "Dark", icon: Moon, active: true },
    { id: "system", label: "System", icon: Monitor, active: false },
];

const densityOptions = [
    { id: "comfortable", label: "Comfortable", desc: "Default spacing", active: true },
    { id: "compact", label: "Compact", desc: "Tighter layout", active: false },
];

export default function AppearanceSettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <Link href="/dashboard/settings" className="text-xs text-dash-muted hover:text-primary transition-colors flex items-center gap-1 mb-3">
                    <ArrowLeft className="w-3 h-3" /> Back to Settings
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-dash-text">Appearance</h2>
                <p className="text-dash-muted mt-1">Customize how the dashboard looks.</p>
            </div>

            {/* Theme */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-dash-text mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                    {themes.map(theme => (
                        <button key={theme.id} className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border transition-all ${theme.active ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/[0.02] border-white/[0.06] text-dash-muted hover:border-white/[0.12]"}`}>
                            <theme.icon className="w-6 h-6" />
                            <span className="text-xs font-semibold">{theme.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Density */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-dash-text mb-4">Density</h3>
                <div className="space-y-2">
                    {densityOptions.map(opt => (
                        <button key={opt.id} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${opt.active ? "bg-primary/10 border-primary/30" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"}`}>
                            <div>
                                <p className={`text-sm font-semibold ${opt.active ? "text-primary" : "text-dash-text"}`}>{opt.label}</p>
                                <p className="text-xs text-dash-muted mt-0.5">{opt.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${opt.active ? "border-primary" : "border-white/[0.1]"}`}>
                                {opt.active && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

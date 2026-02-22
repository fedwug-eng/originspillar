import Link from "next/link";
import { ArrowLeft, Shield, Smartphone, Monitor, Globe, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const sessions = [
    { device: "MacBook Pro", browser: "Chrome", location: "Dubai, UAE", time: "Active now", icon: Monitor, current: true },
    { device: "iPhone 15", browser: "Safari", location: "Dubai, UAE", time: "2h ago", icon: Smartphone, current: false },
    { device: "Windows PC", browser: "Firefox", location: "New York, US", time: "3 days ago", icon: Globe, current: false },
];

export default function SecuritySettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <Link href="/dashboard/settings" className="text-xs text-dash-muted hover:text-primary transition-colors flex items-center gap-1 mb-3">
                    <ArrowLeft className="w-3 h-3" /> Back to Settings
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-dash-text">Security</h2>
                <p className="text-dash-muted mt-1">Password, 2FA, and active sessions.</p>
            </div>

            {/* Password */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-dash-text">Password</h3>
                        <p className="text-xs text-dash-muted mt-1 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Last changed 45 days ago
                        </p>
                    </div>
                    <button className="text-sm font-semibold text-primary hover:underline">Change password</button>
                </div>
            </div>

            {/* 2FA */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-dash-text">Two-Factor Authentication</h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 mt-1 inline-block">Disabled</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-dash-muted leading-relaxed mt-2">
                    Add an extra layer of security to your account. When 2FA is enabled, you&apos;ll need to enter a code from your authenticator app in addition to your password.
                </p>
                <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-all">
                    Enable 2FA
                </button>
            </div>

            {/* Sessions */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-dash-text">Active Sessions</h3>
                    <button className="text-xs font-semibold text-rose-400 hover:underline">Revoke all</button>
                </div>
                <div className="space-y-3">
                    {sessions.map((session, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                            <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                                <session.icon className="w-4 h-4 text-dash-muted" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-dash-text">{session.device} · {session.browser}</p>
                                <p className="text-xs text-dash-muted mt-0.5">{session.location} · {session.time}</p>
                            </div>
                            {session.current ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-400">Current</span>
                            ) : (
                                <button className="text-xs font-semibold text-rose-400 hover:underline">Revoke</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Key, Smartphone, Monitor, Clock } from "lucide-react";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

const initialSessions = [
    { id: "1", device: "MacBook Pro - Chrome", location: "New York, NY", time: "Active now", current: true },
    { id: "2", device: "iPhone 15 - Safari", location: "New York, NY", time: "2h ago", current: false },
    { id: "3", device: "Windows PC - Firefox", location: "Boston, MA", time: "3 days ago", current: false },
];

export default function SecuritySettingsPage() {
    const [sessions, setSessions] = useState(initialSessions);
    const [twoFaEnabled, setTwoFaEnabled] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const revokeSession = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
    };

    const revokeAll = () => {
        setSessions(prev => prev.filter(s => s.current));
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <h1 className="text-2xl font-bold text-white/90">Security</h1>
                <p className="text-sm text-white/50 mt-1">Password, two-factor auth, and active sessions</p>
            </div>

            {/* Password */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-semibold text-white/70">Password</h2>
                    </div>
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                        {showPasswordForm ? "Cancel" : "Change password"}
                    </button>
                </div>
                {showPasswordForm ? (
                    <div className="space-y-3">
                        <input
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
                        />
                        <button className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20">
                            Update Password
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-white/50">Last changed 45 days ago</p>
                )}
            </GlassCard>

            {/* 2FA */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-semibold text-white/70">Two-Factor Authentication</h2>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${twoFaEnabled ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"}`}>
                        {twoFaEnabled ? "Enabled" : "Disabled"}
                    </span>
                </div>
                <p className="text-sm text-white/50 mb-4">Add an extra layer of security by requiring a verification code on login.</p>
                <button
                    onClick={() => setTwoFaEnabled(!twoFaEnabled)}
                    className={`text-xs font-medium px-4 py-2 rounded-xl transition-all duration-300 shadow-lg ${twoFaEnabled
                            ? "bg-white/[0.06] border border-white/[0.08] text-white/60 hover:bg-white/[0.1] shadow-none"
                            : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                        }`}
                >
                    {twoFaEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
            </GlassCard>

            {/* Active Sessions */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Monitor className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-semibold text-white/70">Active Sessions</h2>
                    </div>
                    {sessions.filter(s => !s.current).length > 0 && (
                        <button onClick={revokeAll} className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke all</button>
                    )}
                </div>
                <div className="space-y-3">
                    {sessions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                            <div className="flex items-center gap-3">
                                <Monitor className="w-4 h-4 text-white/40" />
                                <div>
                                    <p className="text-sm text-white/70">{s.device}</p>
                                    <p className="text-xs text-white/35">{s.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-xs text-white/40">
                                    <Clock className="w-3 h-3" />
                                    {s.time}
                                </div>
                                {s.current ? (
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-emerald-400 bg-emerald-400/10">Current</span>
                                ) : (
                                    <button onClick={() => revokeSession(s.id)} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}

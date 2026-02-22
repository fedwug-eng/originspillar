"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

function ToggleRow({ label, description, initial = true }: { label: string; description: string; initial?: boolean }) {
    const [on, setOn] = useState(initial);
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
            <div>
                <p className="text-sm text-white/75">{label}</p>
                <p className="text-xs text-white/40">{description}</p>
            </div>
            <button
                onClick={() => setOn(!on)}
                className={`w-10 h-6 rounded-full transition-colors duration-300 relative ${on ? "bg-primary" : "bg-white/[0.1]"}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${on ? "left-5" : "left-1"}`} />
            </button>
        </div>
    );
}

export default function NotificationsSettingsPage() {
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
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <h1 className="text-2xl font-bold text-white/90">Notifications</h1>
                <p className="text-sm text-white/50 mt-1">Choose how and when you get notified</p>
            </div>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-2">Email Notifications</h2>
                <div>
                    <ToggleRow label="New project assigned" description="When a new project is added to your account" />
                    <ToggleRow label="Client messages" description="When a client sends you a message" />
                    <ToggleRow label="Invoice payments" description="When a client pays an invoice" />
                    <ToggleRow label="Task updates" description="When tasks are completed or moved" initial={false} />
                    <ToggleRow label="Weekly summary" description="A digest of your activity every Monday" />
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-2">In-App Notifications</h2>
                <div>
                    <ToggleRow label="Desktop push notifications" description="Browser notifications for important updates" initial={false} />
                    <ToggleRow label="Sound alerts" description="Play a sound for new notifications" initial={false} />
                    <ToggleRow label="Badge counter" description="Show unread count on the notification bell" />
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

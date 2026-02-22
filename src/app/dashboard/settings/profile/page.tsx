"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Loader2, Check } from "lucide-react";

type UserProfile = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    jobTitle: string | null;
    location: string | null;
    bio: string | null;
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

export default function ProfileSettingsPage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        fetch("/api/settings/profile")
            .then(r => r.json())
            .then(data => {
                const u = data.user;
                if (u) {
                    setUser(u);
                    setFirstName(u.firstName || "");
                    setLastName(u.lastName || "");
                    setPhone(u.phone || "");
                    setJobTitle(u.jobTitle || "");
                    setLocation(u.location || "");
                    setBio(u.bio || "");
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch("/api/settings/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, phone, jobTitle, location, bio }),
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch {
            // handle error
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
            </div>
        );
    }

    const initials = `${(firstName?.[0] || "")}${(lastName?.[0] || "")}`.toUpperCase() || "?";

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <h1 className="text-2xl font-bold text-white/90">Profile</h1>
                <p className="text-sm text-white/50 mt-1">Update your personal information and avatar</p>
            </div>

            {/* Avatar */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Profile Photo</h2>
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/50 to-primary/20 flex items-center justify-center border border-white/[0.1]">
                            <span className="text-2xl font-bold text-white/80">{initials}</span>
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary flex items-center justify-center border-2 border-[hsl(var(--op-navy))]">
                            <Camera className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                    <div>
                        <p className="text-sm text-white/70 font-medium">{firstName} {lastName}</p>
                        <p className="text-xs text-white/40 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                        <button className="text-xs text-primary hover:text-primary/80 mt-2 transition-colors">Change photo</button>
                    </div>
                </div>
            </GlassCard>

            {/* Personal Info */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">First Name</label>
                        <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Last Name</label>
                        <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Email Address</label>
                        <input value={user?.email || ""} disabled className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/50 cursor-not-allowed opacity-60 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Phone</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Job Title</label>
                        <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Location</label>
                        <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                </div>
            </GlassCard>

            {/* Bio */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Bio</h2>
                <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all resize-none"
                />
            </GlassCard>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
                    {saved ? "Saved!" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

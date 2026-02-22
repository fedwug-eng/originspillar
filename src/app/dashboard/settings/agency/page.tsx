"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Loader2, Check } from "lucide-react";

type AgencyData = {
    id: string;
    name: string;
    website: string | null;
    industry: string | null;
    companySize: string | null;
    address: string | null;
    logoUrl: string | null;
    brandColorPrimary: string | null;
    brandColorSecondary: string | null;
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

export default function AgencySettingsPage() {
    const [agency, setAgency] = useState<AgencyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [address, setAddress] = useState("");
    const [brandColorPrimary, setBrandColorPrimary] = useState("#7c3aed");
    const [brandColorSecondary, setBrandColorSecondary] = useState("#4338ca");

    useEffect(() => {
        fetch("/api/settings/agency")
            .then(r => r.json())
            .then(data => {
                const a = data.agency;
                if (a) {
                    setAgency(a);
                    setName(a.name || "");
                    setWebsite(a.website || "");
                    setIndustry(a.industry || "");
                    setCompanySize(a.companySize || "");
                    setAddress(a.address || "");
                    setBrandColorPrimary(a.brandColorPrimary || "#7c3aed");
                    setBrandColorSecondary(a.brandColorSecondary || "#4338ca");
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch("/api/settings/agency", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, website, industry, companySize, address, brandColorPrimary, brandColorSecondary }),
            });
            if (res.ok) {
                const data = await res.json();
                setAgency(data.agency);
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

    const brandColors = [
        { color: brandColorPrimary, label: "Primary", setter: setBrandColorPrimary },
        { color: brandColorSecondary, label: "Dark", setter: setBrandColorSecondary },
        { color: "hsl(220,25%,12%)", label: "Navy", setter: null },
        { color: "hsl(0,0%,95%)", label: "Light", setter: null },
    ];

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <h1 className="text-2xl font-bold text-white/90">Agency</h1>
                <p className="text-sm text-white/50 mt-1">Company name, logo, and branding</p>
            </div>

            {/* Logo */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Agency Logo</h2>
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/15">
                            <span className="text-lg font-black text-primary">OP</span>
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary flex items-center justify-center border-2 border-[hsl(var(--op-navy))]">
                            <Camera className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                    <div>
                        <p className="text-sm text-white/70 font-medium">{name || "Originspillar"}</p>
                        <p className="text-xs text-white/40 mt-0.5">SVG, PNG or JPG. Recommended 200x200px.</p>
                    </div>
                </div>
            </GlassCard>

            {/* Company Info */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Company Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Company Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Website</label>
                        <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Industry</label>
                        <input value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Company Size</label>
                        <input value={companySize} onChange={e => setCompanySize(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Address</label>
                        <input value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all" />
                    </div>
                </div>
            </GlassCard>

            {/* Branding */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Brand Colors</h2>
                <div className="flex items-center gap-4">
                    {brandColors.map((item, i) => (
                        <div key={i} className="text-center relative">
                            <div
                                className="w-12 h-12 rounded-xl border border-white/[0.1] cursor-pointer hover:scale-105 transition-transform"
                                style={{ backgroundColor: item.color }}
                                onClick={() => {
                                    if (item.setter) {
                                        const input = document.createElement("input");
                                        input.type = "color";
                                        input.value = item.color;
                                        input.onchange = (e) => item.setter!((e.target as HTMLInputElement).value);
                                        input.click();
                                    }
                                }}
                            />
                            <p className="text-[10px] text-white/30 mt-1.5">{item.label}</p>
                        </div>
                    ))}
                </div>
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

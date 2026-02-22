import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

export const dynamic = "force-dynamic";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

const InputField = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-medium text-white/50">{label}</label>
        <input
            defaultValue={value}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
        />
    </div>
);

export default async function AgencySettingsPage() {
    const workspace = await currentWorkspace();
    if (!workspace) return redirect("/sign-in");

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
                        <p className="text-sm text-white/70 font-medium">{workspace.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">SVG, PNG or JPG. Recommended 200x200px.</p>
                    </div>
                </div>
            </GlassCard>

            {/* Company Info */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Company Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Company Name" value={workspace.name} />
                    <InputField label="Website" value={workspace.website || ""} />
                    <InputField label="Industry" value={workspace.industry || ""} />
                    <InputField label="Company Size" value={workspace.companySize || ""} />
                    <div className="sm:col-span-2">
                        <InputField label="Address" value={workspace.address || ""} />
                    </div>
                </div>
            </GlassCard>

            {/* Branding */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Brand Colors</h2>
                <div className="flex items-center gap-4">
                    {[
                        { color: workspace.brandColorPrimary || "hsl(271,91%,65%)", label: "Primary" },
                        { color: workspace.brandColorSecondary || "hsl(271,91%,45%)", label: "Dark" },
                        { color: "hsl(220,25%,12%)", label: "Navy" },
                        { color: "hsl(0,0%,95%)", label: "Light" },
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="w-12 h-12 rounded-xl border border-white/[0.1] cursor-pointer hover:scale-105 transition-transform" style={{ backgroundColor: item.color }} />
                            <p className="text-[10px] text-white/30 mt-1.5">{item.label}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <div className="flex justify-end">
                <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

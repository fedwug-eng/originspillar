import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AgencySettingsPage() {
    const workspace = await currentWorkspace();
    if (!workspace) return redirect("/sign-in");

    const brandColors = [
        { label: "Primary", value: workspace.brandColorPrimary || "#7c3aed" },
        { label: "Secondary", value: workspace.brandColorSecondary || "#4338ca" },
        { label: "Navy", value: "#0f172a" },
        { label: "Light", value: "#f8fafc" },
    ];

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <Link href="/dashboard/settings" className="text-xs text-dash-muted hover:text-primary transition-colors flex items-center gap-1 mb-3">
                    <ArrowLeft className="w-3 h-3" /> Back to Settings
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-dash-text">Agency</h2>
                <p className="text-dash-muted mt-1">Company details and branding.</p>
            </div>

            {/* Logo */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            OP
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-op-navy-light border border-white/[0.1] flex items-center justify-center text-dash-muted hover:text-white transition-colors">
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div>
                        <p className="text-base font-bold text-dash-text">{workspace.name}</p>
                        <p className="text-xs text-dash-muted mt-0.5">Company logo</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6 space-y-5">
                <FormField label="Company Name" defaultValue={workspace.name} />
                <FormField label="Website" defaultValue={workspace.website || ""} />
                <FormField label="Industry" defaultValue={workspace.industry || ""} />
                <FormField label="Company Size" defaultValue={workspace.companySize || ""} />
                <FormField label="Address" defaultValue={workspace.address || ""} />
                <button className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-all">Save Changes</button>
            </div>

            {/* Brand Colors */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-dash-text mb-4">Brand Colors</h3>
                <div className="flex gap-4">
                    {brandColors.map(color => (
                        <div key={color.label} className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 rounded-xl border border-white/[0.1] cursor-pointer hover:scale-105 transition-transform shadow-md" style={{ background: color.value }} />
                            <span className="text-[10px] font-medium text-dash-muted">{color.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FormField({ label, defaultValue }: { label: string; defaultValue: string }) {
    return (
        <div>
            <label className="text-xs font-semibold text-dash-muted uppercase tracking-wider block mb-2">{label}</label>
            <input defaultValue={defaultValue} className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 text-sm text-dash-text focus:outline-none focus:border-primary/40 transition-all" />
        </div>
    );
}

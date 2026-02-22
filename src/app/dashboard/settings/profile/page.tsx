import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <Link href="/dashboard/settings" className="text-xs text-dash-muted hover:text-primary transition-colors flex items-center gap-1 mb-3">
                    <ArrowLeft className="w-3 h-3" /> Back to Settings
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-dash-text">Profile</h2>
                <p className="text-dash-muted mt-1">Your personal information.</p>
            </div>

            {/* Avatar */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {(user.firstName?.[0] || "")}{(user.lastName?.[0] || "")}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-op-navy-light border border-white/[0.1] flex items-center justify-center text-dash-muted hover:text-white transition-colors">
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div>
                        <p className="text-base font-bold text-dash-text">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-dash-muted mt-0.5">PNG, JPG or GIF. Max 2MB.</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="First Name" defaultValue={user.firstName || ""} />
                    <FormField label="Last Name" defaultValue={user.lastName || ""} />
                </div>
                <FormField label="Email" defaultValue={user.email} type="email" />
                <FormField label="Phone" defaultValue={user.phone || ""} />
                <FormField label="Job Title" defaultValue={user.jobTitle || ""} />
                <FormField label="Location" defaultValue={user.location || ""} />
                <div>
                    <label className="text-xs font-semibold text-dash-muted uppercase tracking-wider block mb-2">Bio</label>
                    <textarea
                        defaultValue={user.bio || ""}
                        rows={3}
                        className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-sm text-dash-text placeholder:text-dash-muted focus:outline-none focus:border-primary/40 transition-all resize-none"
                    />
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-all">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function FormField({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
    return (
        <div>
            <label className="text-xs font-semibold text-dash-muted uppercase tracking-wider block mb-2">{label}</label>
            <input type={type} defaultValue={defaultValue} className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 text-sm text-dash-text focus:outline-none focus:border-primary/40 transition-all" />
        </div>
    );
}

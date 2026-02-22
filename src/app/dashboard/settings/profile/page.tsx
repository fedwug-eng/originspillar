import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

export const dynamic = "force-dynamic";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

const InputField = ({ label, value, type = "text" }: { label: string; value: string; type?: string }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-medium text-white/50">{label}</label>
        <input
            type={type}
            defaultValue={value}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
        />
    </div>
);

export default async function ProfileSettingsPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const initials = `${(user.firstName?.[0] || "")}${(user.lastName?.[0] || "")}`;

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
                        <p className="text-sm text-white/70 font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-white/40 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                        <button className="text-xs text-primary hover:text-primary/80 mt-2 transition-colors">Change photo</button>
                    </div>
                </div>
            </GlassCard>

            {/* Personal Info */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First Name" value={user.firstName || ""} />
                    <InputField label="Last Name" value={user.lastName || ""} />
                    <InputField label="Email Address" value={user.email} type="email" />
                    <InputField label="Phone" value={user.phone || ""} />
                    <InputField label="Job Title" value={user.jobTitle || ""} />
                    <InputField label="Location" value={user.location || ""} />
                </div>
            </GlassCard>

            {/* Bio */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Bio</h2>
                <textarea
                    defaultValue={user.bio || ""}
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all resize-none"
                />
            </GlassCard>

            <div className="flex justify-end">
                <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

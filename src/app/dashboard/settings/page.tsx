import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { User, Building2, Shield, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account and workspace settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/15 transition-all duration-300">
                    <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-foreground">Profile</h3>
                            <p className="text-xs text-muted-foreground">Your account information</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="flex items-center gap-4">
                            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-16 w-16 ring-2 ring-primary/10 ring-offset-2 ring-offset-card" } }} />
                            <div>
                                <p className="text-lg font-bold text-foreground">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5">
                                <Shield className="w-3.5 h-3.5 text-accent-foreground" />
                                <span className="text-xs font-semibold text-accent-foreground">{user.role}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workspace Card */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/15 transition-all duration-300">
                    <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-op-indigo/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-op-indigo" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-foreground">Workspace</h3>
                            <p className="text-xs text-muted-foreground">Your agency workspace details</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                            <p className="text-foreground font-semibold mt-1">{user.workspace.name}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</label>
                            <p className="text-foreground font-mono text-sm bg-secondary px-4 py-2.5 rounded-xl mt-1 border border-border">{user.workspace.slug}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</label>
                            <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <p className="text-foreground text-sm">{new Date(user.workspace.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

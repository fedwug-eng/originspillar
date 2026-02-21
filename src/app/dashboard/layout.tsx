import { PropsWithChildren } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, Settings, CreditCard } from "lucide-react";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role === "CLIENT") {
        return redirect("/portal");
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-zinc-950 text-zinc-50 font-sans selection:bg-violet-500/30">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 border-r border-white/5 bg-zinc-950/80 backdrop-blur-md hidden md:block">
                <div className="flex h-16 items-center border-b border-white/5 px-6">
                    <Link href="/" className="flex items-center space-x-2 font-bold tracking-tight">
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                            <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        <span className="text-lg">{siteConfig.name} OS</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-2 p-4 mt-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 rounded-lg bg-white/5 px-3 py-2 text-white border border-white/10 shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] transition-all"
                    >
                        <LayoutDashboard className="h-4 w-4 text-violet-400" />
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link
                        href="/dashboard/requests"
                        className="flex items-center space-x-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-white hover:bg-white/5"
                    >
                        <FolderKanban className="h-4 w-4" />
                        <span className="text-sm font-medium">Requests</span>
                    </Link>
                    <Link
                        href="/dashboard/clients"
                        className="flex items-center space-x-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-white hover:bg-white/5"
                    >
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">Clients</span>
                    </Link>
                    <Link
                        href="/dashboard/billing"
                        className="flex items-center space-x-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-white hover:bg-white/5"
                    >
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm font-medium">Billing</span>
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center space-x-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-white hover:bg-white/5"
                    >
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />

                <div className="mx-auto max-w-6xl relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

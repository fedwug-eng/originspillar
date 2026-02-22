import { PropsWithChildren } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, Settings, CreditCard, Box } from "lucide-react";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role === "CLIENT") {
        return redirect("/portal");
    }

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/requests", label: "Requests", icon: FolderKanban },
        { href: "/dashboard/clients", label: "Clients", icon: Users },
        { href: "/dashboard/services", label: "Services", icon: Box },
        { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-secondary/20 text-foreground font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 border-r border-border bg-card hidden md:flex md:flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-border px-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                            <span className="text-primary-foreground font-bold text-sm">O</span>
                        </div>
                        <span className="font-bold text-foreground tracking-tight">{siteConfig.name}</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 mt-1 space-y-0.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent"
                        >
                            <item.icon className="h-[18px] w-[18px] transition-colors duration-200 group-hover:text-accent-foreground" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3">
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.workspace.name}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-card">
                <Link href="/" className="flex items-center gap-2 font-bold">
                    <div className="w-6 h-6 rounded-md bg-gradient-accent flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-[10px]">O</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{siteConfig.name}</span>
                </Link>
                <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border px-2 py-1.5">
                <div className="flex items-center justify-around">
                    {navItems.slice(0, 5).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-1 px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

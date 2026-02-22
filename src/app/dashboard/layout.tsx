import { PropsWithChildren } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, Settings, CreditCard, Box, LogOut } from "lucide-react";
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
        <div className="flex min-h-screen flex-col md:flex-row bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 border-r border-gray-200 bg-white hidden md:flex md:flex-col">
                <div className="flex h-16 items-center border-b border-gray-200 px-6">
                    <Link href="/" className="flex items-center space-x-2 font-bold tracking-tight">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
                            <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        <span className="text-lg text-gray-900">{siteConfig.name}</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 p-3 mt-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-gray-600 transition-all hover:text-gray-900 hover:bg-gray-100"
                        >
                            <item.icon className="h-[18px] w-[18px]" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                {/* User Profile */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500 truncate">{user.workspace.name}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white">
                <Link href="/" className="flex items-center space-x-2 font-bold">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <span className="text-base text-gray-900">{siteConfig.name}</span>
                </Link>
                <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-1.5">
                <div className="flex items-center justify-around">
                    {navItems.slice(0, 5).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-1 px-2 py-1 text-gray-400 hover:text-violet-600 transition-colors"
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

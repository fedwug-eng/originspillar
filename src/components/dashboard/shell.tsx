"use client";

import { PropsWithChildren, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    BarChart3, FolderKanban, Users, DollarSign, Settings, Search,
    Menu, X, Package, MessageSquare, Network, Server, Key, Activity
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import NotificationBell from "@/components/dashboard/NotificationBell";

const sidebarLinks = [
    { label: "Overview", icon: BarChart3, to: "/dashboard", badge: 0 },
    { label: "Requests", icon: FolderKanban, to: "/dashboard/requests", badge: 0 },
    { label: "Communications", icon: MessageSquare, to: "/dashboard/communications", badge: 0, useBadge: true },
    { label: "Clients", icon: Users, to: "/dashboard/clients", badge: 0 },
    { label: "Services", icon: Package, to: "/dashboard/services", badge: 0 },
    { label: "Billing", icon: DollarSign, to: "/dashboard/billing", badge: 0 },
    { label: "Settings", icon: Settings, to: "/dashboard/settings", badge: 0 },
];

const apiGatewayLinks = [
    { label: "Overview", icon: Network, to: "/dashboard/api-gateway" },
    { label: "Providers", icon: Server, to: "/dashboard/api-gateway/providers" },
    { label: "Gateway Keys", icon: Key, to: "/dashboard/api-gateway/keys" },
    { label: "Usage & Logs", icon: Activity, to: "/dashboard/api-gateway/usage" },
];

function SidebarContent({ pathname, unreadCount, onNav }: { pathname: string; unreadCount: number; onNav?: () => void }) {
    return (
        <>
            {/* Logo */}
            <div className="px-6 py-5 border-b border-border flex items-center">
                <Link href="/" className="flex items-center gap-3 cursor-pointer" onClick={onNav}>
                    <Image
                        src="/logo.png"
                        alt="Origins Pillar"
                        width={36}
                        height={36}
                        className="rounded-lg object-contain"
                        priority
                    />
                    <span className="text-base font-bold text-foreground tracking-tight">Origins Pillar</span>
                </Link>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-6">
                <div className="space-y-1.5">
                    {sidebarLinks.map((link) => {
                        const isActive = link.to === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(link.to);
                        const badge = link.useBadge ? unreadCount : link.badge;

                        return (
                            <Link
                                key={link.to}
                                href={link.to}
                                onClick={onNav}
                                className={`flex items-center gap-3.5 px-5 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${isActive
                                    ? "bg-primary/10 text-primary border border-primary/15 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
                                    }`}
                            >
                                <link.icon className="w-5 h-5" />
                                <span className="flex-1">{link.label}</span>
                                {badge > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-white">{badge}</span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div>
                    <h4 className="px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Network className="w-4 h-4" /> API Gateway
                    </h4>
                    <div className="space-y-1.5">
                        {apiGatewayLinks.map((link) => {
                            const isActive = pathname.startsWith(link.to);

                            return (
                                <Link
                                    key={link.to}
                                    href={link.to}
                                    onClick={onNav}
                                    className={`flex items-center gap-3.5 px-5 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${isActive
                                        ? "bg-primary/10 text-primary border border-primary/15 shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span className="flex-1">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* User */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-3 py-2">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-8 w-8"
                            }
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">Account</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function DashboardShell({ children, unreadCount = 0 }: PropsWithChildren<{ unreadCount?: number }>) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-card backdrop-blur-xl transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="absolute top-4 right-4 lg:hidden">
                    <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <SidebarContent pathname={pathname} unreadCount={unreadCount} onNav={() => setSidebarOpen(false)} />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen relative">
                {/* Top bar */}
                <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            <Search className="w-4 h-4 text-muted-foreground/50 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-accent border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:bg-accent/80 w-64 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

"use client";

import { PropsWithChildren, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3, FolderKanban, Users, DollarSign, Settings, Search, Bell,
    Menu, X, LogOut, Package, MessageSquare
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const sidebarLinks = [
    { label: "Overview", icon: BarChart3, to: "/dashboard", badge: 0 },
    { label: "Requests", icon: FolderKanban, to: "/dashboard/requests", badge: 0 },
    { label: "Communications", icon: MessageSquare, to: "/dashboard/communications", badge: 0, useBadge: true },
    { label: "Clients", icon: Users, to: "/dashboard/clients", badge: 0 },
    { label: "Services", icon: Package, to: "/dashboard/services", badge: 0 },
    { label: "Billing", icon: DollarSign, to: "/dashboard/billing", badge: 0 },
    { label: "Settings", icon: Settings, to: "/dashboard/settings", badge: 0 },
];

function SidebarContent({ pathname, unreadCount, onNav }: { pathname: string; unreadCount: number; onNav?: () => void }) {
    return (
        <>
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/[0.06] flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 cursor-pointer" onClick={onNav}>
                    <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/15">
                        <span className="text-sm font-black text-primary">OP</span>
                    </div>
                    <span className="text-base font-bold text-white/90 tracking-tight">Originspillar</span>
                </Link>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-6 space-y-2">
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
                            className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-300 ease-out hover:-translate-y-[1px] hover:shadow-lg hover:shadow-primary/[0.04] ${isActive
                                    ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-sm shadow-primary/10"
                                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.06] border border-transparent"
                                }`}
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="flex-1">{link.label}</span>
                            {badge > 0 && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow shadow-primary/50">
                                    <span className="text-[10px] font-bold text-white">{badge}</span>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-white/[0.06]">
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
                        <p className="text-sm font-semibold text-white/80 truncate">Account</p>
                        <p className="text-xs text-white/30">Admin</p>
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
        <div className="min-h-screen bg-op-navy flex">
            {/* Ambient background glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-primary/[0.07] rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-primary/[0.05] rounded-full blur-[120px]" />
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="absolute top-4 right-4 lg:hidden">
                    <button onClick={() => setSidebarOpen(false)} className="text-white/40">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <SidebarContent pathname={pathname} unreadCount={unreadCount} onNav={() => setSidebarOpen(false)} />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen relative">
                {/* Top bar */}
                <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-white/50" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] w-64 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] hover:scale-105 hover:shadow-lg hover:shadow-primary/[0.06] transition-all duration-300 ease-out">
                            <Bell className="w-4 h-4 text-white/40" />
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary shadow shadow-primary/50" />
                        </button>
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

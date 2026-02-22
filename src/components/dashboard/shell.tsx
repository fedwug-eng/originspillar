"use client";

import { PropsWithChildren, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, FolderKanban, Settings, CreditCard, Box,
    MessageSquare, Search, Bell, Menu, X
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/requests", label: "Requests", icon: FolderKanban },
    { href: "/dashboard/communications", label: "Communications", icon: MessageSquare, badge: true },
    { href: "/dashboard/clients", label: "Clients", icon: Users },
    { href: "/dashboard/services", label: "Services", icon: Box },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ pathname, unreadCount }: { pathname: string; unreadCount: number }) {
    return (
        <>
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-white/[0.06] px-6">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
                        <span className="text-white font-bold text-sm">O</span>
                    </div>
                    <span className="font-bold text-dash-text tracking-tight text-lg">Originspillar</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 mt-1 space-y-0.5">
                {navItems.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 ${isActive
                                    ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-lg shadow-white/[0.02]"
                                    : "text-dash-muted hover:text-dash-text hover:bg-white/[0.04] border border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`h-[18px] w-[18px] transition-colors duration-200 ${isActive ? "text-primary" : ""}`} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            {item.badge && unreadCount > 0 && (
                                <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-primary text-[10px] font-bold text-white px-1.5">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="border-t border-white/[0.06] p-4">
                <div className="flex items-center gap-3">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9 ring-2 ring-white/10 ring-offset-2 ring-offset-op-navy"
                            }
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dash-text truncate">Account</p>
                        <p className="text-xs text-dash-muted truncate">Manage profile</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function DashboardShell({ children, unreadCount = 0 }: PropsWithChildren<{ unreadCount?: number }>) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col lg:flex-row bg-op-navy text-dash-text font-sans relative overflow-hidden">
            {/* Ambient glow orbs */}
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/[0.07] rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-white/[0.06] bg-op-navy/80 backdrop-blur-xl hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-30">
                <SidebarContent pathname={pathname} unreadCount={unreadCount} />
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-op-navy border-r border-white/[0.06] z-50 lg:hidden flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="absolute top-4 right-4">
                    <button onClick={() => setMobileOpen(false)} className="text-dash-muted hover:text-white p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <SidebarContent pathname={pathname} unreadCount={unreadCount} />
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Top bar */}
                <header className="sticky top-0 z-20 h-16 border-b border-white/[0.06] bg-op-navy/80 backdrop-blur-xl flex items-center justify-between px-6 gap-4">
                    {/* Mobile hamburger */}
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden text-dash-muted hover:text-white">
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search */}
                    <div className="flex-1 max-w-md relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dash-muted" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] pl-10 pr-4 text-sm text-dash-text placeholder:text-dash-muted focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    {/* Notification bell */}
                    <button className="relative text-dash-muted hover:text-white transition-colors p-2">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                    </button>
                </header>

                {/* Content area */}
                <main className="flex-1 p-6 lg:p-8 relative">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

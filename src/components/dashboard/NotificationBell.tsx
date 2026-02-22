"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, FolderKanban, Users, DollarSign, MessageSquare, Key, Package } from "lucide-react";

type Notification = {
    id: string;
    action: string;
    resourceType: string;
    resourceId: string;
    metadata: Record<string, unknown> | null;
    readAt: string | null;
    createdAt: string;
    actor: { firstName: string | null; lastName: string | null; email: string };
};

const actionLabels: Record<string, string> = {
    "request.created": "created a new request",
    "request.updated": "updated a request",
    "client.onboarded": "added a new client",
    "message.sent": "sent a message",
    "invoice.paid": "payment received",
    "apikey.created": "added an API key",
    "apikey.revoked": "revoked an API key",
    "service.created": "created a new service",
    "subscription.created": "new subscription",
};

const typeIcons: Record<string, typeof Bell> = {
    request: FolderKanban,
    client: Users,
    invoice: DollarSign,
    message: MessageSquare,
    apikey: Key,
    service: Package,
    subscription: DollarSign,
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Fetch on mount + periodically
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // every 30s
        return () => clearInterval(interval);
    }, []);

    async function fetchNotifications() {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch {
            // silently fail
        }
    }

    async function markAllRead() {
        setLoading(true);
        try {
            await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAll: true }),
            });
            setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })));
            setUnreadCount(0);
        } catch {
            // silently fail
        }
        setLoading(false);
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
                className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] hover:scale-105 hover:shadow-lg hover:shadow-primary/[0.06] transition-all duration-300 ease-out"
            >
                <Bell className="w-4 h-4 text-white/40" />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center shadow shadow-primary/50 px-1">
                        <span className="text-[10px] font-bold text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>
                    </div>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-12 w-80 bg-[hsl(220,25%,12%)] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[100]">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white/80">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                disabled={loading}
                                className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
                            >
                                <CheckCheck className="w-3 h-3" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[360px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-6 h-6 text-white/15 mx-auto mb-2" />
                                <p className="text-xs text-white/40">No notifications yet</p>
                                <p className="text-[10px] text-white/25 mt-0.5">Activity will appear here as you use the platform</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const Icon = typeIcons[n.resourceType] || Bell;
                                const actorName = n.actor.firstName
                                    ? `${n.actor.firstName} ${n.actor.lastName || ""}`.trim()
                                    : n.actor.email.split("@")[0];
                                const label = actionLabels[n.action] || n.action;
                                const meta = n.metadata as Record<string, unknown> | null;
                                const detail = meta?.name || meta?.title || meta?.clientName || "";

                                return (
                                    <div
                                        key={n.id}
                                        className={`px-4 py-3 flex items-start gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer border-b border-white/[0.03] last:border-0 ${!n.readAt ? "bg-primary/[0.03]" : ""
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.readAt ? "bg-primary/15 border border-primary/10" : "bg-white/[0.04] border border-white/[0.06]"
                                            }`}>
                                            <Icon className={`w-3.5 h-3.5 ${!n.readAt ? "text-primary" : "text-white/30"}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-white/70 leading-relaxed">
                                                <span className="font-semibold text-white/80">{actorName}</span>{" "}
                                                {label}
                                                {detail && (
                                                    <span className="text-white/50"> - {String(detail)}</span>
                                                )}
                                            </p>
                                            <p className="text-[10px] text-white/30 mt-0.5">{timeAgo(n.createdAt)}</p>
                                        </div>
                                        {!n.readAt && (
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

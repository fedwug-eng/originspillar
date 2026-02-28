"use client";

import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, Copy, Plus, Trash2, Check, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

type ApiKeyItem = {
    id: string;
    name: string;
    keyPrefix: string;
    keyType: string;
    status: "active" | "revoked";
    lastUsedAt: string | null;
    createdAt: string;
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-card backdrop-blur-md border border-border rounded-2xl ${className}`}>
        {children}
    </div>
);

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKeyItem[]>([]);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newKey, setNewKey] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch keys on mount
    useEffect(() => {
        fetch("/api/api-keys")
            .then(r => r.json())
            .then(data => setKeys(data.keys || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const toggleVisibility = (id: string) => {
        setVisibleKeys((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const copyKey = (id: string, prefix: string) => {
        navigator.clipboard.writeText(prefix);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const revokeKey = async (id: string) => {
        const res = await fetch("/api/api-keys/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyId: id }),
        });
        if (res.ok) {
            const data = await res.json();
            setKeys(prev => prev.map(k => k.id === id ? data.key : k));
        }
    };

    const addKey = async () => {
        if (!newName.trim() || !newKey.trim()) return;
        setSaving(true);
        const res = await fetch("/api/api-keys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName, key: newKey }),
        });
        if (res.ok) {
            const data = await res.json();
            setKeys(prev => [data.key, ...prev]);
            setNewName("");
            setNewKey("");
            setShowAddForm(false);
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 hover:text-foreground/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">API Keys</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your API keys for third-party integrations</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" /> Add Key
                    </button>
                </div>
            </div>

            {/* Add form */}
            {showAddForm && (
                <GlassCard className="p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-foreground/80">Add New API Key</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Key name (e.g. Stripe)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground/70 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:bg-accent transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Paste API key"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground/70 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:bg-accent transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={addKey}
                            disabled={saving}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Save Key
                        </button>
                        <button
                            onClick={() => { setShowAddForm(false); setNewName(""); setNewKey(""); }}
                            className="text-sm text-muted-foreground/70 hover:text-foreground/70 px-4 py-2 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground/50">Keys are stored securely (SHA-256 hashed) and masked after saving.</p>
                </GlassCard>
            )}

            {/* Keys list */}
            {loading ? (
                <GlassCard className="p-12 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-muted-foreground/50 animate-spin" />
                </GlassCard>
            ) : keys.length === 0 ? (
                <GlassCard className="p-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-3">
                        <Key className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No API keys yet</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">Add your first key to connect third-party services</p>
                </GlassCard>
            ) : (
                <GlassCard className="divide-y divide-white/[0.06]">
                    {keys.map((apiKey) => (
                        <div key={apiKey.id} className="p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center border border-primary/8 shrink-0">
                                <Key className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-foreground/80">{apiKey.name}</p>
                                    <span
                                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${apiKey.status === "active" ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
                                            }`}
                                    >
                                        {apiKey.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                                    <span className="font-mono text-muted-foreground">
                                        {visibleKeys.has(apiKey.id) ? apiKey.keyPrefix : "••••••••••••"}
                                    </span>
                                    <span>·</span>
                                    <span>Created {new Date(apiKey.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                    <span>·</span>
                                    <span>Last used {timeAgo(apiKey.lastUsedAt)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => toggleVisibility(apiKey.id)}
                                    className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent transition-all"
                                >
                                    {visibleKeys.has(apiKey.id) ? (
                                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground/70" />
                                    ) : (
                                        <Eye className="w-3.5 h-3.5 text-muted-foreground/70" />
                                    )}
                                </button>
                                <button
                                    onClick={() => copyKey(apiKey.id, apiKey.keyPrefix)}
                                    className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent transition-all"
                                >
                                    {copiedId === apiKey.id ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5 text-muted-foreground/70" />
                                    )}
                                </button>
                                {apiKey.status === "active" && (
                                    <button
                                        onClick={() => revokeKey(apiKey.id)}
                                        className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-red-500/20 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground/70 hover:text-red-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </GlassCard>
            )}
        </div>
    );
}

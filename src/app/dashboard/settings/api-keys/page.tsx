"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, Copy, Plus, Trash2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ApiKey = {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed: string;
    status: "active" | "revoked";
};

const initialKeys: ApiKey[] = [
    { id: "1", name: "Stripe Live Key", key: "sk_live_51Abc...xYz", created: "Jan 12, 2026", lastUsed: "2h ago", status: "active" },
    { id: "2", name: "Resend API Key", key: "re_abc123...def", created: "Feb 3, 2026", lastUsed: "1d ago", status: "active" },
    { id: "3", name: "OpenAI Key", key: "sk-proj-abc...xyz", created: "Dec 8, 2025", lastUsed: "5m ago", status: "active" },
];

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newKey, setNewKey] = useState("");

    const toggleVisibility = (id: string) => {
        setVisibleKeys((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const copyKey = (id: string, key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const revokeKey = (id: string) => {
        setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)));
    };

    const addKey = () => {
        if (!newName.trim() || !newKey.trim()) return;
        const masked = newKey.slice(0, 8) + "..." + newKey.slice(-3);
        setKeys((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                name: newName.trim(),
                key: masked,
                created: "Just now",
                lastUsed: "Never",
                status: "active",
            },
        ]);
        setNewName("");
        setNewKey("");
        setShowAddForm(false);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors duration-300 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white/90">API Keys</h1>
                        <p className="text-sm text-white/50 mt-1">Manage your API keys for third-party integrations</p>
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
                    <h2 className="text-sm font-semibold text-white/80">Add New API Key</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Key name (e.g. Stripe)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Paste API key"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={addKey}
                            className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary/20"
                        >
                            Save Key
                        </button>
                        <button
                            onClick={() => { setShowAddForm(false); setNewName(""); setNewKey(""); }}
                            className="text-sm text-white/40 hover:text-white/70 px-4 py-2 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                    <p className="text-xs text-white/30">Keys are stored securely and masked after saving.</p>
                </GlassCard>
            )}

            {/* Keys list */}
            <GlassCard className="divide-y divide-white/[0.06]">
                {keys.map((apiKey) => (
                    <div key={apiKey.id} className="p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center border border-primary/8 shrink-0">
                            <Key className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-white/80">{apiKey.name}</p>
                                <span
                                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${apiKey.status === "active" ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
                                        }`}
                                >
                                    {apiKey.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/40">
                                <span className="font-mono text-white/50">
                                    {visibleKeys.has(apiKey.id) ? apiKey.key : "••••••••••••"}
                                </span>
                                <span>·</span>
                                <span>Created {apiKey.created}</span>
                                <span>·</span>
                                <span>Last used {apiKey.lastUsed}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                onClick={() => toggleVisibility(apiKey.id)}
                                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-all"
                            >
                                {visibleKeys.has(apiKey.id) ? (
                                    <EyeOff className="w-3.5 h-3.5 text-white/40" />
                                ) : (
                                    <Eye className="w-3.5 h-3.5 text-white/40" />
                                )}
                            </button>
                            <button
                                onClick={() => copyKey(apiKey.id, apiKey.key)}
                                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-all"
                            >
                                {copiedId === apiKey.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5 text-white/40" />
                                )}
                            </button>
                            {apiKey.status === "active" && (
                                <button
                                    onClick={() => revokeKey(apiKey.id)}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-red-500/20 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-white/40 hover:text-red-400" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </GlassCard>
        </div>
    );
}

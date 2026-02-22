"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Key, Plus, Eye, EyeOff, Copy, Check, Trash2, X } from "lucide-react";

interface ApiKeyItem {
    id: string;
    name: string;
    keyType: "external" | "platform";
    keyPrefix: string;
    maskedValue: string;
    status: "active" | "revoked";
    createdAt: string;
    lastUsedAt: string | null;
    revealedValue?: string;
}

const initialKeys: ApiKeyItem[] = [
    { id: "1", name: "Stripe Live Key", keyType: "external", keyPrefix: "sk_live_", maskedValue: "sk_live_••••••••••••", status: "active", createdAt: "2026-02-15", lastUsedAt: "2m ago", revealedValue: "sk_live_51J...4xR" },
    { id: "2", name: "Resend API Key", keyType: "external", keyPrefix: "re_", maskedValue: "re_••••••••••••", status: "active", createdAt: "2026-02-10", lastUsedAt: "18m ago" },
    { id: "3", name: "Zapier Integration", keyType: "platform", keyPrefix: "op_live_", maskedValue: "op_live_••••••••••••", status: "active", createdAt: "2026-02-01", lastUsedAt: "1h ago" },
];

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys);
    const [showForm, setShowForm] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [newKeyValue, setNewKeyValue] = useState("");
    const [newKeyType, setNewKeyType] = useState<"external" | "platform">("external");
    const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const addKey = () => {
        if (!newKeyName.trim()) return;

        const prefix = newKeyType === "platform" ? "op_live_" : newKeyValue.slice(0, 8);
        const masked = newKeyType === "platform"
            ? `op_live_${"•".repeat(20)}`
            : `${prefix}${"•".repeat(12)}`;

        const key: ApiKeyItem = {
            id: Date.now().toString(),
            name: newKeyName,
            keyType: newKeyType,
            keyPrefix: prefix,
            maskedValue: masked,
            status: "active",
            createdAt: new Date().toLocaleDateString(),
            lastUsedAt: null,
            revealedValue: newKeyType === "platform" ? `op_live_${Math.random().toString(36).slice(2, 26)}` : newKeyValue,
        };

        setKeys(prev => [key, ...prev]);
        setNewKeyName("");
        setNewKeyValue("");
        setShowForm(false);
    };

    const revokeKey = (id: string) => {
        setKeys(prev => prev.map(k => k.id === id ? { ...k, status: "revoked" as const } : k));
    };

    const toggleReveal = (id: string) => {
        setRevealedKeys(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const copyKey = (key: ApiKeyItem) => {
        const value = key.revealedValue || key.maskedValue;
        navigator.clipboard.writeText(value);
        setCopiedKey(key.id);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const externalKeys = keys.filter(k => k.keyType === "external");
    const platformKeys = keys.filter(k => k.keyType === "platform");

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <Link href="/dashboard/settings" className="text-xs text-dash-muted hover:text-primary transition-colors flex items-center gap-1 mb-3">
                    <ArrowLeft className="w-3 h-3" /> Back to Settings
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-dash-text">API Keys</h2>
                        <p className="text-dash-muted mt-1">Manage your integrations and platform access tokens.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-all"
                    >
                        {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {showForm ? "Cancel" : "Add Key"}
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-dash-card backdrop-blur-md border border-primary/20 rounded-2xl p-6 space-y-4">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setNewKeyType("external")}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${newKeyType === "external" ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/[0.02] border-white/[0.06] text-dash-muted"}`}
                        >
                            External Key (Your Service)
                        </button>
                        <button
                            onClick={() => setNewKeyType("platform")}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${newKeyType === "platform" ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/[0.02] border-white/[0.06] text-dash-muted"}`}
                        >
                            Platform Key (Originspillar)
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Key name (e.g. Stripe Live Key)"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 text-sm text-dash-text placeholder:text-dash-muted focus:outline-none focus:border-primary/40 transition-all"
                    />
                    {newKeyType === "external" && (
                        <input
                            type="password"
                            placeholder="Paste your API key"
                            value={newKeyValue}
                            onChange={(e) => setNewKeyValue(e.target.value)}
                            className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 text-sm text-dash-text placeholder:text-dash-muted focus:outline-none focus:border-primary/40 transition-all font-mono"
                        />
                    )}
                    {newKeyType === "platform" && (
                        <p className="text-xs text-amber-400 bg-amber-400/10 px-3 py-2 rounded-lg">
                            ⚠ A platform API key will be generated for you. It will only be shown once — copy it immediately.
                        </p>
                    )}
                    <div className="flex items-center gap-3">
                        <button onClick={addKey} disabled={!newKeyName.trim()} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-all disabled:opacity-40">
                            {newKeyType === "platform" ? "Generate Key" : "Save Key"}
                        </button>
                        <button onClick={() => setShowForm(false)} className="text-sm text-dash-muted hover:text-white">Cancel</button>
                    </div>
                    <p className="text-[10px] text-dash-muted/60">
                        🔒 Keys are encrypted at rest and never stored in plaintext after creation.
                    </p>
                </div>
            )}

            {/* External Keys */}
            <div>
                <h3 className="text-xs font-bold text-dash-muted uppercase tracking-wider mb-3">Your Service Keys</h3>
                <p className="text-xs text-dash-muted/60 mb-4">Connect your own API keys for Stripe, OpenAI, Resend, and other services.</p>
                <div className="space-y-2">
                    {externalKeys.length === 0 ? (
                        <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-8 text-center">
                            <p className="text-sm text-dash-muted">No external keys connected yet.</p>
                        </div>
                    ) : (
                        externalKeys.map(key => (
                            <KeyRow key={key.id} apiKey={key} revealed={revealedKeys.has(key.id)} copied={copiedKey === key.id} onToggle={() => toggleReveal(key.id)} onCopy={() => copyKey(key)} onRevoke={() => revokeKey(key.id)} />
                        ))
                    )}
                </div>
            </div>

            {/* Platform Keys */}
            <div>
                <h3 className="text-xs font-bold text-dash-muted uppercase tracking-wider mb-3">Platform Access Keys</h3>
                <p className="text-xs text-dash-muted/60 mb-4">Use these keys to let AI agents, Zapier, or webhooks interact with your Originspillar dashboard.</p>
                <div className="space-y-2">
                    {platformKeys.length === 0 ? (
                        <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-8 text-center">
                            <p className="text-sm text-dash-muted">No platform keys generated yet.</p>
                        </div>
                    ) : (
                        platformKeys.map(key => (
                            <KeyRow key={key.id} apiKey={key} revealed={revealedKeys.has(key.id)} copied={copiedKey === key.id} onToggle={() => toggleReveal(key.id)} onCopy={() => copyKey(key)} onRevoke={() => revokeKey(key.id)} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function KeyRow({ apiKey, revealed, copied, onToggle, onCopy, onRevoke }: {
    apiKey: ApiKeyItem;
    revealed: boolean;
    copied: boolean;
    onToggle: () => void;
    onCopy: () => void;
    onRevoke: () => void;
}) {
    return (
        <div className={`bg-dash-card backdrop-blur-md border rounded-2xl p-4 flex items-center gap-4 transition-all ${apiKey.status === "revoked" ? "border-white/[0.03] opacity-50" : "border-dash-border hover:border-white/[0.12]"}`}>
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                <Key className={`w-4 h-4 ${apiKey.status === "revoked" ? "text-dash-muted/40" : "text-primary"}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-dash-text">{apiKey.name}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${apiKey.status === "active" ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400"}`}>
                        {apiKey.status}
                    </span>
                </div>
                <p className="text-xs text-dash-muted font-mono mt-1 truncate">
                    {revealed && apiKey.revealedValue ? apiKey.revealedValue : apiKey.maskedValue}
                </p>
                <p className="text-[10px] text-dash-muted/60 mt-0.5">
                    Created {apiKey.createdAt}{apiKey.lastUsedAt ? ` · Last used ${apiKey.lastUsedAt}` : ""}
                </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={onToggle} className="p-2 rounded-lg text-dash-muted hover:text-white hover:bg-white/[0.06] transition-all">
                    {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={onCopy} className="p-2 rounded-lg text-dash-muted hover:text-white hover:bg-white/[0.06] transition-all">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                {apiKey.status === "active" && (
                    <button onClick={onRevoke} className="p-2 rounded-lg text-dash-muted hover:text-rose-400 hover:bg-rose-400/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

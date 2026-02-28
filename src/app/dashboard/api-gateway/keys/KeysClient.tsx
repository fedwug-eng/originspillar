"use client";

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Key,
    Copy,
    Check,
    AlertCircle,
    Plus,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { createGatewayKey, revokeGatewayKey } from './actions';
import { Label } from '@/components/ui/label';

interface ApiKey {
    id: string;
    keyPrefix: string;
    keyName: string;
    rateLimitRpm: number;
    rateLimitRpd: number;
    maxTokensPerRequest: number;
    status: string; // 'active' | 'revoked'
    lastUsedAt: Date | null;
    createdAt: Date;
}

export function KeysClient({ initialKeys }: { initialKeys: ApiKey[] }) {
    const [showNewKey, setShowNewKey] = useState(false);
    const [newKeyData, setNewKeyData] = useState<{ id: string; apiKey: string; keyName: string } | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const [newKeyName, setNewKeyName] = useState('');
    const [rpm, setRpm] = useState('60');
    const [rpd, setRpd] = useState('1000');

    const [creating, setCreating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    async function handleCreateKey() {
        if (!newKeyName.trim()) {
            toast.error('Please enter a name for your API key');
            return;
        }

        setCreating(true);
        try {
            const data = await createGatewayKey({
                keyName: newKeyName,
                rateLimitRpm: parseInt(rpm) || 60,
                rateLimitRpd: parseInt(rpd) || 1000,
            });

            setNewKeyData(data);
            setShowNewKey(true);
            setShowCreateDialog(false);
            setNewKeyName('');
            toast.success('API Key Created. Copy your API key now. You won\'t be able to see it again!');
        } catch {
            toast.error('Failed to create API key');
        } finally {
            setCreating(false);
        }
    }

    async function handleRevokeKey(keyId: string) {
        if (!confirm('Are you sure you want to revoke this API key? This will instantly break any applications using it.')) {
            return;
        }

        try {
            await revokeGatewayKey(keyId);
            toast.success('API Key Revoked. The API key has been securely revoked.');
        } catch {
            toast.error('Failed to revoke API key');
        }
    }

    async function copyKey(keyId: string, key: string) {
        await navigator.clipboard.writeText(key);
        setCopiedId(keyId);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success('API key copied to clipboard');
    }

    function getStatusColor(status: string) {
        if (status === 'active') return 'bg-emerald-500/10 text-emerald-600 border-none';
        if (status === 'revoked') return 'bg-red-500/10 text-red-600 border-none';
        return 'bg-gray-500/10 text-gray-600 border-none';
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gateway Keys</h2>
                    <p className="text-muted-foreground mt-2">
                        Issue platform API keys to your clients or developers with custom rate limits.
                    </p>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Gateway Key
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Issue New Gateway Key</DialogTitle>
                            <DialogDescription>
                                Gateway Keys allow clients to hit your API Proxy. The keys are cryptographically hashed and cannot be recovered if lost.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div>
                                <Label>Key Name</Label>
                                <Input
                                    placeholder="e.g., Acme Corp Production Key"
                                    className='mt-1.5'
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Requests Per Minute (RPM)</Label>
                                    <Input
                                        type="number"
                                        className='mt-1.5'
                                        value={rpm}
                                        onChange={(e) => setRpm(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Requests Per Day (RPD)</Label>
                                    <Input
                                        type="number"
                                        className='mt-1.5'
                                        value={rpd}
                                        onChange={(e) => setRpd(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateKey} disabled={creating}>
                                {creating ? 'Generating...' : 'Generate New Key'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Show new key once */}
            {newKeyData && showNewKey && (
                <Card className="border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-500/10 shadow-sm">
                    <CardHeader className='pb-3'>
                        <CardTitle className="flex items-center gap-2 text-lg text-yellow-600 dark:text-yellow-500">
                            <AlertCircle className="h-5 w-5" />
                            Important: Copy Your Gateway API Key
                        </CardTitle>
                        <CardDescription className='text-yellow-600/80 dark:text-yellow-500/80'>
                            We only store a secure cryptographic hash of this key. <strong>If you lose it, we cannot recover it.</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3 items-center">
                            <code className="flex-1 p-3 bg-background border rounded-lg font-mono text-sm break-all text-foreground shadow-inner">
                                {newKeyData.apiKey}
                            </code>
                            <Button
                                size="lg"
                                onClick={() => copyKey('new', newKeyData.apiKey)}
                            >
                                {copiedId === 'new' ? (
                                    <Check className="h-4 w-4 mr-2" />
                                ) : (
                                    <Copy className="h-4 w-4 mr-2" />
                                )}
                                {copiedId === 'new' ? 'Copied!' : 'Copy Key'}
                            </Button>
                        </div>
                        <div className='mt-4 flex justify-end'>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                                onClick={() => {
                                    setShowNewKey(false);
                                    setNewKeyData(null);
                                }}
                            >
                                I&apos;ve securely saved my key
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {initialKeys.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className='w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4'>
                            <Key className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight mb-2">No Gateway Keys Issued</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-md">
                            Issue your first highly secure API Key to allow your users or applications to consume AI inferences via your proxy.
                        </p>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Issue Gateway Key
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {initialKeys.map((key) => (
                        <Card key={key.id} className="border-border/60 hover:border-border transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1.5 w-full">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-lg">{key.keyName}</h3>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`px-2.5 py-0.5 ${getStatusColor(key.status)}`}>
                                                    {key.status.toUpperCase()}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className='h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                                                    onClick={() => handleRevokeKey(key.id)}
                                                    disabled={key.status === 'revoked'}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className='py-3'>
                                            <div className="inline-flex py-1 px-2.5 bg-accent/50 border rounded-md font-mono text-sm text-muted-foreground">
                                                {key.keyPrefix}••••••••••••••••••••••
                                            </div>
                                        </div>

                                        <div className="flex gap-5 text-xs text-muted-foreground border-t pt-3">
                                            <div className='flex flex-col'>
                                                <span className='font-medium text-foreground'>{key.rateLimitRpm}</span>
                                                <span>RPM</span>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='font-medium text-foreground'>{key.rateLimitRpd.toLocaleString()}</span>
                                                <span>RPD</span>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='font-medium text-foreground'>{key.maxTokensPerRequest.toLocaleString()}</span>
                                                <span>Max Tokens</span>
                                            </div>
                                        </div>
                                        {key.lastUsedAt && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Last used: {new Date(key.lastUsedAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

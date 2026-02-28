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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
    Server,
    Plus,
    Trash2,
    CheckCircle2 as CheckCircle,
    ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { OPENAI_MODELS, ANTHROPIC_MODELS, DEEPSEEK_MODELS } from '@/lib/providers';
import { addProviderCredential, deleteProviderCredential, toggleProviderCredential } from './actions';

interface Provider {
    id: string;
    provider: string;
    keyHint: string;
    isActive: boolean;
    models: string[];
    lastUsedAt: Date | null;
    createdAt: Date;
}

const PROVIDER_INFO = {
    openai: {
        name: 'OpenAI',
        description: 'GPT-4, GPT-3.5, DALL-E, and more',
        color: 'bg-green-500',
        link: 'https://platform.openai.com/api-keys',
        models: OPENAI_MODELS,
    },
    anthropic: {
        name: 'Anthropic',
        description: 'Claude 3 family of models',
        color: 'bg-orange-500',
        link: 'https://console.anthropic.com/settings/keys',
        models: ANTHROPIC_MODELS,
    },
    deepseek: {
        name: 'DeepSeek',
        description: 'DeepSeek Chat & Coder',
        color: 'bg-blue-500',
        link: 'https://platform.deepseek.com/api_keys',
        models: DEEPSEEK_MODELS,
    },
};

interface ProvidersClientProps {
    initialProviders: Provider[];
}

export function ProvidersClient({ initialProviders }: ProvidersClientProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleAddProvider() {
        if (!selectedProvider || !apiKey.trim()) {
            toast.error('Please select a provider and enter an API key.');
            return;
        }

        setSaving(true);
        try {
            await addProviderCredential({
                provider: selectedProvider,
                apiKey: apiKey.trim(),
                models: PROVIDER_INFO[selectedProvider as keyof typeof PROVIDER_INFO]?.models.map((m: any) => m.id || m) as string[],
                providerType: "builtin",
                apiFormat: selectedProvider,
            });

            setDialogOpen(false);
            setApiKey('');
            setSelectedProvider(null);
            toast.success(`${PROVIDER_INFO[selectedProvider as keyof typeof PROVIDER_INFO]?.name} has been added successfully.`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add provider.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteProvider(providerId: string, providerName: string) {
        if (!confirm(`Are you sure you want to remove ${providerName}? This will delete the API key from your account and all requests to this provider will fail immediately.`)) {
            return;
        }
        try {
            await deleteProviderCredential(providerId);
            toast.success(`${providerName} has been removed.`);
        } catch {
            toast.error('Failed to remove provider.');
        }
    }

    async function handleToggleProvider(providerId: string, isActive: boolean) {
        try {
            await toggleProviderCredential(providerId, isActive);
            toast.success(`The provider has been ${isActive ? 'enabled' : 'disabled'}.`);
        } catch {
            toast.error('Failed to update provider status.');
        }
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Providers</h2>
                    <p className="text-muted-foreground mt-2">
                        Configure your upstream AI provider API keys to serve inference through the Gateway.
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Provider
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add AI Provider</DialogTitle>
                            <DialogDescription>
                                Select a provider and enter your API key.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Provider</Label>
                                <div className="grid gap-2">
                                    {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedProvider(key)}
                                            className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${selectedProvider === key
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:bg-accent'
                                                }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${info.color}`} />
                                            <div className="text-left flex-1">
                                                <p className="font-medium">{info.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {info.description}
                                                </p>
                                            </div>
                                            {selectedProvider === key && (
                                                <CheckCircle className="w-5 h-5 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedProvider && (
                                <>
                                    <div className="space-y-2">
                                        <Label>API Key</Label>
                                        <Input
                                            type="password"
                                            placeholder={`Enter your ${PROVIDER_INFO[selectedProvider as keyof typeof PROVIDER_INFO]?.name} API key`}
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                        />
                                        <a
                                            href={PROVIDER_INFO[selectedProvider as keyof typeof PROVIDER_INFO]?.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                                        >
                                            Get your API key
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAddProvider} disabled={saving}>
                                {saving ? 'Adding...' : 'Add Provider'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Configured Providers */}
            <div className="grid gap-4">
                {initialProviders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Server className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No providers configured</h3>
                            <p className="text-sm text-muted-foreground text-center max-w-md">
                                Add your first AI provider to start routing API requests to models.
                                You can connect OpenAI, Anthropic, or DeepSeek safely here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    initialProviders.map((provider) => {
                        const info = PROVIDER_INFO[provider.provider as keyof typeof PROVIDER_INFO]
                        return (
                            <Card key={provider.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-4 h-4 rounded-full ${info?.color || 'bg-gray-500'}`} />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{info?.name || provider.provider}</h3>
                                                    <Badge
                                                        variant={provider.isActive ? 'default' : 'secondary'}
                                                        className={
                                                            provider.isActive
                                                                ? 'bg-green-500/10 text-green-600 border-green-200'
                                                                : ''
                                                        }
                                                    >
                                                        {provider.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Key: {provider.keyHint}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={provider.isActive}
                                                    onCheckedChange={(checked: boolean) =>
                                                        handleToggleProvider(provider.id, checked)
                                                    }
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {provider.isActive ? 'Enabled' : 'Disabled'}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                onClick={() => handleDeleteProvider(provider.id, info?.name || provider.provider)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Available Models */}
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm font-medium mb-2">Available Models</p>
                                        <div className="flex flex-wrap gap-2">
                                            {provider.models.slice(0, 8).map((model) => (
                                                <Badge key={model} variant="outline" className="font-mono text-xs shadow-none">
                                                    {model}
                                                </Badge>
                                            ))}
                                            {provider.models.length > 8 && (
                                                <Badge variant="outline" className="text-xs shadow-none">
                                                    +{provider.models.length - 8} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    );
}

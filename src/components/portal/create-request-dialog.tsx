"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { submitClientRequest } from "@/actions/portal-actions";
import { MagicButton } from "@/components/ui/magic-button";

export function CreateRequestDialog({ clientId, workspaceId }: { clientId: string, workspaceId: string }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        formData.append("clientId", clientId);
        formData.append("workspaceId", workspaceId);

        const result = await submitClientRequest(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Design request submitted! The agency has been notified.");
            setOpen(false);
        }

        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div>
                    <MagicButton variant="secondary" className="px-4 py-2 text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </MagicButton>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-white/10 text-white shadow-2xl">
                <form action={onSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Submit a Request</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Describe the task or design you need help with. This will go straight to the agency&apos;s Kanban board.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-zinc-300">Request Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Design a new checkout flow"
                                className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-zinc-300">Description & Details</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Provide as much context, links, or requirements as possible..."
                                className="min-h-[100px] bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading} className="border-white/10 text-zinc-300 hover:text-white hover:bg-white/10">
                            Cancel
                        </Button>
                        <MagicButton variant="primary" type="submit" disabled={isLoading} className="px-6">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Request
                        </MagicButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

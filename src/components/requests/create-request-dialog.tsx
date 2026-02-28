"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createRequest } from "@/app/actions/requests";

// We need to pass clients and services to default the dropdowns
export function CreateRequestDialog({
    clients,
    services,
}: {
    clients: { id: string; name: string }[];
    services: { id: string; name: string }[];
}) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const tag = formData.get("tag") as string;
        const clientId = formData.get("clientId") as string;
        const serviceIdRaw = formData.get("serviceId") as string;
        const serviceId = serviceIdRaw === "none" ? undefined : serviceIdRaw;

        try {
            await createRequest({ title, description, tag, clientId, serviceId });
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Task Request</DialogTitle>
                    <DialogDescription>
                        Add a new deliverable task to the kanban board.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Landing Page Hero Image"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="clientId">Client</Label>
                                <Select name="clientId" required>
                                    <SelectTrigger id="clientId">
                                        <SelectValue placeholder="Select client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tag">Tag (Category)</Label>
                                <Select name="tag" defaultValue="Design">
                                    <SelectTrigger id="tag">
                                        <SelectValue placeholder="Select tag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Development">Development</SelectItem>
                                        <SelectItem value="SEO">SEO</SelectItem>
                                        <SelectItem value="Content">Content</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="serviceId">Related Service (Optional)</Label>
                            <Select name="serviceId" defaultValue="none">
                                <SelectTrigger id="serviceId">
                                    <SelectValue placeholder="Attach to a service..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {services.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Details / Brief (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="What exactly needs to be done?"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || clients.length === 0}>
                            {isLoading ? "Saving..." : "Create Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

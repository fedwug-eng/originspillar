"use client";

import { useState } from "react";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { MagicButton } from "@/components/ui/magic-button";

interface CheckoutButtonProps {
    serviceId: string;
    workspaceId: string;
}

export function CheckoutButton({ serviceId, workspaceId }: CheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const onCheckout = async () => {
        try {
            setIsLoading(true);

            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serviceId,
                    workspaceId,
                }),
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const data = await response.json();

            // For MVP, we copy the link so the agency can send it to the client
            await navigator.clipboard.writeText(data.url);
            toast.success("Checkout link copied to clipboard");

            // Optional: Redirect the agency owner to test it themselves
            // window.location.assign(data.url);

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate checkout link");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <MagicButton variant="secondary" onClick={onCheckout} disabled={isLoading} className="w-full mt-4 text-xs h-9">
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <LinkIcon className="mr-2 h-4 w-4" />
            )}
            Copy Payment Link
        </MagicButton>
    )
}

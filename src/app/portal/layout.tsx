import { PropsWithChildren } from "react";
import Link from "next/link";
import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role !== "CLIENT") {
        return redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen flex-col bg-secondary/20 text-foreground font-sans">
            <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center shadow-md">
                        <span className="text-primary-foreground font-bold text-sm">O</span>
                    </div>
                    <span className="font-bold text-foreground">{user.workspace.name}</span>
                    <span className="text-[10px] font-semibold text-accent-foreground bg-accent px-2.5 py-1 rounded-full">Client Portal</span>
                </div>
                <UserButton afterSignOutUrl="/" />
            </header>
            <main className="flex-1 p-4 md:p-8">
                <div className="mx-auto max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

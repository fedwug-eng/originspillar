import { PropsWithChildren } from "react";
import Link from "next/link";
import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default async function PortalLayout({ children }: PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role !== "CLIENT") {
        return redirect("/dashboard");
    }

    // Pass the user's workspace down or allow the child pages to fetch what they need
    const workspace = user.workspace;

    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 font-sans selection:bg-violet-500/30">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                    <Link href="/portal" className="flex items-center space-x-2 font-bold tracking-tight">
                        {/* Dynamic White-labeling based on the Agency's Workspace Name */}
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                            <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        <span className="text-lg">{workspace.name} Client Portal</span>
                    </Link>
                    <nav className="flex items-center space-x-4">
                        <UserButton afterSignOutUrl="/" />
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto p-4 sm:p-8 relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

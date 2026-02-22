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
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 font-sans">
            <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
                        <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <span className="font-bold text-gray-900">{user.workspace.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Client Portal</span>
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

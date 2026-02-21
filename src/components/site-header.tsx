"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function SiteHeader() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            {siteConfig.name}
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className={`transition-colors hover:text-foreground/80 ${pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/services"
                            className={`transition-colors hover:text-foreground/80 ${pathname?.startsWith("/services") ? "text-foreground" : "text-foreground/60"
                                }`}
                        >
                            Services
                        </Link>
                        <Link
                            href="/clients"
                            className={`transition-colors hover:text-foreground/80 ${pathname?.startsWith("/clients") ? "text-foreground" : "text-foreground/60"
                                }`}
                        >
                            Clients
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Command menu can go here later */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignInButton mode="modal">
                                <Button size="sm">Get Started</Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9",
                                    },
                                }}
                            />
                        </SignedIn>
                    </nav>
                </div>
            </div>
        </header>
    );
}

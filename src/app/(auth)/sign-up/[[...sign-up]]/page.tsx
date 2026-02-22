import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden selection:bg-primary/30">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] opacity-15 pointer-events-none z-0">
                <div className="absolute inset-0 bg-primary blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-blue-400 blur-[120px] rounded-full mix-blend-screen translate-x-1/4" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center space-y-2">
                        <Image
                            src="/logo.png"
                            alt="Origins Pillar"
                            width={48}
                            height={48}
                            className="rounded-xl object-contain"
                            priority
                        />
                        <span className="text-2xl font-bold tracking-tight text-foreground">Origins Pillar</span>
                    </div>
                </div>

                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "mx-auto w-full",
                            card: "bg-card/80 border border-border backdrop-blur-xl shadow-2xl w-full",
                            headerTitle: "text-foreground",
                            headerSubtitle: "text-muted-foreground",
                            socialButtonsBlockButton: "border-border bg-background text-foreground hover:bg-accent",
                            socialButtonsBlockButtonText: "text-foreground font-medium",
                            dividerLine: "bg-border",
                            dividerText: "text-muted-foreground",
                            formFieldLabel: "text-foreground/80",
                            formFieldInput: "bg-background border-border text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary",
                            formButtonPrimary: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20",
                            footerActionText: "text-muted-foreground",
                            footerActionLink: "text-primary hover:text-primary/80",
                            identityPreviewText: "text-foreground",
                            identityPreviewEditButton: "text-primary hover:text-primary/80",
                        },
                        variables: {
                            colorBackground: "transparent",
                            colorPrimary: "#2563eb",
                            colorTextSecondary: "#64748b",
                        }
                    }}
                />
            </div>
        </div>
    );
}

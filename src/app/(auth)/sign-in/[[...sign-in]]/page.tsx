import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 relative overflow-hidden selection:bg-violet-500/30">
            {/* Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] opacity-20 pointer-events-none z-0">
                <div className="absolute inset-0 bg-violet-600 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-blue-600 blur-[120px] rounded-full mix-blend-screen translate-x-1/4" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                            <div className="h-3 w-3 rounded-full bg-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Originspillar</span>
                    </div>
                </div>

                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto w-full",
                            card: "bg-zinc-900/50 border border-white/5 backdrop-blur-xl shadow-2xl w-full",
                            headerTitle: "text-white",
                            headerSubtitle: "text-zinc-400",
                            socialButtonsBlockButton: "border-white/10 bg-zinc-950 text-white hover:bg-white/5",
                            socialButtonsBlockButtonText: "text-white font-medium",
                            dividerLine: "bg-white/10",
                            dividerText: "text-zinc-500",
                            formFieldLabel: "text-zinc-300",
                            formFieldInput: "bg-zinc-950 border-white/10 text-white placeholder-zinc-500 focus:ring-violet-500 focus:border-violet-500",
                            formButtonPrimary: "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.5)]",
                            footerActionText: "text-zinc-400",
                            footerActionLink: "text-violet-400 hover:text-violet-300",
                            identityPreviewText: "text-white",
                            identityPreviewEditButton: "text-violet-400 hover:text-violet-300",
                        },
                        variables: {
                            colorBackground: "transparent",
                            colorText: "white",
                            colorPrimary: "#8b5cf6",
                            colorTextSecondary: "#a1a1aa",
                            colorInputBackground: "#09090b",
                            colorInputText: "white",
                        }
                    }}
                />
            </div>
        </div>
    );
}

import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, MessageSquare, CreditCard, ShieldCheck } from "lucide-react";
import { MagicButton } from "@/components/ui/magic-button";
import { Reveal } from "@/components/magic/reveal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-violet-500/30 overflow-x-hidden">

      {/* 1. Navigation Bar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Originspillar</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/sign-in" className="hover:text-white transition-colors">Login</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hidden md:inline-flex text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up">
              <MagicButton variant="secondary" className="px-5 py-2 text-xs">
                Start Free Trial
              </MagicButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">

        {/* 2. Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Subtle glowing aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20 pointer-events-none z-0">
            <div className="absolute inset-0 bg-violet-600 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-0 bg-blue-600 blur-[120px] rounded-full mix-blend-screen translate-x-1/4 animate-pulse" style={{ animationDuration: '6s' }} />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">

            <Reveal direction="down">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-300 mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:border-violet-500/50 transition-colors cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-pulse" />
                Originspillar 1.0 is now live
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 mb-6 drop-shadow-sm">
                Run your productized agency on autopilot.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-10">
                Replace Stripe, Trello, and Slack with a single, white-labeled client portal. Originspillar gives you the enterprise polish to scale your agency without the admin chaos.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <MagicButton variant="primary" className="w-full sm:w-auto h-14 text-base">
                    Get Started for Free <ArrowRight className="w-4 h-4" />
                  </MagicButton>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <MagicButton variant="outline" className="w-full sm:w-auto h-14 text-base backdrop-blur-sm">
                    View Demo
                  </MagicButton>
                </Link>
              </div>
            </Reveal>

            {/* Abstract Dashboard Mockup */}
            <Reveal delay={0.5} direction="up">
              <div className="mt-20 w-full max-w-5xl rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-2xl shadow-2xl p-4 md:p-8 transform perspective-[1500px] rotate-x-6 hover:rotate-x-0 transition-transform duration-700 ease-out group">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none rounded-2xl z-20" />
                <div className="h-6 w-full flex items-center gap-2 border-b border-white/5 pb-4 mb-6 relative z-10">
                  <div className="h-3 w-3 rounded-full bg-red-500/20 group-hover:bg-red-500/80 transition-colors" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/80 transition-colors" />
                  <div className="h-3 w-3 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <div className="col-span-1 border border-white/5 rounded-xl bg-white/5 p-6 h-64 flex flex-col space-y-4">
                    <div className="h-4 w-24 bg-white/10 rounded-md" />
                    <div className="h-10 w-full bg-white/5 rounded-md" />
                    <div className="h-10 w-full bg-white/5 rounded-md" />
                    <div className="flex-1" />
                    <div className="h-16 w-full bg-violet-600/20 rounded-md border border-violet-500/30 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-50" />
                    </div>
                  </div>
                  <div className="col-span-2 border border-white/5 rounded-xl bg-white/5 p-6 h-64 flex flex-col space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[50px] mix-blend-screen" />
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 w-32 bg-white/10 rounded-md" />
                      <div className="h-8 w-24 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex-1 flex gap-4">
                      <div className="w-1/3 bg-white/5 hover:bg-white/10 transition-colors rounded-lg flex flex-col gap-2 p-2"><div className="h-12 w-full bg-white/10 rounded-md"></div><div className="h-12 w-full bg-white/10 rounded-md"></div></div>
                      <div className="w-1/3 bg-white/5 rounded-lg flex flex-col gap-2 p-2"><div className="h-12 w-full bg-blue-500/20 border border-blue-500/30 rounded-md shadow-[0_0_15px_rgba(59,130,246,0.15)]"></div></div>
                      <div className="w-1/3 bg-white/5 rounded-lg flex flex-col gap-2 p-2"><div className="h-12 w-full bg-green-500/20 border border-green-500/30 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.15)]"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. Bento Box Features Grid */}
        <section id="features" className="py-24 md:py-32 relative border-t border-white/5 bg-zinc-950">
          <div className="container mx-auto px-6">
            <Reveal>
              <div className="max-w-3xl mb-16">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                  Everything your agency needs.<br />
                  <span className="text-zinc-500">Nothing you don&apos;t.</span>
                </h2>
                <p className="text-lg text-zinc-400">
                  Consolidated tools mean less context switching for you, and a premium, frictionless experience for your clients.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1 (Large) */}
              <Reveal delay={0.1}>
                <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between overflow-hidden relative group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 mb-12 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <CreditCard className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">One-Click Checkouts</h3>
                    <p className="text-zinc-400 max-w-sm">Clients buy your services directly with Stripe. Subscriptions and invoices are handled automatically.</p>
                  </div>
                  <div className="relative z-10 w-full h-32 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-4 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="w-5 h-5" /> Payment Successful: $5,000.00
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Box 2 (Medium) */}
              <Reveal delay={0.2}>
                <div className="md:col-span-1 border-white/10 bg-white/5 p-8 flex flex-col justify-between relative group rounded-3xl h-full border hover:border-violet-500/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-bl from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  <div className="relative z-10 flex flex-col h-full justify-between transform group-hover:translate-x-2 transition-transform duration-500">
                    <div>
                      <ShieldCheck className="w-8 h-8 text-violet-400 mb-4 drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                      <h3 className="text-2xl font-bold text-white mb-2">Magic Routing</h3>
                      <p className="text-zinc-400">Separate views for your internal team and your clients securely.</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Box 3 (Medium) */}
              <Reveal delay={0.3}>
                <div className="md:col-span-1 rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between relative group h-full hover:border-pink-500/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  <div className="relative z-10 flex flex-col h-full justify-between transform group-hover:translate-x-2 transition-transform duration-500">
                    <div>
                      <MessageSquare className="w-8 h-8 text-pink-400 mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
                      <h3 className="text-2xl font-bold text-white mb-2">In-App Chat</h3>
                      <p className="text-zinc-400">Kill the email thread. Talk to clients directly on the specific task card.</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Box 4 (Large) */}
              <Reveal delay={0.4}>
                <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between overflow-hidden relative group h-full">
                  <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 md:w-1/2 mb-8 md:mb-0 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <LayoutDashboard className="w-8 h-8 text-emerald-400 mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                    <h3 className="text-2xl font-bold text-white mb-2">Drag &amp; Drop Kanban</h3>
                    <p className="text-zinc-400">Manage requests visually. Your clients see status updates in real-time as you drag cards across the board.</p>
                  </div>
                  {/* Abstract Kanban UI snippet */}
                  <div className="absolute -bottom-10 -right-10 md:top-8 md:-right-10 w-[400px] h-[300px] bg-zinc-900 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-4 rotate-[-5deg] group-hover:rotate-0 group-hover:-translate-x-4 group-hover:-translate-y-4 transition-all duration-700 ease-out">
                    <div className="flex gap-4 h-full">
                      <div className="w-1/2 rounded-lg bg-zinc-800/50 p-2 space-y-2">
                        <div className="h-4 w-16 bg-zinc-700 rounded mb-4" />
                        <div className="h-16 w-full bg-zinc-700/50 border border-zinc-600 rounded-md" />
                        <div className="h-16 w-full bg-zinc-700/50 border border-zinc-600 rounded-md" />
                      </div>
                      <div className="w-1/2 rounded-lg bg-emerald-900/20 border border-emerald-500/30 p-2 space-y-2">
                        <div className="h-4 w-16 bg-emerald-500/50 rounded mb-4 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <div className="h-20 w-full bg-zinc-800 border border-emerald-500/40 rounded-md shadow-[0_0_20px_rgba(16,185,129,0.2)] transform -translate-y-4 scale-105" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* 4. Pricing Section */}
        <section id="pricing" className="py-24 md:py-40 relative border-t border-white/5 bg-zinc-950 flex flex-col items-center">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Stop paying for 5 different apps.</h2>
              <p className="text-xl text-zinc-400 mb-16 max-w-2xl mx-auto">
                Consolidate your tech stack and look like a Fortune 500 agency for less than the cost of a Slack premium seat.
              </p>
            </Reveal>

            {/* Glowing Pricing Card */}
            <Reveal delay={0.2} direction="up">
              <div className="mx-auto max-w-lg rounded-3xl border border-violet-500/30 bg-zinc-900/80 backdrop-blur-xl p-10 md:p-12 shadow-[0_0_80px_-15px_rgba(139,92,246,0.3)] relative overflow-hidden group hover:border-violet-500/60 transition-colors">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200px] bg-violet-600/20 blur-[60px] pointer-events-none group-hover:bg-violet-600/30 transition-colors" />

                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-violet-400 mb-4 uppercase tracking-wider">Pro Agency Plan</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-extrabold text-white group-hover:scale-105 transition-transform drop-shadow-lg">$49</span>
                    <span className="text-xl text-zinc-400 font-medium">/ month</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-8 pb-8 border-b border-white/10 w-full text-center">
                    Flat rate. No per-seat hidden fees.
                  </p>

                  <ul className="space-y-4 w-full text-left mb-10">
                    {[
                      "Unlimited Clients",
                      "Unlimited Design Requests",
                      "Stripe Payment Integration",
                      "Custom Subscription Tiers",
                      "Priority Email Support"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300">
                        <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/sign-up" className="w-full">
                    <MagicButton variant="secondary" className="w-full h-14 text-lg">
                      Start 14-Day Free Trial
                    </MagicButton>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      {/* 5. Minimal Footer */}
      <footer className="w-full border-t border-white/5 bg-zinc-950 py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            &copy; 2026 Originspillar. Built for productized agencies.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Twitter (X)</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

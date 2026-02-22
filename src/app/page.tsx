import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, MessageSquare, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Originspillar</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/sign-in" className="hover:text-gray-900 transition-colors">Login</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden md:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors shadow-md">
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-40 md:pb-28">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-white to-white pointer-events-none" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-violet-200/30 to-indigo-200/30 blur-[100px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Originspillar 1.0 is now live
            </div>

            <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-gray-900 mb-6">
              Run your productized agency on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">autopilot.</span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-gray-500 leading-relaxed mb-10">
              Replace Stripe, Trello, and Slack with a single, white-labeled client portal. Originspillar gives you the enterprise polish to scale your agency without the admin chaos.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/sign-up" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white px-8 py-4 text-base font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                Get Started for Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#features" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-gray-700 px-8 py-4 text-base font-semibold hover:bg-gray-50 transition-all shadow-sm">
                View Demo
              </Link>
            </div>

            {/* Abstract Dashboard Mockup */}
            <div className="mt-20 w-full max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50 p-4 md:p-8 transform perspective-[1500px]">
              <div className="h-6 w-full flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 border border-gray-100 rounded-xl bg-gray-50 p-6 h-56 flex flex-col space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded-md" />
                  <div className="h-10 w-full bg-gray-100 rounded-md" />
                  <div className="h-10 w-full bg-gray-100 rounded-md" />
                  <div className="flex-1" />
                  <div className="h-14 w-full bg-gradient-to-r from-violet-100 to-indigo-100 rounded-md border border-violet-200" />
                </div>
                <div className="col-span-2 border border-gray-100 rounded-xl bg-gray-50 p-6 h-56 flex flex-col space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-32 bg-gray-200 rounded-md" />
                    <div className="h-8 w-24 bg-gray-200 rounded-full" />
                  </div>
                  <div className="flex-1 flex gap-3">
                    <div className="w-1/3 bg-white rounded-lg flex flex-col gap-2 p-2 border border-gray-100"><div className="h-12 w-full bg-gray-100 rounded-md"></div><div className="h-12 w-full bg-gray-100 rounded-md"></div></div>
                    <div className="w-1/3 bg-white rounded-lg flex flex-col gap-2 p-2 border border-gray-100"><div className="h-12 w-full bg-blue-50 border border-blue-200 rounded-md"></div></div>
                    <div className="w-1/3 bg-white rounded-lg flex flex-col gap-2 p-2 border border-gray-100"><div className="h-12 w-full bg-emerald-50 border border-emerald-200 rounded-md"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32 relative border-t border-gray-100 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
                Everything your agency needs.<br />
                <span className="text-gray-400">Nothing you don&apos;t.</span>
              </h2>
              <p className="text-lg text-gray-500">
                Consolidated tools mean less context switching for you, and a premium, frictionless experience for your clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-8 flex flex-col justify-between overflow-hidden relative group hover:shadow-lg transition-shadow h-full">
                <div className="relative z-10 mb-8">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">One-Click Checkouts</h3>
                  <p className="text-gray-500 max-w-sm">Clients buy your services directly with Stripe. Subscriptions and invoices are handled automatically.</p>
                </div>
                <div className="relative z-10 w-full h-24 bg-emerald-50 border border-emerald-200 rounded-xl overflow-hidden p-4 flex items-center justify-center">
                  <div className="flex items-center gap-3 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5" /> Payment Successful: $5,000.00
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-1 rounded-2xl border border-gray-200 bg-white p-8 flex flex-col justify-between relative group h-full hover:shadow-lg transition-shadow">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Magic Routing</h3>
                  <p className="text-gray-500">Separate views for your internal team and your clients securely.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-1 rounded-2xl border border-gray-200 bg-white p-8 flex flex-col justify-between relative group h-full hover:shadow-lg transition-shadow">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">In-App Chat</h3>
                  <p className="text-gray-500">Kill the email thread. Talk to clients directly on the specific task card.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-8 flex flex-col justify-between overflow-hidden relative group h-full hover:shadow-lg transition-shadow">
                <div className="relative z-10 md:w-1/2 mb-8 md:mb-0">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                    <LayoutDashboard className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Drag &amp; Drop Kanban</h3>
                  <p className="text-gray-500">Manage requests visually. Your clients see status updates in real-time as you drag cards across the board.</p>
                </div>
                {/* Mini Kanban */}
                <div className="absolute -bottom-8 -right-8 md:top-8 md:-right-8 w-[350px] h-[250px] bg-gray-50 border border-gray-200 rounded-2xl shadow-lg p-4 rotate-[-3deg] group-hover:rotate-0 group-hover:-translate-x-2 transition-all duration-500">
                  <div className="flex gap-3 h-full">
                    <div className="w-1/2 rounded-lg bg-white p-2 space-y-2 border border-gray-100">
                      <div className="h-3 w-14 bg-gray-200 rounded mb-3" />
                      <div className="h-14 w-full bg-gray-100 border border-gray-200 rounded-md" />
                      <div className="h-14 w-full bg-gray-100 border border-gray-200 rounded-md" />
                    </div>
                    <div className="w-1/2 rounded-lg bg-emerald-50 border border-emerald-200 p-2 space-y-2">
                      <div className="h-3 w-14 bg-emerald-200 rounded mb-3" />
                      <div className="h-16 w-full bg-white border border-emerald-200 rounded-md shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 md:py-40 relative border-t border-gray-100 bg-white flex flex-col items-center">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">Stop paying for 5 different apps.</h2>
            <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto">
              Consolidate your tech stack and look like a Fortune 500 agency for less than the cost of a Slack premium seat.
            </p>

            {/* Pricing Card */}
            <div className="mx-auto max-w-lg rounded-2xl border-2 border-violet-200 bg-white p-10 md:p-12 shadow-xl shadow-violet-100/50 relative overflow-hidden group hover:border-violet-400 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />

              <div className="flex flex-col items-center">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 uppercase tracking-wider bg-violet-50 px-3 py-1 rounded-full mb-6">
                  <Zap className="h-3 w-3" /> Most Popular
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Pro Agency Plan</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-extrabold text-gray-900">$49</span>
                  <span className="text-xl text-gray-400 font-medium">/ month</span>
                </div>
                <p className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100 w-full text-center">
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
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/sign-up" className="w-full inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-6 py-4 text-base font-semibold hover:bg-gray-800 transition-all shadow-lg">
                  Start 14-Day Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 bg-gray-50 py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; 2026 Originspillar. Built for productized agencies.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Twitter (X)</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

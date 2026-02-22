"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Zap } from "lucide-react";

const useCountUp = (target: number, duration = 1000) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as any, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return { count, ref };
};

const tiers = [
  {
    name: "Starter",
    monthlyPrice: 29,
    yearlyPrice: 23,
    description: "For solo operators getting started",
    features: ["Up to 5 clients", "Unlimited requests", "Stripe checkout", "Client portal", "Email support"],
    featured: false,
  },
  {
    name: "Pro",
    monthlyPrice: 79,
    yearlyPrice: 63,
    description: "For growing agencies that need more",
    features: ["Unlimited clients", "Unlimited requests", "Priority support", "Custom branding", "Team members (5)", "API access", "Analytics dashboard"],
    featured: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 199,
    yearlyPrice: 159,
    description: "For agencies at scale",
    features: ["Everything in Pro", "Unlimited team members", "SSO / SAML", "Dedicated account manager", "Custom integrations", "SLA guarantee", "White-glove onboarding"],
    featured: false,
  },
];

const PricingCard = ({ tier, i, isAnnual }: { tier: typeof tiers[0]; i: number; isAnnual: boolean }) => {
  const price = isAnnual ? tier.yearlyPrice : tier.monthlyPrice;
  const { count, ref } = useCountUp(price, 1200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      className={`relative rounded-2xl p-8 transition-all duration-500 ${
        tier.featured
          ? "bg-card border-2 border-primary/30 shadow-2xl shadow-primary/10 scale-[1.03] z-10"
          : "bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/15 hover:-translate-y-1"
      }`}
    >
      {tier.featured && (
        <>
          <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-accent rounded-t-2xl" />
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30"
            >
              <Zap className="w-3 h-3" /> Most Popular
            </motion.span>
          </div>
          <div className="absolute -inset-4 rounded-3xl bg-primary/[0.02] pointer-events-none -z-10" />
        </>
      )}

      <h3 className="text-lg font-bold text-foreground mb-1">{tier.name}</h3>
      <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

      <div className="mb-8">
        <span className="text-5xl font-extrabold text-foreground" ref={ref}>
          ${count}
        </span>
        <span className="text-muted-foreground ml-1">/month</span>
        {isAnnual && (
          <p className="text-xs text-op-emerald font-medium mt-1">Billed annually</p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
          tier.featured
            ? "bg-gradient-accent text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            : "bg-secondary text-secondary-foreground hover:bg-muted border border-border"
        }`}
      >
        Start 14-Day Free Trial
      </motion.button>
    </motion.div>
  );
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 lg:py-32 relative bg-noise section-glow">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground">Start free. Upgrade when you're ready.</p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-14"
        >
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isAnnual ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-sm transition-transform duration-300 ${isAnnual ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            Annual
          </span>
          {isAnnual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-semibold text-op-emerald bg-op-emerald/10 px-2.5 py-0.5 rounded-full"
            >
              Save 20%
            </motion.span>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) => (
            <PricingCard key={tier.name} tier={tier} i={i} isAnnual={isAnnual} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

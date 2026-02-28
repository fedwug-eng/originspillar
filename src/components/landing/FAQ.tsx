"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does the 14-day free trial work?",
    a: "Sign up with no credit card required. You get full access to all Pro features for 14 days. If you love it, choose a plan. If not, no strings attached.",
  },
  {
    q: "Can my clients see the Origins Pillar branding?",
    a: "No. Your client portal is fully white-labeled. Clients see your agency name, your brand colors, and your domain. Origins Pillar stays invisible.",
  },
  {
    q: "How does payment processing work?",
    a: "We integrate directly with Stripe. You connect your Stripe account, set prices on your services, and clients pay through a seamless checkout experience. Funds go straight to your Stripe account.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Each workspace is logically isolated. We conduct regular security reviews and never access your client data.",
  },
  {
    q: "Can I migrate from my current tools?",
    a: "Yes. Most agencies complete the switch in a single afternoon. We provide import guides for common tools, and our support team can assist with the transition.",
  },
  {
    q: "What integrations do you support?",
    a: "Origins Pillar integrates with Stripe for payments, Slack for notifications, and supports webhooks for custom integrations. Our API is available on Pro and Enterprise plans.",
  },
];

const FAQItem = ({ faq, isOpen, onClick, index }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className={`relative border border-border rounded-2xl overflow-hidden transition-all duration-500 ${
      isOpen ? "bg-secondary/50 border-primary/15 shadow-lg shadow-primary/[0.03]" : "hover:bg-secondary/30 hover:border-primary/10"
    }`}
  >
    {/* Left accent */}
    <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-accent transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`} />

    <button
      onClick={onClick}
      className="w-full flex items-center justify-between text-left px-6 py-5 gap-4"
    >
      <span className="font-semibold text-foreground">{faq.q}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="shrink-0"
      >
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </motion.div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-5 text-muted-foreground leading-relaxed">{faq.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 lg:py-32 relative section-glow">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            FAQ
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-muted-foreground">Everything you need to know.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

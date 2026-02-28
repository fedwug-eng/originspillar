"use client";
import { motion } from "framer-motion";
import { UserPlus, Settings, Send } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Sign Up",
    description: "Create your account in 30 seconds. Your workspace is automatically provisioned.",
  },
  {
    icon: Settings,
    number: "02",
    title: "Set Up Services",
    description: "Add your service packages with pricing. Stripe connects automatically for billing.",
  },
  {
    icon: Send,
    number: "03",
    title: "Invite Clients",
    description: "Share your branded portal link. Clients get a premium, white-labeled experience.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 lg:py-32 bg-secondary/60 relative overflow-hidden section-glow">
    <div className="absolute inset-0 bg-dot-grid opacity-15 pointer-events-none" />

    <div className="relative max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          How it works
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Up and running in minutes
        </h2>
        <p className="text-xl text-muted-foreground">Three steps to transform your agency operations.</p>
      </motion.div>

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-20 left-[16.66%] right-[16.66%] h-px">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 origin-left"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center group"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                className="relative w-40 h-40 mx-auto mb-8"
              >
                {/* Outer glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                {/* Card bg */}
                <div className="absolute inset-0 bg-card border border-border rounded-2xl shadow-lg group-hover:shadow-xl group-hover:border-primary/15 transition-all duration-500" />
                {/* Gradient interior */}
                <div className="absolute inset-3 rounded-xl bg-gradient-accent flex flex-col items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-[10px] font-bold text-primary-foreground/60 tracking-[0.2em] uppercase">{step.number}</span>
                  <step.icon className="w-8 h-8 text-primary-foreground mt-1" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;

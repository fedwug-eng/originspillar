"use client";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const Footer = () => (
  <footer className="bg-secondary/60 border-t border-border">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">O</span>
            </div>
            <span className="font-bold text-foreground tracking-tight">Originspillar</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The operating system for modern productized agencies.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Originspillar. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to home
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground mb-12">Effective Date: February 22, 2026</p>

                <div className="prose prose-gray max-w-none space-y-8 text-muted-foreground leading-relaxed text-sm">
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
                        <h3 className="text-base font-semibold text-foreground mb-2 mt-4">Information you provide:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Account information: name, email address, company name</li>
                            <li>Payment information: processed and stored by Stripe (we never see full card numbers)</li>
                            <li>Content: requests, comments, files, and other data you upload to the Service</li>
                            <li>Communications: emails or messages you send to our support team</li>
                        </ul>
                        <h3 className="text-base font-semibold text-foreground mb-2 mt-4">Information collected automatically:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Log data: IP address, browser type, operating system, referring URLs</li>
                            <li>Usage data: pages viewed, features used, time spent in the Service</li>
                            <li>Device data: device type, screen resolution, language preferences</li>
                            <li>Cookies: session tokens, authentication tokens, preference cookies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Provide, maintain, and improve the Service</li>
                            <li>Process transactions and send related information</li>
                            <li>Send technical notices, updates, and security alerts</li>
                            <li>Respond to your comments and support requests</li>
                            <li>Monitor and analyze usage trends to improve user experience</li>
                            <li>Detect, prevent, and address technical issues and abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">3. Data Sharing</h2>
                        <p className="mb-2">We do not sell your personal information. We share data only with:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Service providers who assist us in operating the Service (Clerk, Stripe, Supabase, Cloudflare, Resend)</li>
                            <li>Law enforcement when required by law or to protect our legal rights</li>
                            <li>Business transfers in the event of a merger, acquisition, or asset sale</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">4. Data Security</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                            <li>Authentication tokens are managed by Clerk with industry-standard security</li>
                            <li>Database connections use connection pooling with SSL enforcement</li>
                            <li>We conduct regular security reviews and monitor for vulnerabilities</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">5. Data Retention</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Account data is retained for the lifetime of your account</li>
                            <li>Upon account deletion, personal data is removed within 30 days</li>
                            <li>Aggregated, anonymized analytics data may be retained indefinitely</li>
                            <li>Backup data is purged within 90 days of deletion</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">6. Your Rights</h2>
                        <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Access the personal data we hold about you</li>
                            <li>Correct inaccurate or incomplete data</li>
                            <li>Delete your personal data (&ldquo;right to be forgotten&rdquo;)</li>
                            <li>Export your data in a portable format</li>
                            <li>Object to processing of your data for marketing purposes</li>
                            <li>Restrict processing of your data under certain circumstances</li>
                        </ul>
                        <p className="mt-2">To exercise any of these rights, contact us at: <a href="mailto:privacy@originspillar.com" className="text-primary hover:underline">privacy@originspillar.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">7. Cookies</h2>
                        <p className="mb-2">We use essential cookies for:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Authentication and session management (Clerk session tokens)</li>
                            <li>Security and fraud prevention</li>
                            <li>User preference storage</li>
                        </ul>
                        <p className="mt-2">We do not use third-party advertising or tracking cookies.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">8. International Data Transfers</h2>
                        <p>Your data may be processed in data centers located in the United States, Europe, and Asia-Pacific regions. We ensure appropriate safeguards for international transfers.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">9. Children&apos;s Privacy</h2>
                        <p>The Service is not intended for users under 18 years of age. We do not knowingly collect data from children.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">10. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">11. Contact Us</h2>
                        <p>For privacy-related inquiries:</p>
                        <p className="mt-2">Email: <a href="mailto:privacy@originspillar.com" className="text-primary hover:underline">privacy@originspillar.com</a></p>
                        <p>Address: Originspillar LLC, Dubai, United Arab Emirates</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

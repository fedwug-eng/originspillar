import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to home
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
                <p className="text-muted-foreground mb-12">Effective Date: February 22, 2026</p>

                <div className="prose prose-gray max-w-none space-y-8 text-muted-foreground leading-relaxed text-sm">
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">1. Agreement to Terms</h2>
                        <p>By accessing or using Originspillar (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you do not have permission to access the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Service</h2>
                        <p>Originspillar is a cloud-based agency management platform that provides tools for client management, project tracking, payment processing, and client portal services. The Service is provided on a subscription basis.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">3. Accounts</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You must be at least 18 years old to use this Service</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                            <li>You are responsible for all activities that occur under your account</li>
                            <li>You must provide accurate and complete registration information</li>
                            <li>One person or legal entity may maintain no more than one free account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">4. Billing &amp; Payments</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Paid plans are billed in advance on a monthly basis</li>
                            <li>All fees are exclusive of applicable taxes</li>
                            <li>We use Stripe as our payment processor; your payment information is handled by Stripe and subject to Stripe&apos;s terms of service</li>
                            <li>Refunds are available within 14 days of initial purchase if you have not used the Service beyond initial setup</li>
                            <li>We reserve the right to change pricing with 30 days&apos; notice</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">5. Client Data &amp; Workspaces</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Each workspace&apos;s data is logically isolated from other workspaces</li>
                            <li>You retain full ownership of all content you upload to the Service</li>
                            <li>We do not access, use, or share your client data except as necessary to provide the Service</li>
                            <li>Upon account termination, your data will be retained for 30 days and then permanently deleted</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">6. Acceptable Use</h2>
                        <p className="mb-2">You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Use the Service for any illegal or unauthorized purpose</li>
                            <li>Violate any laws in your jurisdiction</li>
                            <li>Upload malicious code, viruses, or harmful content</li>
                            <li>Attempt to gain unauthorized access to other users&apos; accounts or data</li>
                            <li>Use the Service to send spam or unsolicited communications</li>
                            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                            <li>Resell or redistribute the Service without written permission</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">7. Service Availability</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We strive for 99.9% uptime but do not guarantee uninterrupted service</li>
                            <li>Scheduled maintenance will be communicated 48 hours in advance</li>
                            <li>We are not liable for any downtime, data loss, or service interruptions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">8. Intellectual Property</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The Service, including its original content, features, and functionality, is owned by Originspillar and protected by international copyright and trademark laws</li>
                            <li>Your content remains yours; by uploading content, you grant us a limited license to process and display it within the Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">9. Third-Party Services</h2>
                        <p className="mb-2">The Service integrates with third-party services including Clerk, Stripe, Supabase, Cloudflare R2, and Resend. Your use of these services is subject to their respective terms and privacy policies.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">10. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law, Originspillar shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunity.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">11. Termination</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You may terminate your account at any time via the Settings page</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                            <li>Upon termination, your right to use the Service ceases immediately</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">12. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Material changes will be communicated via email or in-app notification at least 30 days before they take effect.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">13. Governing Law</h2>
                        <p>These terms are governed by the laws of the United Arab Emirates. Any disputes shall be resolved in the courts of Dubai.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">14. Contact</h2>
                        <p>For questions about these Terms, contact us at: <a href="mailto:legal@originspillar.com" className="text-primary hover:underline">legal@originspillar.com</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
}

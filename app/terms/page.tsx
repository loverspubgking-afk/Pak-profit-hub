import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Scale, FileText } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = 'July 10, 2026';

  return (
    <div className="min-h-screen bg-[#05080C]">
      {/* Premium Top Bar */}
      <div className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[#05080C]/95 backdrop-blur-xl">
        <div className="shell-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-[var(--emerald-light)] hover:text-white transition-colors">
            ← Pak Profit Hub
          </Link>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[2px] text-[var(--text-muted)]">
            LEGAL • PAKISTAN
          </div>
        </div>
      </div>

      <div className="shell-container pt-12 pb-24">
        <div className="terms-container">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="mt-1 p-3 rounded-2xl bg-[rgba(16,185,129,0.12)] text-[var(--emerald)]">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <div className="uppercase tracking-[3px] text-[var(--emerald)] text-xs font-semibold mb-1">OFFICIAL DOCUMENTS</div>
              <h1 className="text-5xl font-bold tracking-tighter leading-none">Terms &amp; Conditions</h1>
              <p className="mt-2 text-lg text-[var(--text-muted)]">Last updated: {lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-white/90">
            <div className="mb-10 p-6 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-white/70">
                Welcome to <strong>Pak Profit Hub</strong>. By accessing or using our platform, you agree to be bound by these Terms &amp; Conditions. 
                Please read them carefully before creating an account or using any of our services.
              </p>
            </div>

            {/* Section 1 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4 flex items-center gap-3">
              <FileText className="text-[var(--emerald)]" size={22} /> 1. Acceptance of Terms
            </h2>
            <p>
              These Terms constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;) and Pak Profit Hub (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;). 
              By registering an account, making a deposit, purchasing any plan, or using any feature of the platform, you acknowledge that you have read, understood, and agree to these Terms.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">2. Eligibility &amp; Account Registration</h2>
            <ul className="space-y-2 pl-5">
              <li>You must be at least 18 years of age and legally capable of entering into contracts under the laws of Pakistan.</li>
              <li>You agree to provide accurate, current, and complete information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your password and all activities that occur under your account.</li>
              <li>One account per individual. Multiple accounts may result in permanent suspension.</li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">3. Platform Services</h2>
            <p>
              Pak Profit Hub provides a daily earning platform where users may purchase fixed-value investment plans. 
              Earnings are generated according to the published plan details. All deposits are subject to manual review and approval by our team.
            </p>
            <p className="mt-3">We do not guarantee any specific returns. All earnings shown are projected based on the plan parameters chosen by the user.</p>

            {/* Section 4 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">4. Deposits, Withdrawals &amp; Payments</h2>
            <ul className="space-y-2 pl-5">
              <li>All deposits must be made using the approved payment methods listed on the platform.</li>
              <li>Deposits are manually verified. Processing times may vary (typically 1–48 hours).</li>
              <li>Withdrawals are subject to our minimum withdrawal limit and approval process.</li>
              <li>You must provide accurate bank or wallet details. We are not responsible for funds sent to incorrect accounts.</li>
              <li>Fraudulent activity, chargebacks, or misuse will result in immediate account termination and forfeiture of funds.</li>
            </ul>

            {/* Section 5 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">5. Plans, Earnings &amp; Collections</h2>
            <p>
              Each plan has a fixed investment amount, daily earning rate, duration, and total payout. 
              Earnings are collected manually by the user once per 24-hour cycle. 
              Plans are non-transferable and non-refundable once activated.
            </p>

            {/* Section 6 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">6. Referral Program</h2>
            <p>
              Referral bonuses are only credited after your referred user completes their first approved deposit. 
              The bonus amount is determined by current platform settings and may change without notice.
            </p>

            {/* Section 7 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="space-y-1 pl-5 mt-2">
              <li>Engage in any fraudulent, abusive, or illegal activity</li>
              <li>Manipulate earnings, create fake accounts, or attempt to exploit the system</li>
              <li>Share your account credentials or use another person’s account</li>
              <li>Upload misleading or false information</li>
            </ul>

            {/* Section 8 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or permanently terminate any account at our sole discretion, 
              including but not limited to violations of these Terms, suspected fraud, or suspicious activity. 
              In such cases, any remaining balance may be forfeited.
            </p>

            {/* Section 9 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Pak Profit Hub, its owners, and affiliates shall not be liable for any direct, indirect, incidental, 
              special, or consequential damages arising from the use or inability to use the platform, including loss of profits or data.
            </p>

            {/* Section 10 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">10. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the revised Terms. 
              We will notify users of material changes via email or platform announcement.
            </p>

            {/* Section 11 */}
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. 
              Any disputes shall be resolved exclusively in the courts of Lahore, Pakistan.
            </p>

            <div className="my-12 p-8 rounded-3xl bg-gradient-to-br from-[rgba(16,185,129,0.06)] to-transparent border border-[rgba(16,185,129,0.2)]">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-[var(--emerald)]" />
                <div className="font-semibold">Contact &amp; Disputes</div>
              </div>
              <p className="text-sm text-white/70">
                For questions regarding these Terms, please contact us at <a href="mailto:support@pakprofithub.com" className="text-[var(--emerald)] underline">support@pakprofithub.com</a> or through the in-app Support section.
              </p>
            </div>

            <div className="text-xs text-white/40 mt-8 border-t border-white/10 pt-8">
              © {new Date().getFullYear()} Pak Profit Hub. All rights reserved. This document is the property of Pak Profit Hub.
            </div>
          </div>

          <div className="terms-footer flex flex-col sm:flex-row items-center gap-4">
            <Link href="/signup" className="btn btn-primary flex-1 sm:flex-none justify-center">
              I understand — Back to Signup
            </Link>
            <Link href="/" className="btn btn-ghost flex-1 sm:flex-none justify-center">
              <ArrowLeft size={16} /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

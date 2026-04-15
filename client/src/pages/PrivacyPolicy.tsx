import { NavBar } from "@/components/NavBar";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: "#0A1A2F" }}>
      <NavBar />

      {/* Hero header */}
      <div className="py-12 px-4 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: "#F8F5EF", fontFamily: "'Playfair Display', serif" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm" style={{ color: "#C9A86A", fontFamily: "'DM Sans', sans-serif" }}>
          <strong>Wishes Without Borders Co.</strong>
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(248,245,239,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
          Last Updated: April 13, 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p className="mb-10 leading-relaxed" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
          Wishes Without Borders Co. ("we," "us," or "our") is operated by Jump 448 LLC, located in Statesboro, Georgia.
          We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your
          information when you visit wisheswithoutbordersco.com and purchase our digital products.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            1. Information We Collect
          </h2>
          <p className="font-semibold mb-2" style={{ color: "#F8F5EF", fontFamily: "'DM Sans', sans-serif" }}>
            Information you provide to us:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4" style={{ color: "rgba(248,245,239,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
            <li>Name and email address when completing a purchase</li>
            <li>Billing information processed securely through Stripe</li>
            <li>Email address if you subscribe to our mailing list</li>
          </ul>
          <p className="font-semibold mb-2" style={{ color: "#F8F5EF", fontFamily: "'DM Sans', sans-serif" }}>
            Information collected automatically:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4" style={{ color: "rgba(248,245,239,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
            <li>Browser type and device information</li>
            <li>Pages visited and time spent on site</li>
            <li>IP address and general location data</li>
            <li>Referring website or search terms</li>
          </ul>
          <p style={{ color: "rgba(248,245,239,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            We do not collect payment card numbers directly. All payment processing is handled by Stripe, Inc. under their
            own privacy policy and security standards.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            2. How We Use Your Information
          </h2>
          <p className="mb-2" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4" style={{ color: "rgba(248,245,239,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
            <li>Process and deliver your digital product purchases</li>
            <li>Send your PDF download links via email</li>
            <li>Respond to customer service inquiries</li>
            <li>Send occasional product updates or promotions (only if you opt in)</li>
            <li>Improve our website and product offerings</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p style={{ color: "rgba(248,245,239,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            We do not sell, rent, or trade your personal information to third parties.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            3. Digital Product Delivery
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            When you purchase a digital download, we collect your email address to deliver your product. Your purchase
            receipt and download link are sent to the email address you provide at checkout. We retain order records for
            accounting and legal compliance purposes.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            4. Cookies
          </h2>
          <p className="mb-3" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            Our website uses cookies to improve your browsing experience. Cookies are small text files stored on your
            device. We use cookies to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4" style={{ color: "rgba(248,245,239,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
            <li>Remember items in your cart</li>
            <li>Understand how visitors use our site</li>
            <li>Improve site performance</li>
          </ul>
          <p style={{ color: "rgba(248,245,239,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            You can disable cookies in your browser settings. Some features of the site may not function properly if
            cookies are disabled.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            5. Third-Party Services
          </h2>
          <p className="mb-3" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            We use the following third-party services which have their own privacy policies:
          </p>
          <ul className="list-disc pl-6 space-y-1" style={{ color: "rgba(248,245,239,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
            <li>
              <strong style={{ color: "#F8F5EF" }}>Stripe</strong> — payment processing (stripe.com/privacy)
            </li>
            <li>
              <strong style={{ color: "#F8F5EF" }}>Netlify</strong> — website hosting (netlify.com/privacy)
            </li>
            <li>
              <strong style={{ color: "#F8F5EF" }}>Amazon CloudFront</strong> — digital file delivery
            </li>
            <li>
              <strong style={{ color: "#F8F5EF" }}>Google Analytics</strong> — website traffic analysis (if enabled)
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            6. Data Security
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            We take reasonable measures to protect your personal information. All payment transactions are encrypted via
            SSL. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            7. Children's Privacy
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            Our website is not directed to children under the age of 13. We do not knowingly collect personal information
            from children under 13. If you believe we have inadvertently collected such information, please contact us
            immediately.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            8. Your Rights
          </h2>
          <p className="mb-2" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4" style={{ color: "rgba(248,245,239,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>
          <p style={{ color: "rgba(248,245,239,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:info@wisheswithoutbordersco.com" className="hover:underline" style={{ color: "#C9A86A" }}>
              info@wisheswithoutbordersco.com
            </a>.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            9. Changes to This Policy
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
            Continued use of the site after changes are posted constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            10. Contact Us
          </h2>
          <p className="mb-2" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <div className="mt-3" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            <p className="font-semibold" style={{ color: "#F8F5EF" }}>Wishes Without Borders Co.</p>
            <p>Jump 448 LLC</p>
            <p>Statesboro, Georgia</p>
            <p>
              Email:{" "}
              <a href="mailto:info@wisheswithoutbordersco.com" className="hover:underline" style={{ color: "#C9A86A" }}>
                info@wisheswithoutbordersco.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a href="https://wisheswithoutbordersco.com" className="hover:underline" style={{ color: "#C9A86A" }}>
                wisheswithoutbordersco.com
              </a>
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex justify-center gap-6 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Link href="/terms-of-service" className="hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>
            Terms of Service
          </Link>
          <Link href="/" className="hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>
            Home
          </Link>
        </div>
        <p style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 Wishes Without Borders Co. · All rights reserved.
        </p>
      </footer>
    </div>
  );
}

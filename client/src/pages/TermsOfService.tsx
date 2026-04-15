import { NavBar } from "@/components/NavBar";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen" style={{ background: "#0A1A2F" }}>
      <NavBar />

      {/* Hero header */}
      <div className="py-12 px-4 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: "#F8F5EF", fontFamily: "'Playfair Display', serif" }}
        >
          Terms of Service
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
          Please read these Terms of Service carefully before purchasing from or using wisheswithoutbordersco.com. By
          accessing our website or purchasing our products, you agree to be bound by these terms.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            1. About Us
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            Wishes Without Borders Co. is owned and operated by Jump 448 LLC, a limited liability company based in
            Statesboro, Georgia. Our website sells digital download products including multicultural greeting cards, wall
            art, flashcards, workbooks, children's books, cookbooks, and related educational materials.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            2. Digital Products & Instant Downloads
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            All products sold on wisheswithoutbordersco.com are digital downloads only. No physical items are shipped.
            Upon completing a purchase you will receive an email with your download link. Your PDF files will be available
            for immediate download. Download links are valid for 30 days from the date of purchase.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            3. License & Permitted Use
          </h2>
          <p className="mb-4" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            When you purchase a digital product you receive a personal, non-exclusive, non-transferable license for
            personal use only. You may print the file for personal use and give it as a gift.
          </p>
          <p className="mb-4" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            You may <strong style={{ color: "#F8F5EF" }}>NOT</strong> resell, redistribute, share, or use the files
            commercially. School License holders receive expanded rights as outlined in their specific license agreement.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            4. Refund Policy
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            All sales are final due to the instant digital nature of our products. If you did not receive your download
            link within 24 hours, or if the file is corrupted, contact{" "}
            <a href="mailto:info@wisheswithoutbordersco.com" className="hover:underline" style={{ color: "#C9A86A" }}>
              info@wisheswithoutbordersco.com
            </a>{" "}
            with your order number and we will resolve it promptly.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            5. Pricing
          </h2>
          <p className="mb-3" style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            All prices are in USD.
          </p>
          <ul className="list-disc pl-6 space-y-1" style={{ color: "rgba(248,245,239,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
            <li>Greeting Cards: $5.99</li>
            <li>Flashcards: $8.99</li>
            <li>Workbooks: $11.99</li>
            <li>Wall Art: $9.99 (8x10) / $14.99 (11x14)</li>
            <li>Children's Books: $14.99</li>
            <li>Cookbooks: $14.99</li>
            <li>School License: $299/year</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            6. Intellectual Property
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            All designs, illustrations, text, logos, and product images are the intellectual property of Wishes Without
            Borders Co. and Jump 448 LLC. All rights reserved. Unauthorized reproduction or distribution is strictly
            prohibited.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            7. Limitation of Liability
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            To the fullest extent permitted by law, Wishes Without Borders Co. and Jump 448 LLC shall not be liable for
            any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid for
            the product in question.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            8. Governing Law
          </h2>
          <p style={{ color: "rgba(248,245,239,0.85)", fontFamily: "'DM Sans', sans-serif" }}>
            These terms are governed by the laws of the State of Georgia. Any disputes shall be subject to the
            jurisdiction of the courts of Bulloch County, Georgia.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A86A", fontFamily: "'Playfair Display', serif" }}>
            9. Contact Us
          </h2>
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
          <Link href="/privacy-policy" className="hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>
            Privacy Policy
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

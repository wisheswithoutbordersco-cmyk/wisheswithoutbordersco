import { NavBar } from "@/components/NavBar";
import { Globe } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <NavBar />

      <main className="py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#1a2744]/10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a2744] mb-8 font-serif">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none text-[#1a2744]/80 space-y-6">
            <p className="text-sm font-bold text-[#d4af37] uppercase tracking-wider">Last Updated: April 15, 2026</p>

            <p>
              At Wishes Without Borders Co, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website and purchase our products.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact information (such as name and email address) when you make a purchase or sign up for our newsletter.</li>
              <li>Payment information (processed securely through our payment providers).</li>
              <li>Order history and preferences.</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders for digital downloads and physical products.</li>
              <li>Communicate with you about your orders, products, and promotional offers.</li>
              <li>Improve and optimize our website and customer experience.</li>
              <li>Comply with legal obligations.</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">4. Third-Party Services</h2>
            <p>
              We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you (such as payment processors and email service providers). These parties agree to keep this information confidential.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. If you wish to exercise any of these rights or have questions about our privacy practices, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:info@wisheswithoutbordersco.com" className="text-[#d4af37] hover:underline font-bold">info@wisheswithoutbordersco.com</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2744] text-white/60 text-center py-10 text-sm">
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#d4af37]" />
            <span className="text-white font-semibold">Wishes Without Borders Co</span>
          </div>
          <p>Multicultural greeting cards & educational tools · All products are instant digital downloads</p>
          <p className="mt-1">
            <a href="mailto:info@wisheswithoutbordersco.com" className="text-[#d4af37] hover:underline">
              info@wisheswithoutbordersco.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

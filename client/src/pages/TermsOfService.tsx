import { NavBar } from "@/components/NavBar";
import { Globe } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <NavBar />

      <main className="py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#1a2744]/10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a2744] mb-8 font-serif">Terms of Service</h1>

          <div className="prose prose-lg max-w-none text-[#1a2744]/80 space-y-6">
            <p className="text-sm font-bold text-[#d4af37] uppercase tracking-wider">Last Updated: April 15, 2026</p>

            <p>
              Welcome to Wishes Without Borders Co. By accessing or using our website and purchasing our products, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">1. Digital Products and Downloads</h2>
            <p>
              Our digital products (including greeting cards, flashcards, and activity kits) are provided as instant PDF downloads. Due to the nature of digital products, all sales are final and non-refundable once the download link has been provided.
            </p>
            <p>
              When you purchase a digital product, you are granted a personal, non-exclusive, non-transferable license to use the product for personal, non-commercial purposes. You may not resell, redistribute, or share the digital files.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">2. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to designs, artwork, text, graphics, logos, and images, is the property of Wishes Without Borders Co and is protected by copyright and other intellectual property laws. You may not reproduce, modify, or distribute our content without our explicit written permission.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">3. User Conduct</h2>
            <p>
              You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">4. Pricing and Availability</h2>
            <p>
              All prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of our products.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">5. Disclaimer of Warranties</h2>
            <p>
              Our products and website are provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that our website will be uninterrupted, secure, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">6. Limitation of Liability</h2>
            <p>
              In no event shall Wishes Without Borders Co be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of our website or products.
            </p>

            <h2 className="text-2xl font-bold text-[#1a2744] font-serif mt-8 mb-4">7. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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

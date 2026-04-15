import { NavBar } from "@/components/NavBar";
import { Link } from "wouter";

const PRINT_SHOP_CATEGORIES = [
  {
    href: "/print-shop/wall-art",
    title: "Wall Art",
    subtitle: "Cultural prints for every room",
    icon: "🖼️",
  },
  {
    href: "/print-shop/country",
    title: "Country Prints",
    subtitle: "Celebrate your heritage",
    icon: "🌍",
  },
  {
    href: "/print-shop/kids",
    title: "Kids' Room",
    subtitle: "Bright, joyful, educational",
    icon: "🎨",
  },
  {
    href: "/print-shop/teacher",
    title: "Teacher Prints",
    subtitle: "Classroom-ready cultural art",
    icon: "📚",
  },
  {
    href: "/print-shop/holidays",
    title: "Holiday Prints",
    subtitle: "Seasonal celebrations worldwide",
    icon: "🎉",
  },
  {
    href: "/print-shop/special-editions",
    title: "Special Editions",
    subtitle: "Limited & collector prints",
    icon: "✨",
  },
];

export default function PrintShopPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <NavBar />

      {/* Hero */}
      <div className="bg-[#0A1A2F] py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-3">
            Wishes Without Borders Co
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white leading-tight mb-4">
            The Print Shop
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Museum-quality cultural prints, delivered to your door — powered by Gelato.
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-[#C9A86A] py-4 px-4 text-center">
        <p className="text-[#0A1A2F] font-bold text-sm">
          🚀 Coming Soon — Launching with Gelato Print-on-Demand
        </p>
      </div>

      {/* Category Grid */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold font-serif text-[#0A1A2F] text-center mb-2">
          Browse by Category
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          Explore what's coming to the Print Shop
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRINT_SHOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group bg-white rounded-2xl border border-[#e8dfc8] p-8 flex flex-col items-center text-center hover:shadow-lg hover:border-[#C9A86A] transition-all"
            >
              <span className="text-4xl mb-4">{cat.icon}</span>
              <h3 className="text-lg font-bold font-serif text-[#0A1A2F] mb-1 group-hover:text-[#C9A86A] transition-colors">
                {cat.title}
              </h3>
              <p className="text-gray-500 text-sm">{cat.subtitle}</p>
              <span className="mt-4 text-xs font-semibold text-[#C9A86A] uppercase tracking-widest">
                Coming Soon
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Gelato Partnership Note */}
      <div className="bg-[#F8F5EF] py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-serif text-[#0A1A2F] mb-3">
            Powered by Gelato
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-xl mx-auto">
            Every print will be fulfilled through Gelato's global print network — museum-quality paper,
            archival inks, and delivery to 200+ countries. No inventory. No waste. Just beautiful prints
            that celebrate culture.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A1A2F] text-white/60 text-center py-10 text-sm px-6">
        <div className="border-t border-white/10 pt-6 max-w-5xl mx-auto">
          <p className="text-white font-semibold mb-1">Wishes Without Borders Co</p>
          <p>Multicultural prints &amp; digital products · Powered by Gelato</p>
          <p className="mt-1">
            <a href="mailto:info@wisheswithoutbordersco.com" className="text-[#C9A86A] hover:underline">
              info@wisheswithoutbordersco.com
            </a>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            <Link href="/" className="hover:text-[#C9A86A] transition-colors">Home</Link>
            <Link href="/print-shop" className="hover:text-[#C9A86A] transition-colors">Print Shop</Link>
            <Link href="/birthday" className="hover:text-[#C9A86A] transition-colors">Digital Shop</Link>
            <Link href="/kids-classroom" className="hover:text-[#C9A86A] transition-colors">Kids</Link>
            <Link href="/kids-classroom" className="hover:text-[#C9A86A] transition-colors">Teachers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

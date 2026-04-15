import { NavBar } from "@/components/NavBar";
import { Link } from "wouter";

interface PrintShopCategoryPageProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export function PrintShopCategoryPage({ title, subtitle, description, icon }: PrintShopCategoryPageProps) {
  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <NavBar />

      {/* Hero */}
      <div className="bg-[#0A1A2F] py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <Link href="/print-shop" className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-3 inline-block hover:underline">
            ← Print Shop
          </Link>
          <div className="text-5xl mb-4">{icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">{subtitle}</p>
        </div>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-2xl border border-[#e8dfc8] p-12 shadow-sm">
          <div className="w-16 h-16 bg-[#F8F5EF] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#0A1A2F] mb-3">
            Coming Soon — Launching with Gelato
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/print-shop"
              className="px-6 py-3 bg-[#0A1A2F] text-white font-bold rounded-full hover:bg-[#12203a] transition-colors text-sm"
            >
              ← Back to Print Shop
            </Link>
            <Link
              href="/birthday"
              className="px-6 py-3 bg-[#C9A86A] text-[#0A1A2F] font-bold rounded-full hover:bg-[#c9a227] transition-colors text-sm"
            >
              Shop Digital Downloads
            </Link>
          </div>
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

// Individual category page exports
export function PrintShopWallArtPage() {
  return (
    <PrintShopCategoryPage
      title="Wall Art"
      subtitle="Cultural prints for every room"
      icon="🖼️"
      description="Stunning cultural wall art prints celebrating countries and traditions from around the world. Museum-quality paper, archival inks, ships globally through Gelato."
    />
  );
}

export function PrintShopCountryPage() {
  return (
    <PrintShopCategoryPage
      title="Country Prints"
      subtitle="Celebrate your heritage"
      icon="🌍"
      description="Beautiful country-specific art prints — flags, landmarks, cultural symbols, and more. Perfect for celebrating your roots or honoring a loved one's heritage."
    />
  );
}

export function PrintShopKidsPage() {
  return (
    <PrintShopCategoryPage
      title="Kids' Room"
      subtitle="Bright, joyful, educational"
      icon="🎨"
      description="Colorful, culturally rich prints designed for children's rooms and nurseries. Spark curiosity about the world from day one."
    />
  );
}

export function PrintShopTeacherPage() {
  return (
    <PrintShopCategoryPage
      title="Teacher Prints"
      subtitle="Classroom-ready cultural art"
      icon="📚"
      description="Classroom-ready prints that celebrate global cultures and diversity. Perfect for bulletin boards, reading corners, and SEL displays."
    />
  );
}

export function PrintShopHolidaysPage() {
  return (
    <PrintShopCategoryPage
      title="Holiday Prints"
      subtitle="Seasonal celebrations worldwide"
      icon="🎉"
      description="Seasonal and holiday prints from cultures around the world — Eid, Diwali, Lunar New Year, Christmas, Kwanzaa, and more."
    />
  );
}

export function PrintShopSpecialEditionsPage() {
  return (
    <PrintShopCategoryPage
      title="Special Editions"
      subtitle="Limited & collector prints"
      icon="✨"
      description="Limited-run and collector's edition prints featuring exclusive artwork. Each edition celebrates a specific culture, moment, or milestone."
    />
  );
}

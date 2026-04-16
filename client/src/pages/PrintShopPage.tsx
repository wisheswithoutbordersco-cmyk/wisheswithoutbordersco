import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { WALL_ART_PRINTS } from "@/lib/productData";
import { Search, Printer, Truck, Package, Globe } from "lucide-react";
import {
  PhysicalPrintModal,
  type PhysicalPrintProduct,
} from "@/components/PhysicalPrintModal";

export default function PrintShopPage() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<PhysicalPrintProduct | null>(null);

  const filtered = WALL_ART_PRINTS.filter((c) =>
    c.country.toLowerCase().includes(search.toLowerCase()),
  );

  function handleCardClick(card: (typeof WALL_ART_PRINTS)[number]) {
    setSelectedProduct({
      productId: card.id,
      name: card.name,
      image: card.image,
      country: card.country,
    });
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />

      {/* Hero */}
      <div className="bg-[#1a2744] text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Printer className="w-6 h-6 text-[#d4af37]" />
          <span className="text-[#d4af37] font-semibold text-xs uppercase tracking-widest">
            WishesWithoutBordersco Print Shop
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">
          Physical Wall Art Prints
        </h1>
        <p className="text-[#d4af37] text-lg mb-2">
          30 Countries · Museum-Quality Matte Posters
        </p>
        <p className="text-white/60 text-sm max-w-2xl mx-auto">
          Order a professionally printed wall art poster shipped directly to your
          door. Produced by Gelato's global print network — printed at the
          facility nearest to you for fast, eco-friendly delivery.
        </p>
      </div>

      {/* Features bar */}
      <div className="bg-[#d4af37]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[#1a2744] text-xs font-semibold">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Printer className="w-3.5 h-3.5" /> Premium Matte Print
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Package className="w-3.5 h-3.5" /> 2 Sizes: 8×10" &amp; 11×14"
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Truck className="w-3.5 h-3.5" /> Ships Worldwide
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Globe className="w-3.5 h-3.5" /> 30 Countries Available
          </span>
        </div>
      </div>

      {/* Search + Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Pricing callout */}
        <div className="max-w-xl mx-auto mb-6 bg-white rounded-2xl shadow-sm border border-[#e8dfc8] p-4 text-center">
          <p className="text-sm text-[#1a2744] font-semibold mb-1">
            Simple Pricing — No Hidden Fees
          </p>
          <div className="flex items-center justify-center gap-6">
            <div>
              <span className="text-2xl font-bold text-[#1a2744]">$9.99</span>
              <span className="text-xs text-gray-500 ml-1">8×10" print</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-2xl font-bold text-[#1a2744]">$14.99</span>
              <span className="text-xs text-gray-500 ml-1">11×14" print</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Shipping calculated at checkout · Secure payment via Stripe
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-md mx-auto mb-8">
          <Search className="text-gray-400 w-4 h-4 shrink-0" />
          <input
            placeholder="Search by country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#d4af37]/40 focus:border-[#d4af37] rounded-lg px-3 py-2 text-sm outline-none transition-colors"
          />
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No prints found for &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer"
              onClick={() => handleCardClick(card)}
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={card.image}
                  alt={`${card.country} wall art print`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/300x400/f5f0e8/1a2744?text=Art";
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Printer className="w-3 h-3" />
                    Order Print
                  </div>
                </div>
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-semibold text-[#1a2744] truncate">
                  {card.country}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  From{" "}
                  <span className="text-[#d4af37] font-bold">$9.99</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-[#1a2744] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold font-serif text-white text-center mb-8">
            How Physical Prints Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🎨",
                title: "Choose Your Art",
                desc: "Pick your country and select your preferred print size — 8×10\" or 11×14\".",
              },
              {
                step: "02",
                icon: "💳",
                title: "Secure Checkout",
                desc: "Enter your shipping address and pay securely via Stripe. No account needed.",
              },
              {
                step: "03",
                icon: "📦",
                title: "Delivered to You",
                desc: "Gelato prints your poster at the nearest facility and ships it directly to your door.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-4">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="absolute -top-2 -right-4 bg-[#d4af37] text-[#1a2744] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Physical Print Modal */}
      {selectedProduct && (
        <PhysicalPrintModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

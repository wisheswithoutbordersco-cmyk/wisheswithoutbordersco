import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { ShoppingCart, Baby } from "lucide-react";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/TYed9Vpg2AWmRK9jSnP39i";
const CDN3 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M";

const PACKS = [
  {
    id: "baby_shower_games_40",
    title: "40 Game Bundle",
    subtitle: "Best Value",
    price: 1499,
    badge: "Best Value",
    badgeColor: "bg-[#C9A86A] text-[#0A1A2F]",
    image: `${CDN}/multicultural_baby_shower_bundle_preview.jpg`,
    description: "The ultimate baby shower party pack! 40 printable games including bingo, trivia, word scrambles, and more. Perfect for large gatherings. Instant PDF download.",
    highlight: true,
  },
  {
    id: "baby_shower_games_30",
    title: "30 Game Bundle",
    subtitle: "Most Popular",
    price: 1199,
    badge: "Most Popular",
    badgeColor: "bg-[#8b1a4a] text-white",
    image: `${CDN}/multicultural_baby_shower_bundle_preview.jpg`,
    description: "30 printable baby shower games for a fun-filled celebration. Includes bingo, trivia, guessing games, and more. Instant PDF download.",
    highlight: false,
  },
  {
    id: "baby_shower_games_20",
    title: "20 Game Bundle",
    subtitle: "Great for medium parties",
    price: 899,
    badge: null,
    badgeColor: "",
    image: `${CDN}/multicultural_baby_shower_bundle_preview.jpg`,
    description: "20 printable baby shower games — the perfect mix of bingo, trivia, and activity games for medium-sized parties. Instant PDF download.",
    highlight: false,
  },
  {
    id: "baby_shower_games_10",
    title: "10 Game Starter Pack",
    subtitle: "Perfect for intimate gatherings",
    price: 599,
    badge: "Starter Pack",
    badgeColor: "bg-[#1a3a5c] text-white",
    image: `${CDN}/multicultural_baby_shower_bundle_preview.jpg`,
    description: "10 essential printable baby shower games. Perfect for intimate gatherings. Includes the most-loved games from our full collection. Instant PDF download.",
    highlight: false,
  },
];

export default function BabyShowerPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <NavBar />

      {/* Header */}
      <div className="bg-[#0A1A2F] text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Baby className="w-7 h-7 text-[#C9A86A]" />
          <span className="text-[#C9A86A] font-semibold text-sm uppercase tracking-widest">Baby Shower Games</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Printable Baby Shower Games</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Fun, ready-to-print game packs for your baby shower celebration. Choose the size that fits your party.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-white/60">
          <span>🎉 Bingo, trivia, word scrambles & more</span>
          <span>🖨️ Print at home</span>
          <span>⚡ Instant PDF download</span>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border cursor-pointer group ${
                pack.highlight ? "border-[#C9A86A] ring-2 ring-[#d4af37]/30" : "border-gray-100"
              }`}
              onClick={() =>
                setSelectedProduct({
                  productId: pack.id,
                  name: `Baby Shower Games — ${pack.title}`,
                  image: pack.image,
                  price: pack.price,
                  category: "baby_shower",
                  description: pack.description,
                })
              }
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <img
                  src={pack.image}
                  alt={pack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E";
                  }}
                />
                {pack.badge && (
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${pack.badgeColor}`}>
                    {pack.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-[#0A1A2F]/0 group-hover:bg-[#0A1A2F]/20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#0A1A2F] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    View & Buy
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#0A1A2F] text-base leading-tight">{pack.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{pack.subtitle}</p>
                  </div>
                  <p className="text-lg font-bold text-[#C9A86A] shrink-0">
                    ${(pack.price / 100).toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-2">{pack.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What's included note */}
        <div className="mt-10 bg-[#0A1A2F]/5 rounded-2xl p-6 border border-[#C9A86A]/20">
          <p className="text-[#0A1A2F] font-semibold text-sm mb-2">What's included in every pack:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>✅ Bingo cards (multiple versions)</li>
            <li>✅ Trivia questions</li>
            <li>✅ Word scrambles & crosswords</li>
            <li>✅ Guessing games</li>
            <li>✅ Activity sheets</li>
            <li>✅ Printable in black & white or color</li>
          </ul>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* Footer */}
      <footer className="bg-[#0A1A2F] text-white/60 text-center py-8 text-sm mt-8">
        <p className="italic text-[#C9A86A]/70 text-sm mb-4">Send a piece of home, back home.</p>
        <p className="text-white font-semibold mb-1">Wishes Without Borders Co</p>
        <p>Printable baby shower games · All products are instant digital downloads</p>
        <p className="mt-1">
          <a href="mailto:info@wisheswithoutbordersco.com" className="text-[#C9A86A] hover:underline">
            info@wisheswithoutbordersco.com
          </a>
        </p>
      </footer>
    </div>
  );
}

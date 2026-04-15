import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { SYMPATHY_CARDS, IN_LOVING_MEMORY_CARDS } from "@/lib/productData";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";

const TABS = [
  { key: "sympathy", label: "Sympathy", cards: SYMPATHY_CARDS },
  { key: "memory", label: "In Loving Memory", cards: IN_LOVING_MEMORY_CARDS },
];

const PRICE = 599; // $5.99

export default function SympathyPage() {
  const [tab, setTab]       = useState("sympathy");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const current  = TABS.find((t) => t.key === tab)!;
  const filtered = current.cards.filter((c) =>
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  function handleCardClick(card: { id: string; country: string; image: string }) {
    setSelectedProduct({
      productId: card.id,
      name: `${card.country} ${current.label} Card`,
      image: card.image,
      price: PRICE,
      country: card.country,
      category: "sympathy",
      description: `${card.country} ${current.label.toLowerCase()} card — offer comfort and remembrance with this culturally authentic design. Instant PDF download. Print at home or any print shop.`,
    });
  };

  return (
    <div>
      <NavBar />
      <div className="bg-[#0A1A2F] text-white py-8 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Sympathy & Memorial Cards</h1>
        <p className="text-[#C9A86A] text-lg">Offer comfort and remembrance across every culture</p>
        <p className="text-white/70 text-sm mt-1">182 countries · $5.99 each · Instant PDF Download</p>
        <div className="flex justify-center gap-3 mt-5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSearch(""); }}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "bg-[#C9A86A] text-[#0A1A2F]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Whisper line */}
      <p className="text-center italic text-[#C9A86A]/70 text-sm py-3 bg-[#F8F5EF]">Grief has no borders. Neither does love.</p>

      <div className="bg-[#F8F5EF] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search bar */}
          <div className="flex items-center gap-2 max-w-md mx-auto mb-5">
            <Search className="text-gray-400 w-4 h-4 shrink-0" />
            <Input
              placeholder="Search by country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-[#C9A86A]/40 focus:border-[#C9A86A]"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mb-4">
            {filtered.length} cards · {current.label} · $5.99 each · Instant PDF Download
          </p>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">No cards found for "{search}"</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((card) => (
              <div
                key={card.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => handleCardClick(card)}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={card.image}
                    alt={`${card.country} ${current.label} card`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-[#0A1A2F]/0 group-hover:bg-[#0A1A2F]/30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#0A1A2F] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      View & Buy
                    </div>
                  </div>
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-semibold text-[#0A1A2F] truncate">{card.country}</p>
                  <p className="text-xs text-[#C9A86A] font-bold mt-0.5">$3.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#0A1A2F] border-t border-white/10 text-white/50 text-center py-6 text-xs">
        <p className="italic text-[#C9A86A]/70 text-sm mb-3">Send a piece of home, back home.</p>
        All products are instant digital downloads · Print at home · wisheswithoutbordersco.com
      </footer>
    </div>
  );
}

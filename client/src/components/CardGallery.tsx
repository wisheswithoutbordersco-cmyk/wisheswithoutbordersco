import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Printer } from "lucide-react";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";

type CardItem = {
  id: string;
  country: string;
  image: string;
  variant?: string;
};

type Props = {
  cards: CardItem[];
  title: string;
  subtitle?: string;
  etsy_url?: string; // kept for backward compat, no longer used
  priceInCents?: number;
  category?: string;
  descriptionTemplate?: (card: CardItem) => string;
  /** Optional callback — when provided, an "Order Physical Print" button appears on each card */
  onOrderPrint?: (card: CardItem) => void;
};

function defaultDescription(card: CardItem, title: string): string {
  return `${card.country} ${title} — culturally authentic design celebrating ${card.country} heritage. Instant PDF download. Print at home or any print shop.`;
}

export function CardGallery({
  cards,
  title,
  subtitle,
  priceInCents = 599,
  category = "greeting_card",
  descriptionTemplate,
  onOrderPrint,
}: Props) {
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("country") ?? "";
    }
    return "";
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll to card grid when pre-filled from homepage search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("country") && gridRef.current) {
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  const filtered = cards.filter((c) =>
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  function handleCardClick(card: CardItem) {
    const description = descriptionTemplate
      ? descriptionTemplate(card)
      : defaultDescription(card, title);
    setSelectedProduct({
      productId: card.id,
      name: `${card.country}${card.variant && card.variant !== "Standard" ? ` — ${card.variant}` : ""} ${title}`,
      image: card.image,
      price: priceInCents,
      country: card.country,
      category,
      description,
    });
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Page Header */}
      <div className="bg-[#1a2744] text-white py-10 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">{title}</h1>
        {subtitle && <p className="text-[#d4af37] text-lg">{subtitle}</p>}
        <p className="text-white/70 text-sm mt-2">
          {cards.length} cards available &middot; ${(priceInCents / 100).toFixed(2)} each &middot; Instant PDF Download &middot; Print at Home
        </p>
      </div>

      {/* Search + Filter */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 max-w-md mx-auto mb-6">
          <Search className="text-gray-400 w-4 h-4 shrink-0" />
          <Input
            placeholder="Search by country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[#d4af37]/40 focus:border-[#d4af37]"
          />
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">No cards found for "{search}"</p>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
            >
              <div
                className="relative overflow-hidden cursor-pointer"
                style={{ aspectRatio: "3/4" }}
                onClick={() => handleCardClick(card)}
              >
                <img
                  src={card.image}
                  alt={`${card.country}${card.variant ? ` — ${card.variant}` : ""} card`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"

                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    View & Buy
                  </div>
                </div>
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-semibold text-[#1a2744] truncate">{card.country}</p>
                {card.variant && card.variant !== "Standard" && (
                  <p className="text-xs text-[#d4af37]">{card.variant}</p>
                )}
                <p className="text-xs text-[#d4af37] font-bold mt-0.5">${(priceInCents / 100).toFixed(2)}</p>
                {/* Order Physical Print button — only shown when onOrderPrint is provided */}
                {onOrderPrint && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrderPrint(card);
                    }}
                    className="mt-1.5 w-full flex items-center justify-center gap-1 bg-[#1a2744] text-white text-[10px] font-semibold py-1.5 rounded-full hover:bg-[#243560] transition-colors"
                  >
                    <Printer className="w-2.5 h-2.5" />
                    Order Physical Print
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrderPrint={
            onOrderPrint
              ? () => {
                  const card = cards.find((c) => c.id === selectedProduct.productId);
                  if (card) {
                    setSelectedProduct(null);
                    onOrderPrint(card);
                  }
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

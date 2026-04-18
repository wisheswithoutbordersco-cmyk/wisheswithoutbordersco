import { useState, useEffect, useRef, useMemo } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { LoadingGallery } from "@/components/LoadingGallery";
import { trpc } from "@/lib/trpc";
import { Search, ShoppingCart } from "lucide-react";

type CardItem = { id: string; country: string; image: string };

const TAB_CONFIG = [
  { key: "son", label: "For Son", source: "BIRTHDAY_SON_CARDS" },
  { key: "daughter", label: "For Daughter", source: "BIRTHDAY_DAUGHTER_CARDS" },
  { key: "mom", label: "For Mom", source: "BIRTHDAY_MOM_CARDS" },
  { key: "dad", label: "For Dad", source: "BIRTHDAY_DAD_CARDS" },
] as const;

const PRICE = 599; // $5.99

export default function BirthdayPage() {
  const [tab, setTab] = useState("son");
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("country") ?? "";
    }
    return "";
  });

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("country") && gridRef.current) {
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  // Fetch all 4 tabs in a single batch query
  const { data, isLoading, error } = trpc.shop.getProductsBySources.useQuery({
    sourceConstants: TAB_CONFIG.map((t) => t.source),
  });

  // Group products by source_constant into tab buckets
  const tabCards = useMemo(() => {
    const map: Record<string, CardItem[]> = {};
    for (const t of TAB_CONFIG) {
      map[t.key] = [];
    }
    if (!data) return map;
    for (const row of data) {
      const tabCfg = TAB_CONFIG.find((t) => t.source === row.sourceConstant);
      if (tabCfg) {
        map[tabCfg.key].push({
          id: row.id,
          country: row.country ?? "",
          image: row.coverImageUrl ?? "",
        });
      }
    }
    return map;
  }, [data]);

  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const currentTab = TAB_CONFIG.find((t) => t.key === tab)!;
  const currentCards = tabCards[tab] ?? [];
  const filtered = currentCards.filter((c) =>
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  function handleCardClick(card: CardItem) {
    setSelectedProduct({
      productId: card.id,
      name: `${card.country} Birthday Card — ${currentTab.label}`,
      image: card.image,
      price: PRICE,
      country: card.country,
      category: "birthday",
      description: `${card.country} birthday card ${currentTab.label.toLowerCase()} — culturally authentic design with heartfelt birthday wishes. Instant PDF download. Print at home or any print shop.`,
    });
  }

  if (isLoading || error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <NavBar />
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={false} itemLabel="birthday cards" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />

      {/* Page Header */}
      <section className="pt-24 pb-12 px-4 text-center">
        <span className="text-[#C9A86A] font-semibold text-sm uppercase tracking-widest">
          Birthday Cards
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mt-2 mb-3">
          Celebrate Birthdays
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Celebrate birthdays in every language, from every culture. Beautifully illustrated multicultural birthday cards for the whole family.
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm text-white/50">
          <span>✉️ 183 Countries</span>
          <span>👨‍👩‍👧‍👦 For Mom, Dad, Son & Daughter</span>
          <span>⚡ Instant Download</span>
          <span>💰 $5.99</span>
        </div>
      </section>

      {/* Filter + Search */}
      <section ref={gridRef} className="px-4 pb-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {TAB_CONFIG.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSearch("");
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                tab === t.key
                  ? "bg-[#C9A86A] text-black border-[#C9A86A]"
                  : "border-white/20 text-white/60 hover:border-[#C9A86A] hover:text-[#C9A86A]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 w-full focus:outline-none focus:border-[#C9A86A] transition-colors"
            />
          </div>
        </div>

        <p className="text-white/40 text-sm mb-6 text-center">
          {filtered.length} card{filtered.length !== 1 ? "s" : ""} shown
        </p>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">No cards found for "{search}"</p>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20">
          {filtered.map((card) => (
            <div
              key={card.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#C9A86A]/50 transition-all group cursor-pointer"
              onClick={() => handleCardClick(card)}
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#C9A86A]/20 to-[#1a1a1a]">
                <img
                  src={card.image}
                  alt={`${card.country} birthday card`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/300x400/1a1a1a/C9A86A?text=Card";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm">
                    {currentTab.label}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                    <ShoppingCart className="w-3 h-3" />
                    Quick View
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-white text-xs font-semibold leading-tight mb-1 truncate">
                  {card.country}
                </h3>
                <p className="text-white/40 text-[10px] mb-2">
                  Birthday {currentTab.label}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A86A] font-bold text-sm">
                    $5.99
                  </span>
                  <button className="text-[10px] bg-[#C9A86A] text-black px-2 py-1 rounded-lg font-bold uppercase tracking-wider hover:bg-[#b8975a] transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 text-white/40 text-center py-12 text-xs">
        <p className="italic text-[#C9A86A]/70 text-sm mb-4">Send a piece of home, back home.</p>
        <p className="text-white font-semibold mb-1 uppercase tracking-widest">Wishes Without Borders Co</p>
        <p>Multicultural Greeting Cards & Educational Tools</p>
        <p className="mt-1">All products are instant digital downloads · Print at home</p>
      </footer>
    </div>
  );
}

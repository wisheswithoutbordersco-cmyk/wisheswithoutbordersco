import { useState, useMemo } from "react";
import { Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { LoadingGallery } from "@/components/LoadingGallery";
import { trpc } from "@/lib/trpc";
import { Printer, Search, ShoppingCart, ImageIcon } from "lucide-react";
import {
  PhysicalPrintModal,
  type PhysicalPrintProduct,
} from "@/components/PhysicalPrintModal";

const COUNTRIES = ["All", "Kenya", "Nigeria", "Jamaica", "India"] as const;

type WallArtItem = {
  id: string;
  name: string;
  country: string;
  design: string;
  image: string;
};

export default function WallArtPage() {
  const [printProduct, setPrintProduct] = useState<PhysicalPrintProduct | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = trpc.shop.getProductsBySource.useQuery({ sourceConstant: "WALL_ART_PRINTS" });

  const wallArt = useMemo<WallArtItem[]>(() => {
    if (!data) return [];
    return data.map((r) => ({
      id: r.id,
      name: r.productName,
      country: r.country ?? "",
      design: r.design ?? r.productName,
      image: r.coverImageUrl ?? "",
    }));
  }, [data]);

  const isEmpty = !isLoading && !error && wallArt.length === 0;

  const filtered = wallArt.filter((art) => {
    const matchesCountry = selectedCountry === "All" || art.country === selectedCountry;
    const matchesSearch =
      search === "" ||
      art.name.toLowerCase().includes(search.toLowerCase()) ||
      art.country.toLowerCase().includes(search.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  // Group by country for display
  const grouped = COUNTRIES.filter((c) => c !== "All").reduce(
    (acc, country) => {
      acc[country] = filtered.filter((a) => a.country === country);
      return acc;
    },
    {} as Record<string, WallArtItem[]>,
  );

  const showGrouped = selectedCountry === "All" && search === "";

  if (isLoading || error || isEmpty) {
    return (
      <div className="min-h-screen bg-[#faf8f4]">
        <NavBar />
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="wall art prints" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />

      {/* Hero */}
      <div className="bg-[#1a2744] text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <ImageIcon className="w-6 h-6 text-[#d4af37]" />
          <span className="text-[#d4af37] font-semibold text-xs uppercase tracking-widest">
            WishesWithoutBordersco Wall Art
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">
          Cultural Wall Art Prints
        </h1>
        <p className="text-[#d4af37] text-lg mb-2">
          {wallArt.length} Designs · 4 Countries · Museum-Quality Art
        </p>
        <p className="text-white/60 text-sm max-w-2xl mx-auto">
          Beautiful 8×10 printable wall art celebrating the cultures of Kenya, Nigeria, Jamaica, and India.
          Stunning illustrations of landmarks, textiles, wildlife, and cultural traditions — perfect for
          classrooms, offices, and homes.
        </p>
      </div>

      {/* Features bar */}
      <div className="bg-[#d4af37]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[#1a2744] text-xs font-semibold">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <ImageIcon className="w-3.5 h-3.5" /> High-Resolution 8×10
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Printer className="w-3.5 h-3.5" /> Instant PDF Download
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <ShoppingCart className="w-3.5 h-3.5" /> $4.99 per print
          </span>
        </div>
      </div>

      {/* Physical Print CTA Banner */}
      <div className="bg-[#1a2744] border-b-2 border-[#d4af37]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="text-white text-sm">
              <strong className="text-[#d4af37]">NEW:</strong> Order physical wall art prints shipped to your door!
            </span>
          </div>
          <Link
            href="/print-shop"
            className="inline-flex items-center gap-1.5 bg-[#d4af37] text-[#1a2744] font-bold text-xs px-4 py-1.5 rounded-full hover:bg-[#c49b2a] transition-colors shrink-0"
          >
            <Printer className="w-3 h-3" />
            Visit Print Shop
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        {/* Country tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                selectedCountry === c
                  ? "bg-[#d4af37] text-[#1a2744] border-[#d4af37]"
                  : "border-[#d4af37]/30 text-[#1a2744]/60 hover:border-[#d4af37] hover:text-[#1a2744]"
              }`}
            >
              {c === "All" ? "All Countries" : c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-md mx-auto mb-6">
          <Search className="text-gray-400 w-4 h-4 shrink-0" />
          <input
            placeholder="Search by country or design..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#d4af37]/40 focus:border-[#d4af37] rounded-lg px-3 py-2 text-sm outline-none transition-colors"
          />
        </div>

        <p className="text-gray-500 text-sm mb-6 text-center">
          {filtered.length} design{filtered.length !== 1 ? "s" : ""} shown
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {showGrouped ? (
          // Grouped by country
          COUNTRIES.filter((c) => c !== "All").map((country) => {
            const items = grouped[country];
            if (!items || items.length === 0) return null;
            return (
              <div key={country} className="mb-12">
                <h2 className="text-2xl font-bold font-serif text-[#1a2744] mb-1">
                  {country}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {items.length} cultural wall art designs
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {items.map((art) => (
                    <div
                      key={art.id}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer"
                      onClick={() =>
                        setPrintProduct({
                          productId: art.id,
                          name: `${art.name} Wall Art Print`,
                          image: art.image,
                          country: art.country,
                        })
                      }
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                        <img
                          src={art.image}
                          alt={art.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/300x375/f5f0e8/1a2744?text=Art";
                          }}
                        />
                        <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3" />
                            View & Buy
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#d4af37] font-semibold mb-0.5">{art.country}</p>
                        <h3 className="text-sm font-bold text-[#1a2744] leading-tight mb-1 truncate">
                          {art.design}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-[#d4af37] font-bold text-sm">$4.99</span>
                          <span className="text-[10px] bg-[#d4af37] text-[#1a2744] px-2 py-0.5 rounded-full font-bold">
                            8×10
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Flat filtered grid
          <>
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-12">
                No wall art found for &ldquo;{search}&rdquo;
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((art) => (
                <div
                  key={art.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer"
                  onClick={() =>
                    setPrintProduct({
                      productId: art.id,
                      name: `${art.name} Wall Art Print`,
                      image: art.image,
                      country: art.country,
                    })
                  }
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                    <img
                      src={art.image}
                      alt={art.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/300x375/f5f0e8/1a2744?text=Art";
                      }}
                    />
                    <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        View & Buy
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#d4af37] font-semibold mb-0.5">{art.country}</p>
                    <h3 className="text-sm font-bold text-[#1a2744] leading-tight mb-1 truncate">
                      {art.design}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#d4af37] font-bold text-sm">$4.99</span>
                      <span className="text-[10px] bg-[#d4af37] text-[#1a2744] px-2 py-0.5 rounded-full font-bold">
                        8×10
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Physical Print Modal */}
      {printProduct && (
        <PhysicalPrintModal
          product={printProduct}
          onClose={() => setPrintProduct(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#1a2744] text-white/40 text-center py-12 text-xs border-t border-white/5">
        <p className="italic text-[#d4af37]/70 text-sm mb-4">Celebrate every culture, on every wall.</p>
        <p className="text-white font-semibold mb-1 uppercase tracking-widest">Wishes Without Borders Co</p>
        <p>Multicultural Wall Art & Cultural Prints</p>
        <p className="mt-1">All products are instant digital downloads · Print at home</p>
      </footer>
    </div>
  );
}

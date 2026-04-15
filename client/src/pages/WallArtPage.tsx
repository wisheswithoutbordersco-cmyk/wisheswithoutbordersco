import { NavBar } from "@/components/NavBar";
import { Image } from "lucide-react";
import { WALL_ART_PRODUCTS } from "@/lib/productData";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

// Group products by country, each country has 8x10 and 11x14
type SizeOption = "8x10" | "11x14";

export default function WallArtPage() {
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, SizeOption>>({});

  // Get unique countries
  const countries = Array.from(
    new Set(WALL_ART_PRODUCTS.map((p) => p.country))
  ).sort();

  function getProduct(country: string, size: SizeOption) {
    return WALL_ART_PRODUCTS.find(
      (p) => p.country === country && p.id.endsWith(size.replace("x", "x"))
    );
  }

  function getSize(country: string): SizeOption {
    return selectedSizes[country] ?? "8x10";
  }

  function handleAdd(country: string) {
    const size = getSize(country);
    const product = WALL_ART_PRODUCTS.find(
      (p) => p.country === country && p.id.includes(size.replace("x", "x"))
    );
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAdded(country);
    setTimeout(() => setAdded(null), 1500);
  }

  const uniqueCountries = Array.from(new Set(WALL_ART_PRODUCTS.map(p => p.country))).sort();

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <NavBar />

      {/* Hero */}
      <div className="bg-[#0A1A2F] text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image className="w-6 h-6 text-[#C9A86A]" />
          <span className="text-[#C9A86A] font-semibold text-sm uppercase tracking-widest">Wall Art</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">Cultural Wall Art Prints</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-4">
          Beautiful printable wall art celebrating cultures from around the world. Choose your size. Instant digital download.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
          <span>🖼️ {uniqueCountries.length} designs · 2 sizes each</span>
          <span>·</span>
          <span>📐 8x10 or 11x14 format</span>
          <span>·</span>
          <span>⬇️ Instant PDF download</span>
          <span>·</span>
          <span>🖨️ Print at home</span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {uniqueCountries.map((country) => {
            const size = getSize(country);
            const product = WALL_ART_PRODUCTS.find(
              (p) => p.country === country && p.id.includes(size.replace("x", "x"))
            );
            if (!product) return null;

            return (
              <div
                key={country}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#C9A86A]/15 hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#F8F5EF]">
                  <img
                    src={product.image}
                    alt={`${country} Cultural Wall Art`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-[#0A1A2F] text-sm font-serif leading-tight mb-2">
                    {country}
                  </p>
                  {/* Size selector */}
                  <div className="flex gap-1 mb-2">
                    {(["8x10", "11x14"] as SizeOption[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [country]: s }))}
                        className="text-xs px-2 py-1 rounded border transition-colors"
                        style={{
                          background: size === s ? "#0A1A2F" : "transparent",
                          color: size === s ? "#fff" : "#0A1A2F",
                          borderColor: "#0A1A2F",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9A86A] font-bold text-sm">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAdd(country)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                      style={{
                        background: added === country ? "#2ecc71" : "#0A1A2F",
                        color: "#fff",
                      }}
                    >
                      {added === country ? "Added" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            All wall art prints are instant digital downloads in high-resolution PDF format.
            Print at home or at your local print shop.
          </p>
          <p className="text-[#C9A86A] font-semibold text-sm mt-2">
            More countries coming soon — new prints added monthly.
          </p>
        </div>
      </div>
    </div>
  );
}

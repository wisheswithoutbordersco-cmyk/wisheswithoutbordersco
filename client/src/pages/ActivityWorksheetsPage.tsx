import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, ShoppingCart } from "lucide-react";
import { ACTIVITY_WORKBOOKS } from "@/lib/productData";

export default function ActivityWorksheetsPage() {
  const [search, setSearch]         = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);

  const filtered = ACTIVITY_WORKBOOKS.filter((w) =>
    w.country.toLowerCase().includes(search.toLowerCase())
  );

  function handleClick(w: typeof ACTIVITY_WORKBOOKS[0]) {
    setSelectedProduct({
      productId: w.id,
      name: w.name,
      image: w.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E",
      price: w.price,
      country: w.country,
      category: "activity_workbook",
      description: `${w.country} Activity Workbook — explore ${w.country} through fun activities, puzzles, and cultural learning. Perfect for kids and families. Instant PDF download, print at home.`,
    });
  }

  return (
    <div>
      <NavBar />
      <div className="bg-[#0A1A2F] text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-[#C9A86A]" />
          <span className="text-[#C9A86A] font-semibold text-sm uppercase tracking-widest">Activity Workbooks</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Country Activity Workbooks</h1>
        <p className="text-[#C9A86A] text-lg">Explore every country through fun activities, puzzles &amp; cultural learning</p>
        <p className="text-white/70 text-sm mt-1">
          {ACTIVITY_WORKBOOKS.length} countries · $9.99 each · Instant PDF Download · Print at Home
        </p>
      </div>

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
            {filtered.length} workbooks · $9.99 each · Instant PDF Download
          </p>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">No workbooks found for "{search}"</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((w) => (
              <div
                key={w.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => handleClick(w)}
              >
                <div className="relative overflow-hidden bg-[#F8F5EF]" style={{ aspectRatio: "3/4" }}>
                  {w.image ? (
                    <img
                      src={w.image}
                      alt={`${w.country} activity workbook`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  {/* Fallback / overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
                    {!w.image && (
                      <>
                        <BookOpen className="w-8 h-8 text-[#0A1A2F]/30" />
                        <span className="text-[10px] font-semibold text-[#0A1A2F]/50 text-center px-2">Activity Workbook</span>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-[#0A1A2F]/0 group-hover:bg-[#0A1A2F]/30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#0A1A2F] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      View & Buy
                    </div>
                  </div>
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-semibold text-[#0A1A2F] truncate">{w.country}</p>
                  <p className="text-xs text-[#C9A86A] font-bold mt-0.5">$9.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

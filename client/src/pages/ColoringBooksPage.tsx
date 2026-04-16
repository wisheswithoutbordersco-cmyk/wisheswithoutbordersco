import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { Palette, ShoppingCart } from "lucide-react";
import { COLORING_BOOKS } from "@/lib/productData";

export default function ColoringBooksPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />
      <div className="bg-[#1a2744] text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Palette className="w-6 h-6 text-[#d4af37]" />
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest">Coloring Books</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Around the World Coloring Books</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          100+ pages of beautiful illustrations celebrating cultures, landmarks, and wildlife from every continent.
        </p>
        <p className="text-white/60 text-sm mt-2">
          {COLORING_BOOKS.length} editions · $9.99 each · Instant PDF Download · Print at Home
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {COLORING_BOOKS.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer group"
              onClick={() =>
                setSelectedProduct({
                  productId: book.id,
                  name: book.name,
                  image: book.image,
                  price: book.price,
                  country: book.country,
                  category: "coloring_book",
                  description:
                    book.id === "coloring_africa"
                      ? "Color your way through 54 African countries! Beautiful illustrations of landmarks, wildlife, and cultural scenes. 100+ pages. Instant PDF download."
                      : "Color your way through North, Central, and South America! Beautiful illustrations of landmarks, nature, and cultural scenes. 100+ pages. Instant PDF download.",
                })
              }
            >
              <div className="relative overflow-hidden bg-[#f5f0e8]" style={{ aspectRatio: "3/4" }}>
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-[#d4af37] text-[#1a2744] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  New
                </span>
                <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    View & Buy
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-[#1a2744] leading-tight mb-1">{book.name}</h3>
                <p className="text-xs text-gray-500 mb-3">100+ pages · Instant PDF Download</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#d4af37] font-bold">$9.99</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="bg-[#d4af37] hover:bg-[#c9a227] text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
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

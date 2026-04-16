import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { ChefHat, Clock, ShoppingCart } from "lucide-react";

const CDN3 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M";

const LIVE_BOOKS = [
  {
    id: "cookbook_195_dishes",
    name: "Around the World in 195 Dishes",
    subtitle: "One iconic dish per country",
    image: `${CDN3}/cookbook_195_dishes_cover.png`,
    price: 999,
    badge: "New",
    description:
      "A culinary journey through 195 countries — one iconic dish per nation. Recipes, cultural context, and food history. Instant PDF download.",
  },
];

export default function CookbooksPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />
      <div className="bg-[#1a2744] text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="w-6 h-6 text-[#d4af37]" />
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest">Cookbooks</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">World Cuisine Cookbooks</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Explore global flavors — recipes, cultural context, and food history from every corner of the world.
        </p>
        <p className="text-white/60 text-sm mt-2">Instant PDF Download · Print at Home</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Live books */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {LIVE_BOOKS.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer group"
              onClick={() =>
                setSelectedProduct({
                  productId: book.id,
                  name: book.name,
                  image: book.image,
                  price: book.price,
                  country: "World",
                  category: "cookbook",
                  description: book.description,
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
                {book.badge && (
                  <span className="absolute top-2 left-2 bg-[#d4af37] text-[#1a2744] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {book.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    View & Buy
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-[#d4af37] font-semibold mb-1">{book.subtitle}</p>
                <h3 className="text-sm font-bold text-[#1a2744] leading-tight mb-2">{book.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#d4af37] font-bold">$9.99</span>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#d4af37] hover:bg-[#c9a227] text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Coming Soon — Dessert Book */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-dashed border-[#d4af37]/40">
            <div
              className="bg-[#f5f0e8] flex flex-col items-center justify-center"
              style={{ aspectRatio: "3/4" }}
            >
              <Clock className="w-10 h-10 text-[#d4af37]/60 mb-2" />
              <p className="text-[#1a2744]/40 text-xs font-semibold">Coming Soon</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-[#d4af37] font-semibold mb-1">Desserts of the World</p>
              <h3 className="text-sm font-bold text-[#1a2744]/60 leading-tight mb-2">
                Around the World in 195 Desserts
              </h3>
              <p className="text-xs text-gray-400">Available soon</p>
            </div>
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

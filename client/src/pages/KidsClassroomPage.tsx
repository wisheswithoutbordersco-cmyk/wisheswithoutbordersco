import { useState, useMemo } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { LoadingGallery } from "@/components/LoadingGallery";
import { trpc } from "@/lib/trpc";
import { ShoppingCart } from "lucide-react";

// CLASSROOM_KIT and DOORWAY_KIT are singletons with image URLs.
// Both DB and productData have empty strings for these images currently.
// We inline the structure so it can be updated via DB later.
const CLASSROOM_KIT_FALLBACK = { mockup: "", daily_card: "" };
const DOORWAY_KIT_FALLBACK = { mockup: "", mood_meter: "", today_i_need: "" };

export default function KidsClassroomPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);

  // Fetch coloring books and stickers from DB
  const { data: coloringData, isLoading: coloringLoading, error: coloringError } = trpc.shop.getProductsBySource.useQuery({ sourceConstant: "COLORING_BOOKS" });
  const { data: stickerData, isLoading: stickerLoading, error: stickerError } = trpc.shop.getProductsBySource.useQuery({ sourceConstant: "STICKERS" });

  const coloringBooks = useMemo(() => {
    if (!coloringData) return [];
    return coloringData.map((r) => ({
      id: r.id,
      country: r.country ?? "",
      image: r.coverImageUrl ?? "",
    }));
  }, [coloringData]);

  const stickers = useMemo(() => {
    if (!stickerData) return [];
    return stickerData.map((r) => ({
      id: r.id,
      name: r.productName,
      image: r.coverImageUrl ?? "",
    }));
  }, [stickerData]);

  // Use inline fallback for kit images (both DB and productData have empty strings)
  const classroomKit = CLASSROOM_KIT_FALLBACK;
  const doorwayKit = DOORWAY_KIT_FALLBACK;

  function openProduct(info: ProductInfo) {
    setSelectedProduct(info);
  }

  return (
    <div>
      <NavBar />

      {/* Page Header */}
      <div className="bg-[#1a2744] text-white py-10 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Kids & Classroom</h1>
        <p className="text-[#d4af37] text-lg">Coloring books, stickers, and classroom connection tools</p>
        <p className="text-white/70 text-sm mt-1">Culturally authentic · Instant PDF Download</p>
      </div>

      <div className="bg-[#faf8f4] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">

          {/* ── Coloring Books ─────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1 w-8 bg-[#d4af37] rounded-full" />
              <h2 className="text-2xl font-bold font-serif text-[#1a2744]">Coloring Books</h2>
              <span className="text-sm text-gray-400 ml-1">({coloringBooks.length} books)</span>
            </div>
            <p className="text-gray-600 text-sm mb-5">
              Cultural coloring books featuring characters from around the world. Each book celebrates a different country's traditions, food, and daily life.
            </p>
            {(coloringLoading || coloringError) ? (
              <LoadingGallery isLoading={coloringLoading} error={coloringError} isEmpty={false} itemLabel="coloring books" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {coloringBooks.map((book) => (
                  <div
                    key={book.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 cursor-pointer"
                    onClick={() => openProduct({
                      productId: book.id,
                      name: `${book.country} Cultural Coloring Book`,
                      image: book.image,
                      price: 499,
                      country: book.country,
                      category: "coloring_book",
                      description: `${book.country} cultural coloring book — features authentic characters, traditions, food, and daily life from ${book.country}. Perfect for kids and classrooms. Instant PDF download.`,
                    })}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                      <img
                        src={book.image}
                        alt={`${book.country} coloring book`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/300x400/f5f0e8/1a2744?text=Book";
                        }}
                      />
                      <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          View & Buy
                        </div>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <p className="text-sm font-semibold text-[#1a2744]">{book.country}</p>
                      <p className="text-xs text-gray-400 mb-0.5">Coloring Book</p>
                      <p className="text-xs text-[#d4af37] font-bold">$4.99</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Stickers / Clipart ─────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1 w-8 bg-[#d4af37] rounded-full" />
              <h2 className="text-2xl font-bold font-serif text-[#1a2744]">Cultural Stickers & Clipart</h2>
              <span className="text-sm text-gray-400 ml-1">({stickers.length} designs)</span>
            </div>
            <p className="text-gray-600 text-sm mb-5">
              Culturally authentic clipart and sticker designs featuring foods, animals, and symbols from around the world. Perfect for teachers, parents, and educators.
            </p>
            {(stickerLoading || stickerError) ? (
              <LoadingGallery isLoading={stickerLoading} error={stickerError} isEmpty={false} itemLabel="stickers" />
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 cursor-pointer"
                    onClick={() => openProduct({
                      productId: sticker.id,
                      name: sticker.name,
                      image: sticker.image,
                      price: 299,
                      category: "sticker",
                      description: `${sticker.name} — culturally authentic clipart and sticker design. Perfect for teachers, parents, and educators. Instant PDF download.`,
                    })}
                  >
                    <div className="overflow-hidden" style={{ aspectRatio: "1/1" }}>
                      <img
                        src={sticker.image}
                        alt={sticker.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/200x200/f5f0e8/1a2744?text=Sticker";
                        }}
                      />
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-xs text-[#1a2744] truncate leading-tight">{sticker.name}</p>
                      <p className="text-xs text-[#d4af37] font-bold mt-0.5">$2.99</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Classroom Connection Kit ───────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1 w-8 bg-[#d4af37] rounded-full" />
              <h2 className="text-2xl font-bold font-serif text-[#1a2744]">Classroom Connection Kit</h2>
              <span className="ml-2 px-2 py-0.5 bg-[#d4af37] text-[#1a2744] text-xs font-bold rounded-full">New</span>
            </div>
            <p className="text-gray-600 text-sm mb-5">
              The complete daily connection card system for classrooms. PBIS/CASEL/FERPA aligned. Features multicultural characters from around the world. Instant PDF download.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              {classroomKit.mockup && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <img
                    src={classroomKit.mockup}
                    alt="Classroom Connection Kit mockup"
                    className="w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300/f5f0e8/1a2744?text=Kit+Mockup";
                    }}
                  />
                  <div className="p-4 text-center">
                    <p className="font-semibold text-[#1a2744] text-sm">Complete Kit Mockup</p>
                  </div>
                </div>
              )}
              {classroomKit.daily_card && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <img
                    src={classroomKit.daily_card}
                    alt="Daily Connection Card"
                    className="w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300/f5f0e8/1a2744?text=Daily+Card";
                    }}
                  />
                  <div className="p-4 text-center">
                    <p className="font-semibold text-[#1a2744] text-sm">Daily Connection Card</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-5">
              <button
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a2744] text-white font-bold rounded-full hover:bg-[#243560] transition-colors"
                onClick={() => openProduct({
                  productId: "classroom_kit",
                  name: "Classroom Connection Kit",
                  image: classroomKit.mockup || "",
                  price: 2500,
                  category: "classroom_kit",
                  description: "The complete daily connection card system for classrooms. PBIS/CASEL/FERPA aligned. Features multicultural characters from around the world. Instant PDF download.",
                })}
              >
                <ShoppingCart className="w-4 h-4" />
                Get the Classroom Kit — $25.00
              </button>
            </div>
          </section>

          {/* ── Doorway Kit ────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1 w-8 bg-[#d4af37] rounded-full" />
              <h2 className="text-2xl font-bold font-serif text-[#1a2744]">Doorway Connection Kit</h2>
              <span className="ml-2 px-2 py-0.5 bg-[#d4af37] text-[#1a2744] text-xs font-bold rounded-full">New</span>
            </div>
            <p className="text-gray-600 text-sm mb-5">
              The complete 6-piece classroom doorway system. Includes a Mood Meter, "Today I Need" chart, and daily check-in tools. Perfect for morning meetings and SEL routines.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
              {doorwayKit.mockup && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <img src={doorwayKit.mockup} alt="Doorway Kit mockup" className="w-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x300/f5f0e8/1a2744?text=Doorway+Kit"; }} />
                  <div className="p-3 text-center"><p className="text-xs font-semibold text-[#1a2744]">Complete Kit</p></div>
                </div>
              )}
              {doorwayKit.mood_meter && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <img src={doorwayKit.mood_meter} alt="Mood Meter" className="w-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x300/f5f0e8/1a2744?text=Mood+Meter"; }} />
                  <div className="p-3 text-center"><p className="text-xs font-semibold text-[#1a2744]">Mood Meter</p></div>
                </div>
              )}
              {doorwayKit.today_i_need && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <img src={doorwayKit.today_i_need} alt="Today I Need chart" className="w-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x300/f5f0e8/1a2744?text=Today+I+Need"; }} />
                  <div className="p-3 text-center"><p className="text-xs font-semibold text-[#1a2744]">Today I Need Chart</p></div>
                </div>
              )}
            </div>
            <div className="mt-5">
              <button
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a2744] text-white font-bold rounded-full hover:bg-[#243560] transition-colors"
                onClick={() => openProduct({
                  productId: "doorway_kit",
                  name: "Doorway Connection Kit",
                  image: doorwayKit.mockup || "",
                  price: 2500,
                  category: "doorway_kit",
                  description: "The complete 6-piece classroom doorway system. Includes a Mood Meter, 'Today I Need' chart, and daily check-in tools. Perfect for morning meetings and SEL routines. Instant PDF download.",
                })}
              >
                <ShoppingCart className="w-4 h-4" />
                Get the Doorway Kit — $25.00
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

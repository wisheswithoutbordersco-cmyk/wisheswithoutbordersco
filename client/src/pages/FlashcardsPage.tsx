import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { Layers, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const CDN3 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M";

const FLASHCARD_SETS = [
  {
    id: "flashcard_set1",
    name: "World Cultures Flashcards — Set 1",
    subtitle: "Countries A–F",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/QTZAhRGJolvpMakW.png",
    price: 999,
    badge: "New",
    description: "Educational flashcards covering countries A–F. Each card features the flag, capital, language, and a cultural fact. Perfect for classrooms and families. Instant PDF download.",
    pdfLink: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/mlOQrjvVEenOpynD.pdf",
  },
  {
    id: "flashcard_set2",
    name: "World Cultures Flashcards — Set 2",
    subtitle: "Countries G–N",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/vKweNbMqdzrLxGFp.png",
    price: 999,
    badge: "New",
    description: "Educational flashcards covering countries G–N. Each card features the flag, capital, language, and a cultural fact. Perfect for classrooms and families. Instant PDF download.",
    pdfLink: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/caLMIPKwMfQuSrvD.pdf",
  },
  {
    id: "flashcard_set3",
    name: "World Cultures Flashcards — Set 3",
    subtitle: "Countries O–Z",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/OmYlRlefFMgJFCmq.png",
    price: 999,
    badge: "New",
    description: "Educational flashcards covering countries O–Z. Each card features the flag, capital, language, and a cultural fact. Perfect for classrooms and families. Instant PDF download.",
    pdfLink: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/lWBDcvECrkcKGFnO.pdf",
  },
];

export default function FlashcardsPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const checkoutMutation = trpc.shop.createCheckout.useMutation();

  async function handleBuy(set: typeof FLASHCARD_SETS[0]) {
    setCheckingOut(set.id);
    const origin = window.location.origin;
    try {
      const result = await checkoutMutation.mutateAsync({
        productId: set.id,
        successUrl: `${origin}/order-success`,
        cancelUrl: origin,
      });
      if (result.url) {
        toast.success("Redirecting to checkout…");
        window.open(result.url, "_blank");
      }
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setCheckingOut(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />
      <div className="bg-[#1a2744] text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Layers className="w-6 h-6 text-[#d4af37]" />
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest">Flashcards</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">World Cultures Flashcards</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Educational flashcard sets covering every country — flags, capitals, languages &amp; cultural facts.
        </p>
        <p className="text-white/60 text-sm mt-2">3 sets · $9.99 each · Instant PDF Download · Print at Home</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FLASHCARD_SETS.map((set) => (
            <div
              key={set.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer group"
              onClick={() =>
                setSelectedProduct({
                  productId: set.id,
                  name: set.name,
                  image: set.image,
                  price: set.price,
                  country: "World",
                  category: "flashcard",
                  description: set.description,
                })
              }
            >
              <div className="relative overflow-hidden bg-[#f5f0e8]" style={{ aspectRatio: "3/4" }}>
                <img
                  src={set.image}
                  alt={set.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {set.badge && (
                  <span className="absolute top-2 left-2 bg-[#d4af37] text-[#1a2744] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {set.badge}
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
                <p className="text-xs text-[#d4af37] font-semibold mb-1">{set.subtitle}</p>
                <h3 className="text-sm font-bold text-[#1a2744] leading-tight mb-2">{set.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#d4af37] font-bold">$9.99</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBuy(set); }}
                    disabled={checkingOut === set.id}
                    className="bg-[#d4af37] hover:bg-[#c9a227] text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 disabled:opacity-60"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    {checkingOut === set.id ? "…" : "Buy"}
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

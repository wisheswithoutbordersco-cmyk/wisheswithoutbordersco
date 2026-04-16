import { useState } from "react";
import { Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { WALL_ART_PRINTS } from "@/lib/productData";
import { Printer } from "lucide-react";
import {
  PhysicalPrintModal,
  type PhysicalPrintProduct,
} from "@/components/PhysicalPrintModal";

export default function WallArtPage() {
  const [printProduct, setPrintProduct] = useState<PhysicalPrintProduct | null>(null);

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />

      {/* Physical Print CTA Banner — shown above the gallery */}
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

      <CardGallery
        cards={WALL_ART_PRINTS}
        title="Cultural Wall Art Prints"
        subtitle="Beautiful 8×10 printable wall art celebrating cultures from around the world"
        priceInCents={499}
        category="wall_art"
        descriptionTemplate={(card) =>
          `Stunning ${card.country} cultural wall art print — 8×10 high-resolution illustration perfect for classrooms, offices, and homes. Instant PDF download, print at home or any print shop.`
        }
        onOrderPrint={(card) =>
          setPrintProduct({
            productId: card.id,
            name: `${card.country} Cultural Wall Art Print`,
            image: card.image,
            country: card.country,
          })
        }
      />

      {/* Physical Print Modal */}
      {printProduct && (
        <PhysicalPrintModal
          product={printProduct}
          onClose={() => setPrintProduct(null)}
        />
      )}
    </div>
  );
}

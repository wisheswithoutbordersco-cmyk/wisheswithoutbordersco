import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { IN_LOVING_MEMORY_CARDS } from "@/lib/productData";

export default function InLovingMemoryPage() {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />
      <CardGallery
        cards={IN_LOVING_MEMORY_CARDS}
        title="In Loving Memory Cards"
        subtitle="Honor and remember loved ones across every culture"
        priceInCents={599}
        category="individual_card"
      />
    </div>
  );
}

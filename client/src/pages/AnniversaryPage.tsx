import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { ANNIVERSARY_CARDS } from "@/lib/productData";
export default function AnniversaryPage() {
  return (
    <div>
      <NavBar />
      <CardGallery
        cards={ANNIVERSARY_CARDS}
        title="Anniversary Cards"
        subtitle="Celebrate love and commitment across every culture"
        priceInCents={599}
        category="anniversary"
      />
    </div>
  );
}

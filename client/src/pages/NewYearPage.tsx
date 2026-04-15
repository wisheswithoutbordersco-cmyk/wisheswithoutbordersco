import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { HAPPY_NEW_YEAR_CARDS } from "@/lib/productData";

export default function NewYearPage() {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />
      <CardGallery
        cards={HAPPY_NEW_YEAR_CARDS}
        title="Happy New Year Cards"
        subtitle="Ring in the New Year across every culture"
        priceInCents={599}
        category="individual_card"
      />
    </div>
  );
}

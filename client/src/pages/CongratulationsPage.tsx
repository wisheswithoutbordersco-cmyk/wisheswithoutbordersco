import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { CONGRATULATIONS_CARDS } from "@/lib/productData";
export default function CongratulationsPage() {
  return (
    <div>
      <NavBar />
      <CardGallery
        cards={CONGRATULATIONS_CARDS}
        title="Congratulations Cards"
        subtitle="Say congrats in their language, from their culture"
        priceInCents={599}
        category="congratulations"
      />
    </div>
  );
}

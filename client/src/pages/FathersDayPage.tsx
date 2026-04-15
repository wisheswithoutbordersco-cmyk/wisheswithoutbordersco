import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { FATHERS_DAY_CARDS } from "@/lib/productData";
export default function FathersDayPage() {
  return (
    <div>
      <NavBar />
      <p className="text-center italic text-[#d4af37]/70 text-sm py-3 bg-[#faf8f4]">He sacrificed everything. Send him something meaningful.</p>
      <CardGallery cards={FATHERS_DAY_CARDS} title="Father's Day Cards" subtitle="Celebrate dads from every corner of the world" priceInCents={599} category="fathers_day" />
    </div>
  );
}

import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { MOTHERS_DAY_CARDS } from "@/lib/productData";
export default function MothersDayPage() {
  return (
    <div>
      <NavBar />
      <p className="text-center italic text-[#d4af37]/70 text-sm py-3 bg-[#faf8f4]">For the mom who stayed home so you could go further.</p>
      <CardGallery cards={MOTHERS_DAY_CARDS} title="Mother's Day Cards" subtitle="Honor moms around the world — in their language, with their culture" priceInCents={599} category="mothers_day" />
    </div>
  );
}

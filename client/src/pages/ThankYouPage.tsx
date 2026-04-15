import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { THANK_YOU_CARDS } from "@/lib/productData";
export default function ThankYouPage() {
  return (
    <div>
      <NavBar />
      <p className="text-center italic text-[#d4af37]/70 text-sm py-3 bg-[#faf8f4]">Some thank you's deserve to be said in the right language.</p>
      <CardGallery cards={THANK_YOU_CARDS} title="Thank You Cards" subtitle="Express gratitude across every culture and language" priceInCents={599} category="thank_you" />
    </div>
  );
}

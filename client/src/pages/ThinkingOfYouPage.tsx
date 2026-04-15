import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { THINKING_OF_YOU_CARDS } from "@/lib/productData";
export default function ThinkingOfYouPage() {
  return <div><NavBar /><CardGallery cards={THINKING_OF_YOU_CARDS} title="Thinking of You Cards" subtitle="Let someone know you care — in their language" priceInCents={599} category="thinking_of_you" /></div>;
}

import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function ThankYouPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("THANK_YOU_CARDS");

  return (
    <div>
      <NavBar />
      <p className="text-center italic text-[#d4af37]/70 text-sm py-3 bg-[#faf8f4]">Some thank you's deserve to be said in the right language.</p>
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="thank you cards" />
      ) : (
        <CardGallery cards={cards} title="Thank You Cards" subtitle="Express gratitude across every culture and language" priceInCents={599} category="thank_you" />
      )}
    </div>
  );
}

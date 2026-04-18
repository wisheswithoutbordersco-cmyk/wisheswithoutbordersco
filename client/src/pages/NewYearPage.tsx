import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function NewYearPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("HAPPY_NEW_YEAR_CARDS");

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="new year cards" />
      ) : (
        <CardGallery
          cards={cards}
          title="Happy New Year Cards"
          subtitle="Ring in the New Year across every culture"
          priceInCents={599}
          category="individual_card"
        />
      )}
    </div>
  );
}

import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function AnniversaryPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("ANNIVERSARY_CARDS");

  return (
    <div>
      <NavBar />
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="anniversary cards" />
      ) : (
        <CardGallery
          cards={cards}
          title="Anniversary Cards"
          subtitle="Celebrate love and commitment across every culture"
          priceInCents={599}
          category="anniversary"
        />
      )}
    </div>
  );
}

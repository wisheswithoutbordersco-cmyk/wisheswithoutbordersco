import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function GetWellPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("GET_WELL_SOON_CARDS");

  return (
    <div>
      <NavBar />
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="get well cards" />
      ) : (
        <CardGallery
          cards={cards}
          title="Get Well Soon Cards"
          subtitle="Send healing wishes from the heart, across every culture"
          priceInCents={599}
          category="get_well"
        />
      )}
    </div>
  );
}

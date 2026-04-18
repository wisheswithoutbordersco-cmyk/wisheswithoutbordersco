import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function CongratulationsPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("CONGRATULATIONS_CARDS");

  return (
    <div>
      <NavBar />
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="congratulations cards" />
      ) : (
        <CardGallery
          cards={cards}
          title="Congratulations Cards"
          subtitle="Say congrats in their language, from their culture"
          priceInCents={599}
          category="congratulations"
        />
      )}
    </div>
  );
}

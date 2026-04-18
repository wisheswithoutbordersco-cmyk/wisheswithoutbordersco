import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function ThinkingOfYouPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("THINKING_OF_YOU_CARDS");

  return (
    <div>
      <NavBar />
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="thinking of you cards" />
      ) : (
        <CardGallery cards={cards} title="Thinking of You Cards" subtitle="Let someone know you care — in their language" priceInCents={599} category="thinking_of_you" />
      )}
    </div>
  );
}

import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function InLovingMemoryPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("IN_LOVING_MEMORY_CARDS");

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="in loving memory cards" />
      ) : (
        <CardGallery
          cards={cards}
          title="In Loving Memory Cards"
          subtitle="Honor and remember loved ones across every culture"
          priceInCents={599}
          category="individual_card"
        />
      )}
    </div>
  );
}

import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function FathersDayPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("FATHERS_DAY_CARDS");

  return (
    <div>
      <NavBar />
      <p className="text-center italic text-[#d4af37]/70 text-sm py-3 bg-[#faf8f4]">He sacrificed everything. Send him something meaningful.</p>
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="father's day cards" />
      ) : (
        <CardGallery cards={cards} title="Father's Day Cards" subtitle="Celebrate dads from every corner of the world" priceInCents={599} category="fathers_day" />
      )}
    </div>
  );
}

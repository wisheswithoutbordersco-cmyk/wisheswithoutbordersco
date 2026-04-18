import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { useCardsBySource } from "@/hooks/useProductQuery";

export default function MothersDayPage() {
  const { cards, isLoading, error, isEmpty } = useCardsBySource("MOTHERS_DAY_CARDS");

  return (
    <div>
      <NavBar />
      <p className="text-center italic text-[#d4af37]/70 text-sm py-3 bg-[#faf8f4]">For the mom who stayed home so you could go further.</p>
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="mother's day cards" />
      ) : (
        <CardGallery cards={cards} title="Mother's Day Cards" subtitle="Honor moms around the world — in their language, with their culture" priceInCents={599} category="mothers_day" />
      )}
    </div>
  );
}

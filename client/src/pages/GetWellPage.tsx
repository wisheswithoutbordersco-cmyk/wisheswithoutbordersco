import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { GET_WELL_SOON_CARDS } from "@/lib/productData";
export default function GetWellPage() {
  return (
    <div>
      <NavBar />
      {GET_WELL_SOON_CARDS.length > 0 ? (
        <CardGallery cards={GET_WELL_SOON_CARDS} title="Get Well Soon Cards" subtitle="Send healing wishes from the heart, across every culture" priceInCents={599} category="get_well" />
      ) : (
        <div className="bg-[#F8F5EF] py-16 px-4 text-center min-h-screen">
          <div className="max-w-lg mx-auto pt-20">
            <h2 className="text-2xl font-bold font-serif text-[#0A1A2F] mb-3">Get Well Soon Cards</h2>
            <p className="text-[#0A1A2F]/60 mb-4">Send healing wishes from the heart, across every culture</p>
            <span className="inline-block bg-[#C9A86A]/20 text-[#0A1A2F] text-sm font-semibold px-4 py-2 rounded-full">Coming Soon</span>
          </div>
        </div>
      )}
    </div>
  );
}

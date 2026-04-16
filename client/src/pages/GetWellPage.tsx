import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { GET_WELL_SOON_CARDS } from "@/lib/productData";
export default function GetWellPage() {
  return <div><NavBar /><CardGallery cards={GET_WELL_SOON_CARDS} title="Get Well Soon Cards" subtitle="Send healing wishes from the heart, across every culture" priceInCents={599} category="get_well" /></div>;
}

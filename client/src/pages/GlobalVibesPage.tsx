import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { ShoppingCart, BookOpen } from "lucide-react";

const CDN3 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M";

const CDN_UPLOAD = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297";

const BOOKS = [
  { id: "book_jamaica", title: "A Day in Jamaica",  subtitle: "Bilingual English & Jamaican Patois", image: `${CDN3}/jamaica_cover_458bef47.png`,  description: "Follow Zara through a beautiful day in Jamaica — from morning greetings to evening prayers. Bilingual English & Jamaican Patois. 24 pages. Instant PDF download." },
  { id: "book_nigeria", title: "A Day in Nigeria",  subtitle: "Bilingual English & Yoruba",          image: `${CDN3}/nigeria_cover_bc3f19ed.png`,  description: "Join Kofi through a joyful day in Nigeria — from Yoruba greetings to evening family time. Bilingual English & Yoruba. 24 pages. Instant PDF download." },
  { id: "book_ghana",   title: "A Day in Ghana",    subtitle: "Bilingual English & Twi",            image: `${CDN3}/ghana_cover_a532e856.png`,   description: "Wake up with Ama and explore a beautiful day in Ghana — Adinkra symbols, kente cloth, and golden sunsets. Bilingual English & Twi. 24 pages. Instant PDF download." },
  { id: "book_south_korea", title: "A Day in South Korea", subtitle: "Bilingual English & Korean",  image: `${CDN_UPLOAD}/jbiedpwzTiSaHBkn.png`, description: "Discover a beautiful day in South Korea — from morning bows to evening lantern festivals. Bilingual English & Korean. 24 pages. Instant PDF download.", badge: "New" },
  { id: "book_japan",   title: "A Day in Japan",    subtitle: "Bilingual English & Japanese",       image: `${CDN_UPLOAD}/jytQsxuEWPdZEeqq.png`, description: "Follow Yuki through a magical day in Japan — cherry blossoms, torii gates, and koi ponds. Bilingual English & Japanese. 24 pages. Instant PDF download.", badge: "New" },
  { id: "book_india",   title: "A Day in India",    subtitle: "Bilingual English & Hindi",          image: `${CDN3}/india_cover_597f5831.png`,   description: "Experience a vibrant day in India — from morning puja to Diwali lights. Bilingual English & Hindi. 24 pages. Instant PDF download." },
  { id: "book_mexico",  title: "A Day in Mexico",   subtitle: "Bilingual English & Spanish",        image: `${CDN3}/cover_0cfdc928.png`,         description: "Celebrate a colorful day in Mexico — marigolds, abuelas, and Día de los Muertos traditions. Bilingual English & Spanish. 24 pages. Instant PDF download." },
  { id: "book_brazil",  title: "A Day in Brazil",   subtitle: "Bilingual English & Portuguese",     image: `${CDN3}/brazil_cover_4d639f3b.png`, description: "Dance through a joyful day in Brazil — Carnival rhythms, açaí, and Amazon sunsets. Bilingual English & Portuguese. 24 pages. Instant PDF download." },
  { id: "book_china",   title: "A Day in China",    subtitle: "Bilingual English & Mandarin",       image: `${CDN_UPLOAD}/lxzESRKObQshVYOB.png`, description: "Experience a vibrant day in China — from tai chi at dawn to lantern-lit evenings. Bilingual English & Mandarin. 24 pages. Instant PDF download.", badge: "New" },
  { id: "book_vietnam", title: "A Day in Vietnam",  subtitle: "Bilingual English & Vietnamese",     image: `${CDN_UPLOAD}/AnhwgycAUImzsrcj.png`, description: "Journey through a beautiful day in Vietnam — morning pho, conical hats, and floating markets. Bilingual English & Vietnamese. 24 pages. Instant PDF download.", badge: "New" },
  { id: "book_south_africa", title: "A Day in South Africa", subtitle: "Bilingual English & Zulu", image: `${CDN_UPLOAD}/KUtlFJUXShYxWVmv.png`, description: "Explore a joyful day in South Africa — from Ubuntu greetings to Table Mountain sunsets. Bilingual English & Zulu. 24 pages. Instant PDF download.", badge: "New" },
  { id: "book_philippines",  title: "A Day in the Philippines", subtitle: "Bilingual English & Filipino", image: `${CDN3}/philippines_cover.png`, description: "Explore a joyful day in the Philippines — from morning blessings to evening family gatherings. Bilingual English & Filipino. 24 pages. Instant PDF download." },
  { id: "book_dominican_republic", title: "A Day in the Dominican Republic", subtitle: "Bilingual English & Spanish", image: `${CDN3}/dominican_republic_cover.png`, description: "Experience a vibrant day in the Dominican Republic — merengue, mangoes, and Caribbean warmth. Bilingual English & Spanish. 24 pages. Instant PDF download." },
];

export default function GlobalVibesPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />

      <div className="bg-[#1a2744] text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="w-7 h-7 text-[#d4af37]" />
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest">Children's Books</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">A Day in the Life of...</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">24-page illustrated children's books celebrating authentic cultural traditions around the world.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-white/60">
          <span>📖 24 pages each</span>
          <span>🌍 Bilingual text</span>
          <span>🎨 Culturally authentic illustrations</span>
          <span>⚡ Instant PDF download · $4.99</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {BOOKS.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 group cursor-pointer"
              onClick={() => setSelectedProduct({ productId: book.id, name: book.title, image: book.image, price: 499, category: "book", description: book.description })}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x400/f5f0e8/1a2744?text=Book"; }} />
                {(book as any).badge && <span className="absolute top-2 left-2 bg-[#d4af37] text-[#1a2744] text-[10px] font-bold px-2 py-0.5 rounded-full z-10">{(book as any).badge}</span>}
                <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    View & Buy
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-bold text-[#1a2744] leading-tight">{book.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{book.subtitle}</p>
                <p className="text-sm font-bold text-[#d4af37] mt-2">$4.99</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-[#1a2744]/5 rounded-2xl p-6 text-center border border-[#d4af37]/20">
          <p className="text-[#1a2744] font-semibold text-sm mb-1">More books coming soon</p>
          <p className="text-gray-500 text-xs">New countries are added regularly — check back often for the latest additions!</p>
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      <footer className="bg-[#1a2744] text-white/60 text-center py-8 text-sm mt-8">
        <p className="italic text-[#d4af37]/70 text-sm mb-4">Send a piece of home, back home.</p>
        <p className="text-white font-semibold mb-1">Wishes Without Borders Co</p>
        <p>Multicultural children's books & educational tools · All products are instant digital downloads</p>
        <p className="mt-1"><a href="mailto:info@wisheswithoutbordersco.com" className="text-[#d4af37] hover:underline">info@wisheswithoutbordersco.com</a></p>
      </footer>
    </div>
  );
}

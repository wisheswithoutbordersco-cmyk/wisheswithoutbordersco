import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { ShoppingCart, BookOpen } from "lucide-react";

const CDN3 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M";

const BOOKS = [
  { id: "book_jamaica", title: "A Day in Jamaica",  subtitle: "Bilingual English & Jamaican Patois", image: `${CDN3}/jamaica_cover_458bef47.png`,  description: "Follow Zara through a beautiful day in Jamaica — from morning greetings to evening prayers. Bilingual English & Jamaican Patois. 24 pages. Instant PDF download.", comingSoon: true /* PDF is incomplete stub (23KB) — do not sell until final PDF is ready */ },
  { id: "book_nigeria", title: "A Day in Nigeria",  subtitle: "Bilingual English & Yoruba",          image: `${CDN3}/nigeria_cover_bc3f19ed.png`,  description: "Join Kofi through a joyful day in Nigeria — from Yoruba greetings to evening family time. Bilingual English & Yoruba. 24 pages. Instant PDF download.", comingSoon: true /* PDF is incomplete stub (23KB) — do not sell until final PDF is ready */ },
  { id: "book_ghana",   title: "A Day in Ghana",    subtitle: "Bilingual English & Twi",            image: `${CDN3}/ghana_cover_a532e856.png`,   description: "Wake up with Ama and explore a beautiful day in Ghana — Adinkra symbols, kente cloth, and golden sunsets. Bilingual English & Twi. 24 pages. Instant PDF download." },
  { id: "book_india",   title: "A Day in India",    subtitle: "Bilingual English & Hindi",          image: `${CDN3}/india_cover_597f5831.png`,   description: "Experience a vibrant day in India — from morning puja to Diwali lights. Bilingual English & Hindi. 24 pages. Instant PDF download.", comingSoon: true },
  { id: "book_mexico",  title: "A Day in Mexico",   subtitle: "Bilingual English & Spanish",        image: `${CDN3}/cover_0cfdc928.png`,         description: "Celebrate a colorful day in Mexico — marigolds, abuelas, and Día de los Muertos traditions. Bilingual English & Spanish. 24 pages. Instant PDF download.", comingSoon: true },
  { id: "book_brazil",  title: "A Day in Brazil",   subtitle: "Bilingual English & Portuguese",     image: `${CDN3}/brazil_cover_4d639f3b.png`, description: "Dance through a joyful day in Brazil — Carnival rhythms, açaí, and Amazon sunsets. Bilingual English & Portuguese. 24 pages. Instant PDF download.", comingSoon: true },
  { id: "book_philippines", title: "A Day in the Philippines", subtitle: "Bilingual English & Filipino", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/TexFgrnXnfuiXEET.pdf", description: "Explore a joyful day in the Philippines — from morning blessings to evening family gatherings. Bilingual English & Filipino. 24 pages. Instant PDF download.", comingSoon: true },
  { id: "book_dominican_republic", title: "A Day in the Dominican Republic", subtitle: "Bilingual English & Spanish", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/dominican_republic_cover.png", description: "Experience a vibrant day in the Dominican Republic — merengue, mangoes, and Caribbean warmth. Bilingual English & Spanish. 24 pages. Instant PDF download." },
  { id: "book_ethiopia", title: "A Day in Ethiopia", subtitle: "Bilingual English & Amharic", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/TdnsDiTbcTbsYODn.png", description: "Discover the rich culture of Ethiopia — from morning coffee ceremonies to vibrant Meskel celebrations. Bilingual English & Amharic. 24 pages. Instant PDF download." },
  { id: "book_kenya", title: "A Day in Kenya", subtitle: "Bilingual English & Swahili", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/AwouqsYwfcZOUJZJ.png", description: "Journey through a beautiful day in Kenya — from Maasai greetings to sunset over the savanna. Bilingual English & Swahili. 24 pages. Instant PDF download." },
  { id: "book_senegal", title: "A Day in Senegal", subtitle: "Bilingual English & Wolof", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/DvWKIXUxJNbVajMW.png", description: "Experience a joyful day in Senegal — from Teranga hospitality to colorful Sabar drumming. Bilingual English & Wolof. 24 pages. Instant PDF download." },
  { id: "book_south_africa", title: "A Day in South Africa", subtitle: "Bilingual English & Zulu", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/iuqSBvrFKyfNkKNb.png", description: "Experience a rainbow day in South Africa — Ubuntu spirit, vibrant markets, and Table Mountain views. Bilingual English & Zulu. 24 pages. Instant PDF download." },
  { id: "book_colombia", title: "A Day in Colombia", subtitle: "Bilingual English & Spanish", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/HCgzoKQNzNIzcfHM.png", description: "Explore a vibrant day in Colombia — cumbia rhythms, emerald mountains, and warm family traditions. Bilingual English & Spanish. 24 pages. Instant PDF download." },
  { id: "book_peru", title: "A Day in Peru", subtitle: "Bilingual English & Spanish", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/mTeItLEvHctWjVQI.png", description: "Discover a beautiful day in Peru — Andean melodies, ancient Inca traditions, and colorful textiles. Bilingual English & Spanish. 24 pages. Instant PDF download." },
  { id: "book_australia", title: "A Day in Australia", subtitle: "Bilingual English & Indigenous phrases", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/cpFUiQEojgQUZoiF.png", description: "Journey through a sunny day in Australia — from Aboriginal Dreamtime stories to beach adventures. Bilingual English & Indigenous phrases. 24 pages. Instant PDF download." },
  { id: "book_china", title: "A Day in China", subtitle: "Bilingual English & Mandarin", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/kItJMamypFtbbKqP.png", description: "Discover a wonderful day in China — dragon dances, calligraphy, and lantern festivals. Bilingual English & Mandarin. 24 pages. Instant PDF download." },
  { id: "book_indonesia", title: "A Day in Indonesia", subtitle: "Bilingual English & Bahasa Indonesia", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/gSvgHnNVPQatRpWL.png", description: "Explore a colorful day in Indonesia — batik art, gamelan music, and island warmth. Bilingual English & Bahasa Indonesia. 24 pages. Instant PDF download." },
  { id: "book_japan", title: "A Day in Japan", subtitle: "Bilingual English & Japanese", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/JVjgdIdySIVNyWZc.png", description: "Journey through a peaceful day in Japan — cherry blossoms, origami, and tea ceremonies. Bilingual English & Japanese. 24 pages. Instant PDF download." },
  { id: "book_south_korea", title: "A Day in South Korea", subtitle: "Bilingual English & Korean", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/dyzXRwfoRZLlIOPv.png", description: "Experience a vibrant day in South Korea — K-culture, hanbok traditions, and delicious kimchi. Bilingual English & Korean. 24 pages. Instant PDF download." },
  { id: "book_thailand", title: "A Day in Thailand", subtitle: "Bilingual English & Thai", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/dPSjfxGLqmfVmtxe.png", description: "Experience a magical day in Thailand — golden temples, floating markets, and warm smiles. Bilingual English & Thai. 24 pages. Instant PDF download." },
  { id: "book_egypt", title: "A Day in Egypt", subtitle: "Bilingual English & Arabic", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/hiCRTUCWIDljamSz.png", description: "Discover a fascinating day in Egypt — ancient pyramids, Nile River adventures, and vibrant bazaars. Bilingual English & Arabic. 24 pages. Instant PDF download." },
  { id: "book_saudi_arabia", title: "A Day in Saudi Arabia", subtitle: "Bilingual English & Arabic", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CibWXhYDEdELhyTm.png", description: "Experience a rich day in Saudi Arabia — desert traditions, Arabian hospitality, and cultural heritage. Bilingual English & Arabic. 24 pages. Instant PDF download." },
  { id: "book_greece", title: "A Day in Greece", subtitle: "Bilingual English & Greek", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/yqZRuGlcFqYLMgMR.png", description: "Explore a beautiful day in Greece — olive groves, ancient myths, and Mediterranean sunshine. Bilingual English & Greek. 24 pages. Instant PDF download." },
  { id: "book_italy", title: "A Day in Italy", subtitle: "Bilingual English & Italian", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/oQeNcUANrmOKKABz.png", description: "Discover a delightful day in Italy — pasta-making with Nonna, Renaissance art, and gelato in the piazza. Bilingual English & Italian. 24 pages. Instant PDF download." },
];

export default function GlobalVibesPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <NavBar />

      <div className="bg-[#0A1A2F] text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="w-7 h-7 text-[#C9A86A]" />
          <span className="text-[#C9A86A] font-semibold text-sm uppercase tracking-widest">Children's Books</span>
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
              className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 group ${book.comingSoon ? 'opacity-70 cursor-default' : 'cursor-pointer'}`}
              onClick={() => !book.comingSoon && setSelectedProduct({ productId: book.id, name: book.title, image: book.image, price: 499, category: "book", description: book.description })}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E"; }} />
                {book.comingSoon ? (
                  <div className="absolute inset-0 bg-[#0A1A2F]/50 flex items-center justify-center">
                    <span className="bg-white text-[#0A1A2F] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Coming Soon</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-[#0A1A2F]/0 group-hover:bg-[#0A1A2F]/30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#0A1A2F] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      View & Buy
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-bold text-[#0A1A2F] leading-tight">{book.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{book.subtitle}</p>
                <p className="text-sm font-bold text-[#C9A86A] mt-2">{book.comingSoon ? 'Coming Soon' : '$4.99'}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-[#0A1A2F]/5 rounded-2xl p-6 text-center border border-[#C9A86A]/20">
          <p className="text-[#0A1A2F] font-semibold text-sm mb-1">More books coming soon</p>
          <p className="text-gray-500 text-xs">South Korea, Japan, China, Philippines, Vietnam, and South Africa are in production.</p>
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      <footer className="bg-[#0A1A2F] text-white/60 text-center py-8 text-sm mt-8">
        <p className="italic text-[#C9A86A]/70 text-sm mb-4">Send a piece of home, back home.</p>
        <p className="text-white font-semibold mb-1">Wishes Without Borders Co</p>
        <p>Multicultural children's books & educational tools · All products are instant digital downloads</p>
        <p className="mt-1"><a href="mailto:info@wisheswithoutbordersco.com" className="text-[#C9A86A] hover:underline">info@wisheswithoutbordersco.com</a></p>
      </footer>
    </div>
  );
}

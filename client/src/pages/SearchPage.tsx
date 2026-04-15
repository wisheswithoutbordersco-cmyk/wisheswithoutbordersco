import { useState, useMemo } from "react";
import { Search, X, BookOpen, ImageIcon, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  ANNIVERSARY_CARDS, ANNIVERSARY_COUPLE_CARDS,
  BIRTHDAY_DAD_CARDS, BIRTHDAY_DAUGHTER_CARDS, BIRTHDAY_MOM_CARDS, BIRTHDAY_SON_CARDS,
  CONGRATULATIONS_CARDS, CONGRATULATIONS_V2_CARDS, CONGRATULATIONS_V3_CARDS,
  FAB_DAD_CARDS, FAB_DAD_V2_CARDS, FAB_MOM_CARDS,
  FATHERS_DAY_CARDS, GET_WELL_SOON_CARDS,
  GRADUATION_BOY_CARDS, GRADUATION_BOY_V2_CARDS,
  GRADUATION_GIRL_CARDS, GRADUATION_GIRL_V2_CARDS,
  GRADUATION_CARDS, GRADUATION_CONGRATS_CARDS, GRADUATION_CONGRATS_V2_CARDS,
  MOTHERS_DAY_CARDS, SYMPATHY_CARDS, SYMPATHY_V2_CARDS,
  THANK_YOU_CARDS, THINKING_OF_YOU_CARDS, THINKING_OF_YOU_V2_CARDS,
  BABY_SHOWER_CARDS, HAPPY_NEW_YEAR_CARDS,
  IN_LOVING_MEMORY_CARDS, IN_LOVING_MEMORY_V2_CARDS, IN_LOVING_MEMORY_V3_CARDS,
  WALL_ART_PRODUCTS,
} from "@/lib/productData";

// ── Book data ─────────────────────────────────────────────────────────────
const BOOKS = [
  { id: "book_world", name: "A Day in the Life Of: World", country: "World", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CmcbdhnEytHcSMMb.png" },
  { id: "book_ethiopia", name: "A Day in the Life Of: Ethiopia", country: "Ethiopia", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/GXjBIEKlpNMQhRoT.png" },
  { id: "book_ghana", name: "A Day in the Life Of: Ghana", country: "Ghana", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/fLcZNFgdPpPKyvWO.png" },
  { id: "book_kenya", name: "A Day in the Life Of: Kenya", country: "Kenya", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/dEDSFxroHlzIcQIy.png" },
  { id: "book_nigeria", name: "A Day in the Life Of: Nigeria", country: "Nigeria", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/DtAXRyMzliSfLnzs.png" },
  { id: "book_senegal", name: "A Day in the Life Of: Senegal", country: "Senegal", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/AhvDHRUzjhnbbqOP.png" },
  { id: "book_south_africa", name: "A Day in the Life Of: South Africa", country: "South Africa", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/thwnMBRRvbUxVfZX.png" },
  { id: "book_argentina", name: "A Day in the Life Of: Argentina", country: "Argentina", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/qlkjnnePdlJXVSAe.png" },
  { id: "book_brazil", name: "A Day in the Life Of: Brazil", country: "Brazil", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/cipcgmvMIDFPrwss.png" },
  { id: "book_canada", name: "A Day in the Life Of: Canada", country: "Canada", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/qzYClomwhdXwwvZi.png" },
  { id: "book_chile", name: "A Day in the Life Of: Chile", country: "Chile", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/okXbAAicChflQJvX.png" },
  { id: "book_colombia", name: "A Day in the Life Of: Colombia", country: "Colombia", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/iCmZnbNeoArTROfE.png" },
  { id: "book_cuba", name: "A Day in the Life Of: Cuba", country: "Cuba", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/GdjVAPmlqQuUupOT.png" },
  { id: "book_dominican_republic", name: "A Day in the Life Of: Dominican Republic", country: "Dominican Republic", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/JAGwGlQrFMTpJafD.png" },
  { id: "book_ecuador", name: "A Day in the Life Of: Ecuador", country: "Ecuador", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/hVbcvaCpwNvqKBHD.png" },
  { id: "book_haiti", name: "A Day in the Life Of: Haiti", country: "Haiti", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/yVXCkjMVZUbIFkXa.png" },
  { id: "book_jamaica", name: "A Day in the Life Of: Jamaica", country: "Jamaica", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/ULJkeCdXgWaYaeWK.png" },
  { id: "book_mexico", name: "A Day in the Life Of: Mexico", country: "Mexico", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/WoHDWjgqgjSmyzAM.png" },
  { id: "book_peru", name: "A Day in the Life Of: Peru", country: "Peru", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/eeHhzYYVXaJqpZKL.png" },
  { id: "book_puerto_rico", name: "A Day in the Life Of: Puerto Rico", country: "Puerto Rico", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/xpjWYNMNflKVUsJr.png" },
  { id: "book_united_states", name: "A Day in the Life Of: United States", country: "United States", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/eeHhzYYVXaJqpZKL.png" },
  { id: "book_venezuela", name: "A Day in the Life Of: Venezuela", country: "Venezuela", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/xpjWYNMNflKVUsJr.png" },
  { id: "book_australia", name: "A Day in the Life Of: Australia", country: "Australia", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/kRupMbWMwmfPoLbQ.png" },
  { id: "book_china", name: "A Day in the Life Of: China", country: "China", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/ihejpObNinMalpVo.png" },
  { id: "book_india", name: "A Day in the Life Of: India", country: "India", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/rpQTbfQawrLPmxfM.png" },
  { id: "book_indonesia", name: "A Day in the Life Of: Indonesia", country: "Indonesia", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/eNpFzUyFqWIIdUjH.png" },
  { id: "book_japan", name: "A Day in the Life Of: Japan", country: "Japan", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/xyJYoIXPBYchyoAp.png" },
  { id: "book_new_zealand", name: "A Day in the Life Of: New Zealand", country: "New Zealand", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/LQwXdwVefKUhLzAC.png" },
  { id: "book_philippines", name: "A Day in the Life Of: Philippines", country: "Philippines", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/BYrSpHMgnNCoLutf.png" },
  { id: "book_south_korea", name: "A Day in the Life Of: South Korea", country: "South Korea", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/KqYQihBErmIXJPnR.png" },
  { id: "book_thailand", name: "A Day in the Life Of: Thailand", country: "Thailand", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/KqYQihBErmIXJPnR.png" },
  { id: "book_vietnam", name: "A Day in the Life Of: Vietnam", country: "Vietnam", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/BYrSpHMgnNCoLutf.png" },
  { id: "book_egypt", name: "A Day in the Life Of: Egypt", country: "Egypt", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CmcbdhnEytHcSMMb.png" },
  { id: "book_morocco", name: "A Day in the Life Of: Morocco", country: "Morocco", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CmcbdhnEytHcSMMb.png" },
  { id: "book_saudi_arabia", name: "A Day in the Life Of: Saudi Arabia", country: "Saudi Arabia", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CmcbdhnEytHcSMMb.png" },
  { id: "book_uae", name: "A Day in the Life Of: United Arab Emirates", country: "United Arab Emirates", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CmcbdhnEytHcSMMb.png" },
  { id: "book_greece", name: "A Day in the Life Of: Greece", country: "Greece", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CmcbdhnEytHcSMMb.png" },
  { id: "book_italy", name: "A Day in the Life Of: Italy", country: "Italy", price: 899, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CmcbdhnEytHcSMMb.png" },
];

// ── Merge all card arrays ─────────────────────────────────────────────────
const ALL_CARDS = [
  ...ANNIVERSARY_CARDS, ...ANNIVERSARY_COUPLE_CARDS,
  ...BIRTHDAY_DAD_CARDS, ...BIRTHDAY_DAUGHTER_CARDS,
  ...BIRTHDAY_MOM_CARDS, ...BIRTHDAY_SON_CARDS,
  ...CONGRATULATIONS_CARDS, ...CONGRATULATIONS_V2_CARDS, ...CONGRATULATIONS_V3_CARDS,
  ...FAB_DAD_CARDS, ...FAB_DAD_V2_CARDS, ...FAB_MOM_CARDS,
  ...FATHERS_DAY_CARDS, ...GET_WELL_SOON_CARDS,
  ...GRADUATION_BOY_CARDS, ...GRADUATION_BOY_V2_CARDS,
  ...GRADUATION_GIRL_CARDS, ...GRADUATION_GIRL_V2_CARDS,
  ...GRADUATION_CARDS, ...GRADUATION_CONGRATS_CARDS, ...GRADUATION_CONGRATS_V2_CARDS,
  ...MOTHERS_DAY_CARDS, ...SYMPATHY_CARDS, ...SYMPATHY_V2_CARDS,
  ...THANK_YOU_CARDS, ...THINKING_OF_YOU_CARDS, ...THINKING_OF_YOU_V2_CARDS,
  ...BABY_SHOWER_CARDS, ...HAPPY_NEW_YEAR_CARDS,
  ...IN_LOVING_MEMORY_CARDS, ...IN_LOVING_MEMORY_V2_CARDS, ...IN_LOVING_MEMORY_V3_CARDS,
];

type ResultType = "card" | "wall-art" | "book";
interface SearchResult {
  id: string;
  name: string;
  country: string;
  type: ResultType;
  price: number;
  image: string;
}

function typeBadgeClass(type: ResultType) {
  if (type === "card") return "bg-blue-500/20 text-blue-300";
  if (type === "wall-art") return "bg-purple-500/20 text-purple-300";
  return "bg-amber-500/20 text-amber-300";
}

function typeLabel(type: ResultType) {
  if (type === "card") return "Card";
  if (type === "wall-art") return "Wall Art";
  return "Book";
}

function TypeIcon({ type }: { type: ResultType }) {
  if (type === "card") return <CreditCard className="w-3 h-3" />;
  if (type === "wall-art") return <ImageIcon className="w-3 h-3" />;
  return <BookOpen className="w-3 h-3" />;
}

export function SearchPage() {
  const { addItem } = useCart();
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  // Build unified search index — deduplicate cards by country+name
  const allResults = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];
    const seenCards = new Set<string>();

    for (const card of ALL_CARDS) {
      const key = `${card.country}-${card.name}`;
      if (!seenCards.has(key)) {
        seenCards.add(key);
        results.push({ id: card.id, name: card.name, country: card.country, type: "card", price: card.price, image: card.image });
      }
    }

    for (const art of WALL_ART_PRODUCTS) {
      results.push({ id: art.id, name: art.name, country: art.country, type: "wall-art", price: art.price, image: art.image });
    }

    for (const book of BOOKS) {
      results.push({ id: book.id, name: book.name, country: book.country, type: "book", price: book.price, image: book.image });
    }

    return results;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allResults
      .filter(
        (r) =>
          r.country.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      )
      .slice(0, 80);
  }, [query, allResults]);

  // Group by country
  const byCountry = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    for (const r of filtered) {
      if (!map[r.country]) map[r.country] = [];
      map[r.country].push(r);
    }
    return map;
  }, [filtered]);

  const countries = Object.keys(byCountry).sort();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(input);
  }

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white">
      {/* Search header */}
      <div className="bg-[#12203a] border-b border-white/10 px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Search Everything</h1>
          <p className="text-white/50 text-sm mb-6">
            Cards · Wall Art · Children's Books — search by country, type, or occasion
          </p>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try 'Jamaica', 'Nigeria', 'birthday', 'wall art'..."
              className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A86A] transition-colors text-sm"
            />
            {input && (
              <button
                type="button"
                onClick={() => { setInput(""); setQuery(""); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
          {query && (
            <p className="text-white/40 text-xs mt-3">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              {filtered.length === 80 ? " (showing top 80)" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!query && (
          <div className="text-center py-20 text-white/30">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Start typing to search across all products</p>
            <p className="text-sm mt-2">2,597+ cards · 100 wall art prints · 38 children's books</p>
          </div>
        )}

        {query && filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm mt-2">Try a country name like &ldquo;Jamaica&rdquo; or &ldquo;Nigeria&rdquo;</p>
          </div>
        )}

        {countries.map((country) => (
          <div key={country} className="mb-10">
            <h2 className="text-[#C9A86A] font-bold text-lg mb-4 flex items-center gap-2">
              {country}
              <span className="text-white/30 text-sm font-normal">
                {byCountry[country].length} product{byCountry[country].length !== 1 ? "s" : ""}
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {byCountry[country].map((result) => (
                <div
                  key={result.id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#C9A86A]/50 transition-all group"
                >
                  <div className="aspect-[4/3] bg-[#1a2a3a] overflow-hidden">
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-3xl">
                        {result.type === "book" ? "📖" : result.type === "wall-art" ? "🖼️" : "💌"}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div
                      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full mb-1.5 ${typeBadgeClass(result.type)}`}
                    >
                      <TypeIcon type={result.type} />
                      {typeLabel(result.type)}
                    </div>
                    <p className="text-white text-xs font-semibold leading-tight line-clamp-2 mb-2">
                      {result.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#C9A86A] font-bold text-sm">
                        ${(result.price / 100).toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          addItem({
                            productId: result.id,
                            name: result.name,
                            price: result.price,
                            image: result.image,
                            category: result.type,
                          })
                        }
                        className="text-xs bg-[#C9A86A] text-black px-2 py-1 rounded-lg font-semibold hover:bg-[#b8975a] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

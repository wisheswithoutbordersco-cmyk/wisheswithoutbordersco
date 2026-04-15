import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { BRAND, DIGITAL_PRODUCTS } from "@/lib/productData";
import { Globe, BookOpen, Baby, Heart, GraduationCap, Star, Flower2, Sun, Smile, Ribbon, Search, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ECOSYSTEM_TILES = [
  { href: "/birthday",       title: "Digital Downloads",     whisper: "Instant PDF · Print at home",          icon: "⬇️", badge: "1,927+ Cards"   },
  { href: "/print-shop",     title: "Print Shop",            whisper: "Launching with Gelato",                icon: "🖼️", badge: "Coming Soon"   },
  { href: "/kids-classroom", title: "Kids' Books",           whisper: "Cultural learning for little ones",    icon: "📚", badge: "Coming Soon"     },
  { href: "/kids-classroom", title: "Teacher SEL Kits",      whisper: "Classroom-ready cultural tools",       icon: "🎓", badge: "Coming Soon"     },
  { href: "/birthday",       title: "Global Greeting Cards", whisper: "188 countries · 13 card types",        icon: "🌍", badge: "188 Countries"  },
  { href: "/coming-soon",    title: "Subscriptions",         whisper: "Monthly cultural card bundles",        icon: "✉️", badge: "Coming Soon"   },
];

const CATEGORIES = [
  { href: "/birthday",         icon: Star,          title: "Birthday Cards",        desc: "183 countries · For Mom, Dad, Son & Daughter",   color: "bg-[#c0392b]", badge: "732 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/hGMYxDgNFYKPyHsQ.png" },
  { href: "/anniversary",      icon: Heart,         title: "Anniversary Cards",     desc: "182 countries · Celebrate love & commitment",    color: "bg-[#8e44ad]", badge: "182 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/ljMpFqDvvsppUCye.png" },
  { href: "/graduation",       icon: GraduationCap, title: "Graduation Cards",      desc: "181 countries · Boy, Girl & Congrats designs",   color: "bg-[#1a3a5c]", badge: "429 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/EthVxYncoasrglOu.png" },
  { href: "/congratulations",  icon: Smile,         title: "Congratulations Cards", desc: "183 countries · Vibrant celebration designs",    color: "bg-[#27ae60]", badge: "183 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/NAUSTwxtLHXctwYN.png" },
  { href: "/thank-you",        icon: Ribbon,        title: "Thank You Cards",       desc: "182 countries · Express gratitude beautifully",  color: "bg-[#C9A86A]", badge: "182 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/MoXLVIswhUKelaoh.png" },
  { href: "/thinking-of-you",  icon: Heart,          title: "Thinking of You",      desc: "48 countries · Let someone know you care",       color: "bg-[#e74c3c]", badge: "48 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/PGldwkbsXcDsdfWK.png" },
  { href: "/get-well",         icon: Sun,           title: "Get Well Soon Cards",   desc: "182 countries · Send healing wishes",            color: "bg-[#e67e22]", badge: "182 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/wJbYssMMJMMeUrmJ.png" },
  { href: "/sympathy",         icon: Heart,         title: "Sympathy Cards",        desc: "182 countries · Comfort & compassion",           color: "bg-[#7f8c8d]", badge: "182 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/jKZVtdYbYdEsJvuG.png" },
  { href: "/mothers-day",      icon: Flower2,       title: "Mother's Day Cards",    desc: "157 countries · Honor moms worldwide",           color: "bg-[#e91e8c]", badge: "157 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/CdMQAhOLulBvPpoH.png" },
  { href: "/fathers-day",      icon: Star,          title: "Father's Day Cards",    desc: "157 countries · Celebrate dads everywhere",      color: "bg-[#0A1A2F]", badge: "157 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/MgKUuglFKxjndAwT.png" },
  { href: "/new-year",         icon: Star,          title: "New Year Cards",        desc: "182 countries · Ring in the new year",           color: "bg-[#2c3e50]", badge: "182 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/hGMYxDgNFYKPyHsQ.png" },
  { href: "/in-loving-memory", icon: Heart,         title: "In Loving Memory",      desc: "182 countries · Honor those we have lost",       color: "bg-[#4a4a4a]", badge: "182 Cards",  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/otsBlfJRKABgLvfl.png" },
  { href: "/coloring-books",   icon: BookOpen,      title: "Coloring Books",        desc: "Africa & Americas editions · Cultural art",      color: "bg-[#2ecc71]", badge: "2 Books",    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/AgwcVNlhaHqImIzH.png" },
  { href: "/cookbooks",        icon: BookOpen,      title: "Cookbooks",             desc: "Multicultural recipes from around the world",    color: "bg-[#e74c3c]", badge: "Coming Soon", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/NToGAkZpVLAUzWzo.png" },
  { href: "/baby-shower",      icon: Baby,          title: "Baby Shower Games",     desc: "Cultural baby shower game bundles",              color: "bg-[#f39c12]", badge: "Coming Soon", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/uvafdvnjaEcMavYL.png" },
];

const ALL_COUNTRIES = ["Afghanistan","Albania","Algeria","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Democratic Republic of Congo","Denmark","Djibouti","Dominica","Dominican Republic","Dubai","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea","Kosovo","Kuwait","Kyrgyzstan","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Republic of Congo","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor Leste","Togo","Tonga","Trinidad Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Kingdom","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

export default function Home() {
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSubmitted, setFooterSubmitted] = useState(false);
  const footerSubscribe = trpc.shop.subscribeNewsletter.useMutation();
  const [countryQuery, setCountryQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("birthday");
  const searchRef = useRef<HTMLDivElement>(null);

  const SEARCH_CATEGORIES = [
    { key: "birthday",        label: "Birthday" },
    { key: "anniversary",     label: "Anniversary" },
    { key: "graduation",      label: "Graduation" },
    { key: "congratulations", label: "Congrats" },
    { key: "thank-you",       label: "Thank You" },
    { key: "thinking-of-you", label: "Thinking of You" },
    { key: "sympathy",        label: "Sympathy" },
    { key: "get-well",        label: "Get Well" },
    { key: "mothers-day",     label: "Mother's Day" },
    { key: "fathers-day",     label: "Father's Day" },
  ];

  const countrySuggestions = countryQuery.trim().length > 0
    ? ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCountrySelect(country: string) {
    setCountryQuery("");
    setShowSuggestions(false);
    window.location.href = `/${selectedCategory}?country=${encodeURIComponent(country)}`;
  }

  function handleCountrySearch(e: React.FormEvent) {
    e.preventDefault();
    if (countrySuggestions.length > 0) {
      handleCountrySelect(countrySuggestions[0]);
    } else if (countryQuery.trim()) {
      window.location.href = `/${selectedCategory}?country=${encodeURIComponent(countryQuery.trim())}`;
    }
  }

  async function handleFooterSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!footerEmail.trim()) return;
    try {
      const result = await footerSubscribe.mutateAsync({ email: footerEmail.trim(), source: "homepage_footer" });
      setFooterSubmitted(true);
      toast.success(result.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F5EF" }}>
      <NavBar />

      {/* ─── HERO ─── */}
      <div className="relative overflow-hidden" style={{ background: "#0A1A2F" }}>
        {/* Subtle noise texture overlay at ~3% opacity */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
            opacity: 0.35,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-8 md:px-14 py-20 md:py-28 flex flex-col md:flex-row items-center gap-14">
          <div className="text-center md:text-left flex-1">
            <p
              className="text-xs font-bold uppercase mb-5"
              style={{ color: "#C9A86A", letterSpacing: "0.25em", fontFamily: "'DM Sans', sans-serif" }}
            >
              Wishes Without Borders Co
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
              style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}
            >
              For every culture.<br />
              <span style={{ color: "#C9A86A" }}>For every moment.</span>
            </h1>
            <p
              className="text-base md:text-lg max-w-xl mb-10"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75 }}
            >
              Multicultural greeting cards, prints, children's books, and classroom tools — celebrating the world's cultures, one card at a time.
            </p>

            {/* Country search bar */}
            <div ref={searchRef} className="relative mb-8 max-w-lg">
              <form
                onSubmit={handleCountrySearch}
                className="flex items-center rounded-full overflow-visible transition-colors"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                <Search className="w-5 h-5 ml-4 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                <input
                  type="text"
                  value={countryQuery}
                  onChange={(e) => { setCountryQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search by country… e.g. Japan, Brazil"
                  className="flex-1 bg-transparent text-sm px-3 py-3.5 outline-none"
                  style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="m-1 px-5 py-2 font-bold text-sm rounded-full transition-colors shrink-0"
                  style={{ background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Find Cards
                </button>
              </form>
              {showSuggestions && countrySuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {countrySuggestions.map((country) => (
                    <li key={country}>
                      <button
                        type="button"
                        onMouseDown={() => handleCountrySelect(country)}
                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors hover:bg-[#F8F5EF]"
                        style={{ color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: "#C9A86A" }} />
                        {country}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/birthday"
                className="px-9 py-3.5 font-bold rounded-full transition-colors text-sm"
                style={{ background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
              >
                Shop Digital
              </Link>
              <Link
                href="/print-shop"
                className="px-9 py-3.5 font-semibold rounded-full transition-colors text-sm"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Shop Prints
              </Link>
            </div>
          </div>

          {/* Logo */}
          {BRAND.logo && (
            <div className="shrink-0 opacity-90">
              <img
                src={BRAND.logo}
                alt="Wishes Without Borders Co logo"
                className="w-44 md:w-60 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Whisper tagline */}
      <p
        className="text-center italic text-sm py-4"
        style={{ color: "#C9A86A", opacity: 0.7, background: "#F8F5EF", fontFamily: "'Playfair Display', serif" }}
      >
        Because Mama deserves to hear it in her language.
      </p>

      {/* Stats bar */}
      <div className="overflow-x-auto" style={{ background: "#C9A86A" }}>
        <div
          className="flex items-center justify-start md:justify-center gap-x-5 px-6 py-2.5 min-w-max mx-auto text-xs font-semibold"
          style={{ color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
        >
          <span className="whitespace-nowrap">🌍 188 Countries</span>
          <span className="whitespace-nowrap">🃏 1,927+ Cards</span>
          <span className="whitespace-nowrap">📚 Workbooks</span>
          <span className="whitespace-nowrap">🎉 Baby Shower</span>
          <span className="whitespace-nowrap">⚡ Instant PDF</span>
          <span className="whitespace-nowrap">🖨️ Print at Home</span>
        </div>
      </div>

      <hr className="gold-divider" />

      {/* ─── ECOSYSTEM GRID ─── */}
      <div className="py-16 px-6" style={{ background: "#F8F5EF" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-2"
            style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
          >
            Everything We Make
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: "rgba(10,26,47,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
            One mission — celebrating every culture, for every moment.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {ECOSYSTEM_TILES.map((tile) => (
              <Link
                key={tile.title}
                href={tile.href}
                className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all"
                style={{ border: "1px solid rgba(201,168,106,0.2)" }}
              >
                <span className="text-3xl mb-3">{tile.icon}</span>
                <h3
                  className="font-bold text-sm mb-1 transition-colors group-hover:opacity-70"
                  style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
                >
                  {tile.title}
                </h3>
                <p className="text-xs mb-2" style={{ color: "rgba(10,26,47,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                  {tile.whisper}
                </p>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ color: "#C9A86A", background: "rgba(201,168,106,0.1)" }}
                >
                  {tile.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <hr className="gold-divider" />

      {/* ─── CARD GALLERY WITH FILTER PILLS ─── */}
      <div className="py-14 px-6" style={{ background: "#F8F5EF" }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-2"
            style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
          >
            All Card Types
          </h2>
          <p className="text-center text-sm mb-5" style={{ color: "rgba(10,26,47,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
            Browse all greeting card occasions — $5.99 each · Instant PDF Download
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {SEARCH_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
                style={
                  selectedCategory === cat.key
                    ? { background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }
                    : { background: "#fff", border: "1px solid rgba(201,168,106,0.3)", color: "rgba(10,26,47,0.6)", fontFamily: "'DM Sans', sans-serif" }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href + cat.title}
                  href={cat.href}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col items-center text-center"
                  style={{ border: "1px solid rgba(201,168,106,0.18)" }}
                >
                  {cat.image ? (
                    <div className="w-full aspect-[3/4] overflow-hidden mb-3">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" style={{ transform: 'scale(1.12)' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.parentElement?.querySelector(".icon-fallback") as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div className={`icon-fallback w-12 h-12 rounded-full ${cat.color} items-center justify-center hidden`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 pb-0">
                      <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="px-4 pb-4">
                    <h3 className="font-bold text-sm leading-tight mb-1" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
                      {cat.title}
                    </h3>
                    <p className="text-xs leading-tight mb-2" style={{ color: "rgba(10,26,47,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                      {cat.desc}
                    </p>
                    <span
                      className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                      style={{ background: "rgba(201,168,106,0.15)", color: "#9a7a3a" }}
                    >
                      {cat.badge}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="gold-divider" />

      {/* ─── PRINT SHOP FEATURE ─── */}
      <div className="py-24 px-6" style={{ background: "#F8F5EF" }}>
        <div className="max-w-6xl mx-auto">
          {/* Whisper background text */}
          <div className="relative">
            <p
              className="absolute inset-0 flex items-center justify-center text-center font-bold select-none pointer-events-none"
              style={{
                color: "#0A1A2F",
                opacity: 0.04,
                fontSize: "clamp(4rem, 12vw, 9rem)",
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Print Shop
            </p>
            <div className="relative flex flex-col md:flex-row items-center gap-14 pt-4">
              {/* Editorial framed print mockup */}
              <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-xs">
                  {/* Frame */}
                  <div
                    className="rounded-2xl overflow-hidden shadow-2xl"
                    style={{ background: "#fff", border: "1px solid rgba(201,168,106,0.18)" }}
                  >
                    <div className="p-5" style={{ background: "#FAFAF8" }}>
                      <div
                        className="aspect-[4/5] rounded-xl flex items-center justify-center"
                        style={{
                          background: "linear-gradient(145deg, #F8F5EF 0%, #EDE8DC 100%)",
                          border: "10px solid #fff",
                          boxShadow: "0 6px 40px rgba(10,26,47,0.08)",
                        }}
                      >
                        <div className="text-center px-6">
                          <p
                            className="font-bold text-xl mb-2"
                            style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
                          >
                            Wall Art
                          </p>
                          <div className="w-10 h-0.5 mx-auto mb-3" style={{ background: "#C9A86A" }} />
                          <p
                            className="text-xs uppercase tracking-widest"
                            style={{ color: "#C9A86A", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Museum Quality
                          </p>
                          <p
                            className="text-xs mt-5"
                            style={{ color: "#0A1A2F", opacity: 0.35, fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Gelato Print Network
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="px-5 py-3 flex items-center justify-between"
                      style={{ borderTop: "1px solid rgba(201,168,106,0.12)" }}
                    >
                      <span
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "#C9A86A", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Coming Soon
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "#0A1A2F", opacity: 0.35, fontFamily: "'DM Sans', sans-serif" }}
                      >
                        via Gelato
                      </span>
                    </div>
                  </div>
                  {/* Decorative accent */}
                  <div
                    className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full"
                    style={{ background: "#C9A86A", opacity: 0.08 }}
                  />
                </div>
              </div>

              {/* Text + CTAs */}
              <div className="flex-1 text-center md:text-left">
                <p
                  className="text-xs font-bold uppercase mb-4"
                  style={{ color: "#C9A86A", letterSpacing: "0.25em", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Coming Soon
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-5"
                  style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
                >
                  The Print Shop<br />is Coming
                </h2>
                <p
                  className="text-base mb-8 max-w-md"
                  style={{ color: "rgba(10,26,47,0.55)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75 }}
                >
                  Museum-quality cultural wall art, country prints, and kids room prints — delivered to your door through Gelato's global print network. No inventory, no waste. Just beautiful prints that celebrate culture.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href="/print-shop"
                    className="px-8 py-3.5 font-bold rounded-full transition-colors text-sm"
                    style={{ background: "#0A1A2F", color: "#C9A86A", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Preview the Print Shop
                  </Link>
                  <Link
                    href="/print-shop/wall-art"
                    className="px-8 py-3.5 font-semibold rounded-full transition-colors text-sm"
                    style={{ border: "1px solid rgba(10,26,47,0.18)", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Wall Art
                  </Link>
                  <Link
                    href="/print-shop/country"
                    className="px-8 py-3.5 font-semibold rounded-full transition-colors text-sm"
                    style={{ border: "1px solid rgba(10,26,47,0.18)", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Country Prints
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="gold-divider" />

      {/* ─── NEW ARRIVALS: DIGITAL PRODUCTS ─── */}
      <div className="py-20 px-6" style={{ background: "#F8F5EF" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>New Arrivals</h2>
          <p className="text-center mb-8">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "rgba(201,168,106,0.15)", color: "#C9A86A" }}>
              \uD83C\uDD95 New Arrivals
            </span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {DIGITAL_PRODUCTS.map((dp) => {
              const badgeColors: Record<string, string> = { bestseller: "bg-amber-500", staffpick: "bg-purple-600", new: "bg-emerald-500", seasonal: "bg-rose-500" };
              return (
                <Link
                  key={dp.id}
                  href={dp.slug}
                  className="group relative bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(201,168,106,0.25)]"
                  style={{ border: "1px solid rgba(201,168,106,0.18)" }}
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img src={dp.image} alt={dp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    <span className={`absolute top-3 left-3 ${badgeColors[dp.badgeType] || "bg-emerald-500"} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md`}>
                      {dp.badge}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
                      <span className="bg-[#C9A86A] text-[#0A1A2F] text-xs font-bold px-5 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        View Product
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-sm leading-tight mb-1" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>{dp.title}</h3>
                    <p className="text-xs leading-tight mb-2 flex-1" style={{ color: "rgba(10,26,47,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                      {dp.categoryLabel}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: "#C9A86A" }}>${(dp.price / 100).toFixed(2)}</span>

                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="gold-divider" />

      {/* ─── HOW IT WORKS ─── */}
      <div className="py-22 px-6" style={{ background: "#0A1A2F" }}>
        <div className="max-w-5xl mx-auto">
          {/* Whisper text */}
          <p
            className="text-center font-bold select-none pointer-events-none mb-0"
            style={{
              color: "#C9A86A",
              opacity: 0.05,
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1,
            }}
          >
            How It Works
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-2 -mt-8"
            style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}
          >
            How It Works
          </h2>
          <p
            className="text-center text-sm mb-14"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Get your card in 3 easy steps — no shipping, no waiting.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", icon: "🔍", title: "Browse",       desc: "Choose your country, occasion, and card type from our collection of 1,927+ cards across 188 countries." },
              { step: "02", icon: "⬇️", title: "Download",     desc: "Complete your secure checkout and receive your PDF instantly — no account required." },
              { step: "03", icon: "🖨️", title: "Print & Send", desc: "Print at home on any printer, or send the PDF digitally by email or text. Ready in minutes." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <span className="text-5xl">{item.icon}</span>
                  <span
                    className="absolute -top-2 -right-4 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "#C9A86A", color: "#0A1A2F" }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link
              href="/birthday"
              className="inline-block font-bold px-10 py-4 rounded-full transition-colors text-sm"
              style={{ background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
            >
              Start Shopping →
            </Link>
          </div>
        </div>
      </div>

      <hr className="gold-divider" />

      {/* ─── FOOTER ─── */}
      <footer className="py-14 px-6" style={{ background: "#0A1A2F" }}>
        <div className="max-w-md mx-auto mb-10 text-center">
          <p className="font-semibold text-base mb-1" style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}>
            Stay in the loop
          </p>
          <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
            New countries and products added every month. Be the first to know.
          </p>
          {footerSubmitted ? (
            <p className="font-semibold text-sm" style={{ color: "#C9A86A" }}>
              You are on the list — we will be in touch!
            </p>
          ) : (
            <form onSubmit={handleFooterSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                className="flex-1 rounded-full px-4 py-2 text-sm outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button
                type="submit"
                disabled={footerSubscribe.isPending}
                className="font-bold text-sm px-5 py-2 rounded-full transition-colors whitespace-nowrap disabled:opacity-60"
                style={{ background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
              >
                {footerSubscribe.isPending ? "..." : "Notify Me"}
              </button>
            </form>
          )}
        </div>
        <p
          className="italic text-sm mb-10 text-center"
          style={{ color: "rgba(201,168,106,0.6)", fontFamily: "'Playfair Display', serif" }}
        >
          Send a piece of home, back home.
        </p>
        <div className="max-w-5xl mx-auto pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm">
            {[
              { href: "/",              label: "About" },
              { href: "/print-shop",   label: "Print Shop" },
              { href: "/birthday",     label: "Digital Shop" },
              { href: "/kids-classroom", label: "Kids" },
              { href: "/kids-classroom", label: "Teachers" },
              { href: "mailto:info@wisheswithoutbordersco.com", label: "Contact", isExternal: true },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms-of-service", label: "Terms of Service" },
            ].map((item) =>
              item.isExternal ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition-colors hover:opacity-80"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition-colors hover:opacity-80"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-4 h-4" style={{ color: "#C9A86A" }} />
            <span className="font-semibold" style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}>
              Wishes Without Borders Co
            </span>
          </div>
          <p
            className="text-center text-xs"
            style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Multicultural greeting cards &amp; educational tools · All products are instant digital downloads
          </p>
          <p className="mt-1 text-center">
            <a
              href="mailto:info@wisheswithoutbordersco.com"
              className="text-sm hover:underline"
              style={{ color: "#C9A86A" }}
            >
              info@wisheswithoutbordersco.com
            </a>
          </p>
          <p className="mt-4 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 Wishes Without Borders Co · Anthony & Latisha Lane · All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { BRAND } from "@/lib/productData";
import { Globe, BookOpen, Baby, Heart, GraduationCap, Star, Flower2, Sun, Smile, Ribbon, Search, Sparkles, Printer } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// 8 top-level product categories shown in the visual Browse by Category grid
const BROWSE_CATEGORIES = [
  {
    href: "/birthday",
    title: "Greeting Cards",
    desc: "183 countries · Birthday, Anniversary, Sympathy & more",
    badge: "2,567 Cards",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/fr_birthday_mom_4f0c002c.png",
  },
  {
    href: "/graduation",
    title: "Graduation Cards",
    desc: "181 countries · Boy, Girl & Congratulations designs",
    badge: "429 Cards",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/australia_graduation_boy_41de4040.png",
  },
  {
    href: "/activity-workbooks",
    title: "Activity Workbooks",
    desc: "177 countries · Cultural learning for kids & families",
    badge: "177 Books",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/uk_birthday_mom_35350808.png",
  },
  {
    href: "/flashcards",
    title: "Flashcards",
    desc: "World flags, capitals & cultural facts",
    badge: "466 Flashcards",
    // Real flashcard front image from Google Drive
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/card_06_brazil_front_0a20dc98.png",
  },
  {
    href: "/coloring-books",
    title: "Coloring Books",
    desc: "Africa & Americas editions · Cultural art for all ages",
    badge: "2 Books",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/coloring_africa_cover.png",
  },
  {
    href: "/cookbooks",
    title: "Cookbooks",
    desc: "Multicultural recipes from around the world",
    badge: "New",
    // Real cookbook display mockup from Google Drive
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/Around_the_World_Series_Display_Mockup_dce3067e.png",
  },
  {
    href: "/baby-shower",
    title: "Baby Shower Games",
    desc: "10, 20, 30 & 40 game packs · Print at home",
    badge: "New",
    // Using Australia graduation congrats card as stand-in until baby shower mockup is available
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/australia_graduation_congrats_536f42b4.png",
  },
  {
    href: "/print-shop",
    title: "Print Shop",
    desc: "30 countries · Physical wall art posters shipped to you",
    badge: "Now Live",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/BH_birthday_mom_wall_art_8x10_427a59ed.jpg",
  },
];

const CATEGORIES = [
  { href: "/birthday",        icon: Star,          title: "Birthday Cards",        desc: "183 countries · For Mom, Dad, Son & Daughter", color: "bg-[#c0392b]",  badge: "732 Cards" },
  { href: "/anniversary",     icon: Heart,          title: "Anniversary Cards",     desc: "182 countries · Celebrate love & commitment",  color: "bg-[#8e44ad]",  badge: "182 Cards" },
  { href: "/graduation",      icon: GraduationCap,  title: "Graduation Cards",      desc: "181 countries · Boy, Girl & Congrats designs", color: "bg-[#1a3a5c]",  badge: "429 Cards" },
  { href: "/congratulations", icon: Smile,          title: "Congratulations Cards", desc: "183 countries · Vibrant celebration designs",  color: "bg-[#27ae60]",  badge: "183 Cards" },
  { href: "/thank-you",       icon: Ribbon,         title: "Thank You Cards",       desc: "182 countries · Express gratitude beautifully", color: "bg-[#d4af37]",  badge: "182 Cards" },
  { href: "/thinking-of-you", icon: Flower2,        title: "Thinking of You",       desc: "32 countries · Let someone know you care",    color: "bg-[#2980b9]",  badge: "32 Cards" },
  { href: "/get-well",        icon: Sun,            title: "Get Well Soon Cards",   desc: "182 countries · Send healing wishes",          color: "bg-[#e67e22]",  badge: "182 Cards" },
  { href: "/sympathy",        icon: Heart,          title: "Sympathy Cards",        desc: "182 countries · Comfort & compassion",         color: "bg-[#7f8c8d]",  badge: "182 Cards" },
  { href: "/mothers-day",     icon: Flower2,        title: "Mother's Day Cards",    desc: "157 countries · Honor moms worldwide",         color: "bg-[#e91e8c]",  badge: "157 Cards" },
  { href: "/fathers-day",     icon: Star,           title: "Father's Day Cards",    desc: "157 countries · Celebrate dads everywhere",    color: "bg-[#1a2744]",  badge: "157 Cards" },
  { href: "/new-year",         icon: Sparkles,       title: "Happy New Year Cards",  desc: "32 countries · Ring in the New Year",          color: "bg-[#b8860b]",  badge: "32 Cards" },
  { href: "/print-shop",         icon: Printer,        title: "Print Shop",             desc: "30 countries · Physical wall art prints shipped to you", color: "bg-[#b8860b]", badge: "Now Live" },
  { href: "/baby-shower",     icon: Baby,           title: "Baby Shower Games",     desc: "10, 20, 30 & 40 game packs — print at home",  color: "bg-[#8b1a4a]",  badge: "New" },
];

// Full list of countries available in the catalog
const ALL_COUNTRIES = ["Afghanistan","Albania","Algeria","Angola","Antigua","Argentina","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Cambodia","Cameroon","Canada","Cape Verde","Chad","Chile","China","Colombia","Comoros","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Curacao","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hungary","India","Indonesia","Iran","Iraq","Ireland","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malaysia","Maldives","Mali","Marshall Islands","Martinique","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Romania","Russia","Rwanda","Saint Kitts","Saint Lucia","Saint Vincent","Samoa","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor Leste","Togo","Tonga","Trinidad Tobago","Tunisia","Turkey","Turkmenistan","UAE","USA","Uganda","Ukraine","United Kingdom","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Western Sahara","Yemen","Zambia","Zimbabwe"];

export default function Home() {
  const [featuredCheckingOut, setFeaturedCheckingOut] = useState(false);
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSubmitted, setFooterSubmitted] = useState(false);
  const footerSubscribe = trpc.shop.subscribeNewsletter.useMutation();

  // Country search state
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
    { key: "sympathy",        label: "Sympathy" },
    { key: "get-well",        label: "Get Well" },
    { key: "mothers-day",     label: "Mother's Day" },
    { key: "fathers-day",     label: "Father's Day" },
  ];

  const countrySuggestions = countryQuery.trim().length > 0
    ? ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase())).slice(0, 8)
    : [];

  // Close dropdown when clicking outside
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
  const checkoutMutation = trpc.shop.createCheckout.useMutation();

  async function handleFeaturedBuy() {
    setFeaturedCheckingOut(true);
    try {
      const origin = window.location.origin;
      const result = await checkoutMutation.mutateAsync({
        productId: "fr_birthday_mom",
        cartItems: [{ productId: "fr_birthday_mom", name: "France Birthday Card for Mom", price: 599 }],
        successUrl: `${origin}/order-success`,
        cancelUrl: `${origin}/`,
      });
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Redirecting to secure checkout...");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed. Please try again.";
      toast.error(msg);
    } finally {
      setFeaturedCheckingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />

      {/* Hero Banner */}
      <div className="relative bg-[#1a2744] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center gap-6">
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <Globe className="w-8 h-8 text-[#d4af37]" />
              <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest">Wishes Without Borders Co</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight mb-4">
              Cards That Speak<br />
              <span className="text-[#d4af37]">Every Language</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-xl mb-6">
              Multicultural greeting cards, children's books, and classroom tools — celebrating the world's cultures, one card at a time.
            </p>

            {/* Country Search Bar */}
            <div ref={searchRef} className="relative mb-6 max-w-lg">
              {/* Category pill selector */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SEARCH_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      selectedCategory === cat.key
                        ? "bg-[#d4af37] text-[#1a2744]"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <form onSubmit={handleCountrySearch} className="flex items-center bg-white/10 border border-white/20 rounded-full overflow-visible focus-within:border-[#d4af37] transition-colors">
                <Search className="w-5 h-5 text-white/50 ml-4 shrink-0" />
                <input
                  type="text"
                  value={countryQuery}
                  onChange={(e) => { setCountryQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search by country… e.g. Japan, Brazil"
                  className="flex-1 bg-transparent text-white placeholder-white/40 text-sm px-3 py-3 outline-none"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="m-1 px-4 py-2 bg-[#d4af37] text-[#1a2744] font-bold text-sm rounded-full hover:bg-[#c9a227] transition-colors shrink-0"
                >
                  Find Cards
                </button>
              </form>
              {/* Autocomplete dropdown */}
              {showSuggestions && countrySuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {countrySuggestions.map((country) => (
                    <li key={country}>
                      <button
                        type="button"
                        onMouseDown={() => handleCountrySelect(country)}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#1a2744] hover:bg-[#f5f0e8] flex items-center gap-2 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        {country}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/birthday"
                className="px-8 py-3 bg-[#d4af37] text-[#1a2744] font-bold rounded-full hover:bg-[#c9a227] transition-colors text-sm"
              >
                Browse Cards
              </Link>
              <a
                href="mailto:info@wisheswithoutbordersco.com"
                className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-sm"
              >
                Contact Us
              </a>
            </div>
          </div>
          {BRAND.logo && (
            <div className="shrink-0">
              <img
                src={BRAND.logo}
                alt="Wishes Without Borders Co logo"
                className="w-48 md:w-64 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#d4af37]">
        <div className="max-w-7xl mx-auto px-3 py-3 grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-center gap-x-4 gap-y-1.5 text-[#1a2744] text-xs font-semibold">
          <span className="text-center whitespace-nowrap">🌍 195 Countries</span>
          <span className="text-center whitespace-nowrap">🎴 2,567 Individual Cards</span>
          <span className="text-center whitespace-nowrap">📚 Activity Workbooks</span>
          <span className="text-center whitespace-nowrap">🎉 Baby Shower Games</span>
          <span className="text-center whitespace-nowrap">⚡ Instant PDF Download</span>
          <span className="text-center whitespace-nowrap">🖨️ Print at Home</span>
        </div>
      </div>

      {/* Gold divider */}
      <hr className="gold-divider" />

      {/* Featured Card of the Week */}
      <div className="bg-[#f5f0e8] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-3xl shadow-lg overflow-hidden border border-[#e8dfc8]">
            {/* Card image */}
            <div className="md:w-2/5 w-full flex-shrink-0">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/fr_birthday_mom_4f0c002c.png"
                alt="Featured Card — France Birthday Mom"
                className="w-full h-72 md:h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1a2744/d4af37?text=Featured+Card";
                }}
              />
            </div>
            {/* Text content */}
            <div className="flex-1 px-6 py-8 md:py-10">
              <span className="inline-block bg-[#d4af37] text-[#1a2744] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                ✨ Featured Card of the Week
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#1a2744] mb-2">
                France — Birthday Mom
              </h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                A beautiful French-themed birthday card for Mom, featuring the Eiffel Tower, lavender fields, and a heartfelt message in French. Perfect for anyone celebrating a French heritage.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={handleFeaturedBuy}
                  disabled={featuredCheckingOut}
                  className="bg-[#d4af37] text-[#1a2744] font-bold px-6 py-3 rounded-full hover:bg-[#c9a227] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {featuredCheckingOut ? "Redirecting..." : "Buy Now — $5.99"}
                </button>
                <Link
                  href="/birthday"
                  className="inline-block px-6 py-3 rounded-full border-2 border-[#1a2744] text-[#1a2744] font-bold text-sm hover:bg-[#1a2744] hover:text-white transition-colors"
                >
                  Browse all birthday cards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <hr className="gold-divider" />

      {/* Browse by Category — visual image grid */}
      <div className="bg-[#f5f0e8] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#1a2744] text-center mb-2">
            Browse by Category
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            Every product is an instant digital download — print at home, send by email, or share digitally.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {BROWSE_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Card image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://placehold.co/400x300/1a2744/d4af37?text=${encodeURIComponent(cat.title)}`;
                    }}
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744]/80 via-[#1a2744]/20 to-transparent" />
                  {/* Badge */}
                  <span className="absolute top-3 right-3 bg-[#d4af37] text-[#1a2744] text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {cat.badge}
                  </span>
                </div>
                {/* Text below image */}
                <div className="bg-[#f5f0e8] px-4 py-3">
                  <h3 className="font-bold text-[#1a2744] text-sm leading-tight line-clamp-2">{cat.title}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 leading-tight line-clamp-2">{cat.desc}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-[#d4af37] group-hover:underline">
                    Shop now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <hr className="gold-divider" />

      {/* Category Grid */}
      <div className="bg-[#f5f0e8] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#1a2744] text-center mb-2">
          All Card Types
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Browse all greeting card occasions — $5.99 each · Instant PDF Download
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-[#e8dfc8] p-5 flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#1a2744] text-sm leading-tight mb-1 line-clamp-2">{cat.title}</h3>
                <p className="text-gray-400 text-xs leading-tight mb-2 line-clamp-2">{cat.desc}</p>
                <span className="px-2.5 py-0.5 bg-[#d4af37]/20 text-[#b8860b] text-xs font-semibold rounded-full">
                  {cat.badge}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      </div>

      {/* Gold divider */}
      <hr className="gold-divider" />

      {/* How It Works */}
      <div className="bg-[#1a2744] py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-white text-center mb-2">
            How It Works
          </h2>
          <p className="text-center text-white/60 text-sm mb-12">
            Get your card in 3 easy steps — no shipping, no waiting.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Browse",
                desc: "Choose your country, occasion, and card type from our collection of 2,567+ cards across 195 countries.",
              },
              {
                step: "02",
                icon: "⬇️",
                title: "Download",
                desc: "Complete your secure checkout and receive your PDF instantly — no account required.",
              },
              {
                step: "03",
                icon: "🖨️",
                title: "Print & Send",
                desc: "Print at home on any printer, or send the PDF digitally by email or text. Ready in minutes.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <span className="text-5xl">{item.icon}</span>
                  <span className="absolute -top-2 -right-4 bg-[#d4af37] text-[#1a2744] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/birthday"
              className="inline-block bg-[#d4af37] text-[#1a2744] font-bold px-8 py-3 rounded-full hover:bg-[#c9a227] transition-colors text-sm"
            >
              Start Shopping →
            </Link>
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <hr className="gold-divider" />

      {/* Testimonials */}
      <div className="bg-[#f5f0e8] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold font-serif text-[#1a2744] text-center mb-2">
            What Our Customers Say
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">Real stories from families around the world</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I sent my Nigerian grandmother a birthday card in Yoruba and she cried happy tears. She said it was the most thoughtful gift she'd ever received.",
                name: "Adaeze O.",
                location: "Houston, TX",
                card: "Nigerian Birthday Card",
              },
              {
                quote: "Finally a card that actually represents my culture. The Mexican Mother's Day card was absolutely beautiful — my mom framed it.",
                name: "Sofia R.",
                location: "Los Angeles, CA",
                card: "Mexican Mother's Day Card",
              },
              {
                quote: "I use the activity workbooks in my 4th grade classroom. My students love learning about different countries. The quality is outstanding.",
                name: "Ms. Tamara K.",
                location: "Atlanta, GA",
                card: "Activity Workbooks",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8dfc8] flex flex-col">
                <div className="text-[#d4af37] text-3xl leading-none mb-3">&ldquo;</div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1 italic">{t.quote}</p>
                <div className="mt-5 pt-4 border-t border-[#e8dfc8]">
                  <p className="font-bold text-[#1a2744] text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location} &middot; <span className="text-[#d4af37]">{t.card}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <hr className="gold-divider" />

      {/* Footer */}
      <footer className="bg-[#1a2744] text-white/60 text-center py-10 text-sm">
        {/* Email capture */}
        <div className="max-w-md mx-auto mb-8 px-4">
          <p className="text-white font-semibold text-base mb-1">Stay in the loop</p>
          <p className="text-white/50 text-xs mb-4">New countries and products added every month. Be the first to know.</p>
          {footerSubmitted ? (
            <p className="text-[#d4af37] font-semibold text-sm">You're on the list — we'll be in touch!</p>
          ) : (
            <form onSubmit={handleFooterSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              <button
                type="submit"
                disabled={footerSubscribe.isPending}
                className="bg-[#d4af37] text-[#1a2744] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#c9a227] transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {footerSubscribe.isPending ? "..." : "Notify Me"}
              </button>
            </form>
          )}
        </div>
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#d4af37]" />
            <span className="text-white font-semibold">Wishes Without Borders Co</span>
          </div>
          <p>Multicultural greeting cards & educational tools · All products are instant digital downloads</p>
          <p className="mt-1">
            <a
              href="mailto:info@wisheswithoutbordersco.com"
              className="text-[#d4af37] hover:underline"
            >
              info@wisheswithoutbordersco.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
